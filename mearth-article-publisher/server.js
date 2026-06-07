const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const slugify = require('slugify');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3000;

// Load configuration and data
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const authors = JSON.parse(fs.readFileSync('./data/authors.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
const pmhZones = JSON.parse(fs.readFileSync('./data/pmh-zones.json', 'utf8'));
const megaChallenges = JSON.parse(fs.readFileSync('./data/mega-challenges.json', 'utf8'));
const entities = JSON.parse(fs.readFileSync('./data/entities.json', 'utf8'));
const topics = JSON.parse(fs.readFileSync('./data/topics.json', 'utf8'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.validation.max_file_size_mb * 1024 * 1024 // Convert MB to bytes
  }
});

// Ensure required directories exist
const requiredDirs = [
  './uploads',
  './output',
  './output/discover',
  './output/discover/articles',
  './output/discover/articles-index',
  './output/assets',
  './output/assets/css',
  './output/assets/js',
  './output/assets/data',
  './output/authors',
  './drafts',
  './exports'
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize articles index if it doesn't exist
const articlesIndexPath = './output/assets/data/articles.json';
if (!fs.existsSync(articlesIndexPath)) {
  fs.writeFileSync(articlesIndexPath, JSON.stringify({
    articles: [],
    metadata: {
      total_articles: 0,
      generated_at: new Date().toISOString()
    }
  }, null, 2));
}

// Helper functions
function createSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function calculateReadTime(wordCount) {
  return Math.ceil(wordCount / config.defaults.read_speed_wpm);
}

function createExcerpt(text, length = config.defaults.excerpt_length) {
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length).trim() + '...';
}

// Routes

// Home - Article upload interface
app.get('/', (req, res) => {
  res.render('admin', {
    config,
    authors: authors.authors,
    categories: categories.categories,
    pmhZones: pmhZones.zones,
    megaChallenges: megaChallenges.mega_challenges,
    entities: entities.entities,
    topics: topics.topics
  });
});

// Parse uploaded document
app.post('/parse', upload.fields([
  { name: 'docx', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const docxFile = req.files['docx'] ? req.files['docx'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;

    if (!docxFile) {
      return res.status(400).json({ error: 'Word document is required' });
    }

    // Parse Word document
    const docxResult = await mammoth.convertToHtml({ path: docxFile.path });
    const html = docxResult.value;

    // Extract title, subtitle, and body
    const parsed = parseArticleHTML(html);

    res.json({
      success: true,
      data: {
        title: parsed.title,
        subtitle: parsed.subtitle,
        body: parsed.body,
        wordCount: countWords(parsed.body),
        files: {
          docx: docxFile.filename,
          pdf: pdfFile ? pdfFile.filename : null,
          image: imageFile ? imageFile.filename : null
        }
      }
    });

  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: 'Failed to parse document: ' + error.message });
  }
});

// Helper function to parse HTML from Word document
function parseArticleHTML(html) {
  // Simple HTML parsing - extract title, subtitle, body
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const subtitleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/i);

  let title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Untitled Article';
  let subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // Remove title and subtitle from body
  let body = html;
  if (titleMatch) body = body.replace(titleMatch[0], '');
  if (subtitleMatch) body = body.replace(subtitleMatch[0], '');

  // Clean up body HTML
  body = body.trim();

  return { title, subtitle, body };
}

// Generate article HTML and save
app.post('/generate', upload.fields([
  { name: 'additional_resources', maxCount: 10 }
]), async (req, res) => {
  try {
    const articleData = JSON.parse(req.body.articleData);
    const additionalResources = req.files['additional_resources'] || [];

    // Create slug from title
    const slug = createSlug(articleData.title);

    // Create article directory
    const articleDir = path.join(__dirname, 'output', 'discover', 'articles', slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    // Create resources directory if additional resources exist
    if (additionalResources.length > 0 || articleData.additional_resources) {
      const resourcesDir = path.join(articleDir, 'resources');
      if (!fs.existsSync(resourcesDir)) {
        fs.mkdirSync(resourcesDir, { recursive: true });
      }
    }

    // Copy uploaded files to article directory
    if (articleData.files.pdf) {
      const pdfSource = path.join(__dirname, 'uploads', articleData.files.pdf);
      const pdfDest = path.join(articleDir, `${slug}.pdf`);
      fs.copyFileSync(pdfSource, pdfDest);
    }

    if (articleData.files.image) {
      const imageSource = path.join(__dirname, 'uploads', articleData.files.image);
      const imageDest = path.join(articleDir, 'featured-image.jpg');
      fs.copyFileSync(imageSource, imageDest);
    }

    // Process additional resources
    const processedResources = [];
    if (articleData.additional_resources && Array.isArray(articleData.additional_resources)) {
      for (let i = 0; i < articleData.additional_resources.length; i++) {
        const resource = articleData.additional_resources[i];

        if (resource.type === 'file' && additionalResources[i]) {
          // Copy file to resources directory
          const resourceFile = additionalResources[i];
          const resourceDest = path.join(articleDir, 'resources', resourceFile.originalname);
          fs.copyFileSync(resourceFile.path, resourceDest);

          processedResources.push({
            type: resource.file_type || 'pdf',
            title: resource.title,
            description: resource.description,
            url: `${config.paths.articles}/${slug}/resources/${resourceFile.originalname}`,
            filename: resourceFile.originalname
          });
        } else if (resource.type === 'link') {
          processedResources.push({
            type: resource.link_type || 'link',
            title: resource.title,
            description: resource.description,
            url: resource.url,
            external: true
          });
        }
      }
    }

    // Prepare article metadata
    const article = {
      slug: slug,
      title: articleData.title,
      subtitle: articleData.subtitle || '',
      body: articleData.body,
      excerpt: createExcerpt(articleData.body),
      author_id: articleData.author_id || config.defaults.author_id,
      publish_date: articleData.publish_date || new Date().toISOString().split('T')[0],
      word_count: articleData.wordCount || countWords(articleData.body),
      read_time: calculateReadTime(articleData.wordCount || countWords(articleData.body)),
      featured_image: `${config.paths.articles}/${slug}/featured-image.jpg`,
      pdf_url: articleData.files.pdf ? `${config.paths.articles}/${slug}/${slug}.pdf` : null,
      primary_category: articleData.primary_category,
      pmh_zones: articleData.pmh_zones || [],
      mega_challenges: articleData.mega_challenges || [],
      topics: articleData.topics || [],
      entities: articleData.entities || [],
      additional_resources: processedResources,
      meta_description: articleData.meta_description || createExcerpt(articleData.body, 160),
      created_at: new Date().toISOString()
    };

    // Render article HTML
    const html = await renderArticlePage(article);

    // Save HTML file
    const htmlPath = path.join(articleDir, 'index.html');
    fs.writeFileSync(htmlPath, html);

    // Update articles index
    updateArticlesIndex(article);

    res.json({
      success: true,
      slug: slug,
      article: article
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate article: ' + error.message });
  }
});

// Helper function to render article page
async function renderArticlePage(article) {
  // Get author details
  const author = authors.authors.find(a => a.id === article.author_id);

  // Get category details
  const category = categories.categories.find(c => c.id === article.primary_category);

  // Get zone details
  const zones = pmhZones.zones.filter(z => article.pmh_zones.includes(z.id));

  // Get megachallenge details
  const challenges = megaChallenges.mega_challenges.filter(mc => article.mega_challenges.includes(mc.id));

  // Get topic details
  const articleTopics = topics.topics.filter(t => article.topics.includes(t.id));

  // Get entity details
  const articleEntities = entities.entities.filter(e => article.entities.includes(e.id));

  // Render using EJS template
  return new Promise((resolve, reject) => {
    app.render('article', {
      config,
      article,
      author,
      category,
      zones,
      challenges,
      topics: articleTopics,
      entities: articleEntities
    }, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

// Helper function to update articles index
function updateArticlesIndex(article) {
  const indexPath = './output/assets/data/articles.json';
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  // Remove existing entry if updating
  index.articles = index.articles.filter(a => a.slug !== article.slug);

  // Add new entry
  index.articles.push({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    author_id: article.author_id,
    publish_date: article.publish_date,
    read_time: article.read_time,
    featured_image: article.featured_image,
    pdf_url: article.pdf_url,
    primary_category: article.primary_category,
    pmh_zones: article.pmh_zones,
    mega_challenges: article.mega_challenges,
    topics: article.topics,
    entities: article.entities,
    has_additional_resources: article.additional_resources && article.additional_resources.length > 0
  });

  // Update metadata
  index.metadata.total_articles = index.articles.length;
  index.metadata.generated_at = new Date().toISOString();

  // Save updated index
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

// Export all articles as ZIP
app.get('/export', (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const zipFilename = `${config.export.zip_filename_prefix}-${timestamp}.zip`;
    const zipPath = path.join(__dirname, 'exports', zipFilename);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipPath, zipFilename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up ZIP file after download
        setTimeout(() => {
          if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
          }
        }, 10000);
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Add output directory contents to ZIP
    archive.directory('./output/', false);

    // Create upload instructions
    const instructions = `UPLOAD INSTRUCTIONS
===================

1. Extract this ZIP file
2. Upload the entire contents to your web server at:
   /public_html/discover/

3. The articles will be accessible at:
   ${config.site.url}${config.paths.articles}/{slug}/

4. The articles directory will be at:
   ${config.site.url}${config.paths.articles_index}/

5. No database or server-side code required - all static HTML.

Questions? Contact: ${config.site.contact_email}

Generated: ${new Date().toISOString()}
Total Articles: ${JSON.parse(fs.readFileSync('./output/assets/data/articles.json', 'utf8')).metadata.total_articles}
`;

    archive.append(instructions, { name: 'UPLOAD_INSTRUCTIONS.txt' });

    archive.finalize();

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export: ' + error.message });
  }
});

// Get articles list
app.get('/api/articles', (req, res) => {
  try {
    const index = JSON.parse(fs.readFileSync('./output/assets/data/articles.json', 'utf8'));
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load articles: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Mearth Article Publisher - Phase 1 MVP                     ║
║   Server running at: http://localhost:${PORT}                    ║
║                                                               ║
║   Ready to publish articles!                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
