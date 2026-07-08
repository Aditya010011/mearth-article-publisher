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

// Load configuration and data with error handling
let config, authors, categories, pmhZones, megaChallenges, entities, topics;

try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  authors = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'authors.json'), 'utf8'));
  categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8'));
  pmhZones = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'pmh-zones.json'), 'utf8'));
  megaChallenges = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'mega-challenges.json'), 'utf8'));
  entities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'entities.json'), 'utf8'));
  topics = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'topics.json'), 'utf8'));
  console.log('✓ Configuration and data files loaded successfully');
} catch (error) {
  console.error('❌ ERROR loading configuration files:', error.message);
  console.error('Make sure all data files exist in the correct locations');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename - replace spaces with hyphens, keep original extension
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + sanitized);
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
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadTime(wordCount) {
  const readSpeed = config?.defaults?.read_speed_wpm || 200;
  return Math.ceil(wordCount / readSpeed);
}

function createExcerpt(text, length = null) {
  const excerptLength = length || config?.defaults?.excerpt_length || 200;
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= excerptLength) return plainText;
  return plainText.substring(0, excerptLength).trim() + '...';
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mearth Article Publisher is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

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
  console.log('Parse endpoint called');
  console.log('Files received:', req.files);

  try {
    const docxFile = req.files['docx'] ? req.files['docx'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;

    if (!docxFile) {
      console.log('No docx file provided');
      return res.status(400).json({ error: 'Word document is required' });
    }

    console.log('Processing docx file:', docxFile.path);

    // Parse Word document
    const docxResult = await mammoth.convertToHtml({ path: docxFile.path });
    const html = docxResult.value;

    // Extract title, subtitle, and body
    const parsed = parseArticleHTML(html);

    // Check for duplicates
    const duplicateWarning = await checkDuplicateContent(parsed.title, parsed.body);

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
        },
        duplicateWarning: duplicateWarning
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

// Helper function to check for duplicate content
async function checkDuplicateContent(title, body) {
  try {
    const indexPath = path.join(__dirname, 'output', 'assets', 'data', 'articles.json');

    if (!fs.existsSync(indexPath)) {
      return null; // No articles yet, no duplicates possible
    }

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const articles = index.articles || [];

    if (articles.length === 0) return null;

    // Normalize text for comparison
    const normalizeText = (text) => {
      return text.replace(/<[^>]*>/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
    };

    const newTitleNorm = normalizeText(title);
    const newBodyNorm = normalizeText(body);
    const newBodyWords = newBodyNorm.split(' ');

    // Check each existing article
    for (const article of articles) {
      const existingTitleNorm = normalizeText(article.title);

      // Check title similarity (exact match)
      if (existingTitleNorm === newTitleNorm) {
        return {
          level: 'high',
          message: `⚠️ WARNING: An article with the same title already exists: "${article.title}"`,
          matchedArticle: article.slug,
          similarity: 100
        };
      }

      // Check content similarity (word overlap)
      // Read the article body from disk
      const articlePath = path.join(__dirname, 'output', 'discover', 'articles', article.slug, 'index.html');
      if (fs.existsSync(articlePath)) {
        const existingHTML = fs.readFileSync(articlePath, 'utf8');
        const existingBodyMatch = existingHTML.match(/<div class="prose[^>]*>(.*?)<\/div>/s);

        if (existingBodyMatch) {
          const existingBodyNorm = normalizeText(existingBodyMatch[1]);
          const existingBodyWords = existingBodyNorm.split(' ');

          // Calculate Jaccard similarity (intersection over union)
          const newSet = new Set(newBodyWords);
          const existingSet = new Set(existingBodyWords);
          const intersection = new Set([...newSet].filter(x => existingSet.has(x)));
          const union = new Set([...newSet, ...existingSet]);

          const similarity = (intersection.size / union.size) * 100;

          if (similarity > 70) {
            return {
              level: 'high',
              message: `⚠️ WARNING: Content is ${similarity.toFixed(0)}% similar to existing article: "${article.title}"`,
              matchedArticle: article.slug,
              similarity: similarity.toFixed(0)
            };
          } else if (similarity > 40) {
            return {
              level: 'medium',
              message: `⚠️ NOTICE: Content is ${similarity.toFixed(0)}% similar to existing article: "${article.title}"`,
              matchedArticle: article.slug,
              similarity: similarity.toFixed(0)
            };
          }
        }
      }
    }

    return null; // No significant duplicates found
  } catch (error) {
    console.error('Error checking duplicates:', error);
    return null; // Don't block on error
  }
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
      // Get the file extension from the original filename
      const imageExt = path.extname(articleData.files.image);
      const imageDest = path.join(articleDir, `featured-image${imageExt}`);
      fs.copyFileSync(imageSource, imageDest);
      // Store the actual image filename for use in the article
      articleData.files.imageFilename = `featured-image${imageExt}`;
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
      featured_image: articleData.files.imageFilename ? `${config.paths.articles}/${slug}/${articleData.files.imageFilename}` : null,
      pdf_url: articleData.files.pdf ? `${config.paths.articles}/${slug}/${slug}.pdf` : null,
      primary_category: articleData.primary_category,
      secondary_category: articleData.secondary_category || null,
      pmh_zones: articleData.pmh_zones || [],
      mega_challenges: articleData.mega_challenges || [],
      topics: articleData.topics || [],
      entities: articleData.entities || [],
      additional_resources: processedResources,
      meta_description: articleData.meta_description || createExcerpt(articleData.body, 160),
      contact_info: articleData.contact_info || null,
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
  const indexPath = path.join(__dirname, 'output', 'assets', 'data', 'articles.json');
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
    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const zipFilename = `${config.export.zip_filename_prefix}-${timestamp}.zip`;
    const zipPath = path.join(exportsDir, zipFilename);

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
    const outputDir = path.join(__dirname, 'output');
    archive.directory(outputDir, false);

    // Create upload instructions
    const indexData = JSON.parse(fs.readFileSync(path.join(__dirname, 'output', 'assets', 'data', 'articles.json'), 'utf8'));

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
Total Articles: ${indexData.metadata.total_articles}
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
    const indexPath = path.join(__dirname, 'output', 'assets', 'data', 'articles.json');
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load articles: ' + error.message });
  }
});

// Add new topic
app.post('/api/topics', express.json(), (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Topic ID and name are required' });
    }

    const topicsPath = path.join(__dirname, 'data', 'topics.json');
    const topicsData = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

    // Check if topic already exists
    if (topicsData.topics.find(t => t.id === id)) {
      return res.status(400).json({ success: false, error: 'Topic already exists' });
    }

    // Add new topic
    topicsData.topics.push({
      id: id,
      name: name,
      slug: id
    });

    // Update metadata
    topicsData.metadata.updated = new Date().toISOString().split('T')[0];

    // Save
    fs.writeFileSync(topicsPath, JSON.stringify(topicsData, null, 2));

    // Update in-memory topics
    topics.topics.push({ id, name, slug: id });

    res.json({ success: true, topic: { id, name, slug: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler - must be after all other routes
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Mearth Article Publisher - Phase 1 MVP                     ║
║   Server running at: http://0.0.0.0:${PORT}                    ║
║                                                               ║
║   Ready to publish articles!                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  // Log all registered routes
  console.log('\nRegistered routes:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
      console.log(`  ${methods} ${r.route.path}`);
    }
  });
});
