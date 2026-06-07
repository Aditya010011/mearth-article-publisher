# PROJECT MOON HUT - PHASE 1 MVP SPECIFICATION
## Article Publishing System (Simplified, Production-Ready)
 
**Purpose**: Define a minimal, working system to publish 200+ articles as static HTML pages with search, sort, and filter capabilities.

---

## EXECUTIVE SUMMARY

**The Problem**: 200+ finished articles and white papers exist but cannot be published to projectmoonhut.org in a structured, searchable format. Current manual process is blocking content from reaching visitors, reducing SEO visibility, and preventing organic discovery.

**The Solution**: A lightweight, local Node.js application that:
1. Takes a Word document + matching PDF + featured image as input
2. Extracts title, subtitle, and body content
3. Allows human review and manual tagging
4. Generates a static HTML article page + updated directory/index
5. Exports a package ready for upload to the existing website

**No CMS, no hosted infrastructure, no AI automation required for Phase 1.**

---

## SCOPE OF PHASE 1

###  **IN SCOPE**

- **Single content type**: Articles/white papers only
- **Local processing**: Runs on Kyle's server or Markus' local machine with Node.js
- **Manual tagging**: Human selects all categories, topics, tags
- **Static HTML output**: Pure HTML/CSS/JS (no dynamic server-side rendering)
- **Export package**: Generates folder structure ready for FTP/upload
- **Article directory**: Searchable, filterable, sortable index page
- **200+ articles**: Batch-friendly workflow

###  **OUT OF SCOPE (For Phase 1)**

- Videos, podcasts, wallpapers, infographics
- AI classification or automated tagging
- Hosted CMS or admin dashboard
- User accounts or authentication
- Analytics dashboards or reporting
- Email capture automation
- Real-time collaboration
- Automatic deployment to website

---

## SYSTEM ARCHITECTURE

### High-Level Flow

```
┌──────────────────┐
│ 1. UPLOAD FILES  │  User provides: article.docx, article.pdf, featured.jpg
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. PARSE & SHOW  │  System extracts content, displays in web form
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. HUMAN REVIEW  │  User reviews/edits content, selects tags manually
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. GENERATE HTML │  System creates static article page + updates index
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. EXPORT BUNDLE │  Output folder ready for Markus to upload to site
└──────────────────┘
```

### Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Runtime** | Node.js 18+ | Required for local processing |
| **Document Parsing** | `mammoth.js` (Word), `pdf-parse` (PDF) | Reliable, lightweight libraries |
| **Web Interface** | Express.js + simple HTML forms | Minimal, no build step needed |
| **Static Site Generation** | EJS templates | Simple templating, no React complexity |
| **Data Storage** | JSON files (flat file database) | No PostgreSQL/MongoDB required |
| **Styling** | Tailwind CSS (CDN) | Fast styling, no build process |

**Total Dependencies**: ~6 npm packages  
**Setup Time**: <30 minutes  
**No cloud hosting required**

---

## DETAILED FEATURE SPECIFICATIONS

### Feature 1: File Upload & Content Extraction

#### Inputs
- **Word Document** (`.docx`): Contains article text, may include images
- **PDF File** (`.pdf`): Matching PDF for download
- **Featured Image** (`.jpg`, `.png`): Header image for the article

#### Process
1. User drags files into web interface (running on `http://localhost:3000`)
2. System extracts:
   - **Title**: First Heading 1 or largest bold text
   - **Subtitle**: Second Heading 1 or italicized text below title
   - **Body**: All paragraphs converted to clean HTML
   - **Word Count**: Auto-calculated
3. System copies PDF and featured image to output folder

#### Output
- Parsed content displayed in editable form
- Images embedded in preview

#### Edge Cases
- **No title found**: Prompt user to enter manually
- **Complex Word formatting**: Strip to clean HTML (no tables, no custom fonts)
- **Large files**: Support up to 50-page documents (~30,000 words)

---

### Feature 2: Human Review & Tagging Interface

#### Web Form Fields

**SECTION A: Core Content** (pre-filled from extraction)
- Title (editable text input)
- Subtitle (editable text input)
- Body (plain textarea with HTML - safer than rich editor for Phase 1)
- Author (dropdown - defaults to "David Goldsmith", can add new authors)
- Publish Date (date picker, defaults to today)

> **Design Decision**: Using plain textarea instead of rich editor to avoid formatting corruption. The HTML extracted from Word is already clean. You can make minor edits directly in the textarea.

**SECTION B: Primary Classification** (required)
- **Primary Category** (dropdown, single-select):
  1. Leadership & Decision-Making
  2. Innovation & Systems Thinking
  3. Mearth Framework (Earth–Moon Construct)
  4. Economy, Finance & Markets
  5. Technology & Engineering
  6. Robotics & Automation
  7. Energy & Power Systems
  8. Materials, Mining & Supply Chains
  9. Food, Agriculture & Bio-Systems
  10. Water, Environment & Resilience
  11. Education & Learning Systems
  12. Governance, Law & Standards
  13. Human Behavior & Psychology
  14. Infrastructure & Logistics

**SECTION C: PMH Classification System** (multi-select checkboxes)
- ☐ Zone 1: Earth
- ☐ Zone 2: Atmosphere
- ☐ Zone 3: Low Earth Orbit (LEO)
- ☐ Zone 4: Medium Earth Orbit (MEO)
- ☐ Zone 5: High Earth Orbit (HEO)
- ☐ Zone 6: Space Between HEO and Moon Orbit
- ☐ Zone 7: Moon Orbit
- ☐ Zone 8: The Moon
- ☐ Zone 9: The Mearth Line
- ☐ Zone 10: Space Between Moon and Mars
- ☐ Zone 11: Mars Atmosphere/Orbit
- ☐ Zone 12: Mars
- ☐ Zone 13: Phobos
- ☐ Zone 14: Deimos
- ☐ Zone 15: Beyond

**SECTION D: MegaChallenges** (multi-select checkboxes)

> **Note**: These are six interconnected MegaChallenges that exist simultaneously and influence one another continuously. No numerical order or ranking implied.

- ☐ Climate Change
- ☐ Mass Extinction
- ☐ Ecosystems Collapses
- ☐ Displacement
- ☐ Unrest
- ☐ Explosive Impact

**SECTION E: Topics** (multi-select, type to filter)
- (Controlled list from updated PMH.md)
- Searchable dropdown with checkboxes

**SECTION F: Entity Associations** (multi-select checkboxes)
- ☐ MearthLink
- ☐ Mearth Space Industries
- ☐ Mearth Cultiva
- ☐ Mearth Habitus
- ☐ Mearth Energy
- ☐ Mearth Eterna
- ☐ Project Moon Hut Foundation

**SECTION G: Files** (auto-populated, verify)
- Featured Image: `featured-image.jpg` ✓
- PDF Download: `article.pdf` ✓

**SECTION H: Additional Resources** (optional, repeatable)

> **NEW**: Add supplementary documents, graphics, videos, or external links

Add as many additional resources as needed. Each resource has:
- **Type** (dropdown):
  - 📄 PDF Document (supplementary PDF, infographic, chart)
  - 🖼️ Image/Graphic (additional diagram, model, visualization)
  - 🎥 Video Link (YouTube, Vimeo, etc.)
  - 🔗 External Link (source document, reference, related article)
  - 📊 Presentation/Deck (slides, keynote export)
- **Title** (text input): "Supply Chain Infographic", "Related YouTube Video", etc.
- **Description** (optional, 1 line): Brief explanation of what this resource is
- **File/URL**:
  - If file: Upload button (PDF, JPG, PNG, etc.)
  - If link: URL input field
- **Display Order** (auto-numbered, can drag to reorder)

**Example Additional Resources**:
```
1. [PDF] Supply Chain Resilience Infographic
   Description: Visual model of the framework discussed in the article

2. [Video] 5-Minute Overview on YouTube
   URL: https://youtube.com/watch?v=abc123
   Description: Video explainer for this concept

3. [Link] Original Research Paper
   URL: https://example.org/research/paper.pdf
   Description: Source document referenced in Section 3
```

**How it displays on article page**:
- Shown in sidebar or at end of article
- Icons for each type (PDF, video, link)
- Click to download file or open link in new tab
- Tracked separately from main PDF download

**Batch Processing Support**:
- CSV can include `additional_resources` column with pipe-separated entries:
  ```
  additional_resources
  "PDF|Infographic.pdf|Supply Chain Model|Visual framework|video|https://youtube.com/watch?v=abc123|Overview Video|5-min explainer"
  ```

**SECTION I: SEO (optional)**
- Meta Description (160 characters, auto-generated from first paragraph if blank)
- Custom URL Slug (auto-generated from title if blank)

#### Actions
- **Preview** → Opens rendered HTML in new tab
- **Save Draft** → Saves to `drafts/` folder as JSON
- **Generate & Export** → Creates final HTML + updates index

---

### Feature 3: Static HTML Page Generation

#### Template Structure

Each article generates a standalone HTML file at:
```
/output/discover/articles/{slug}/index.html
```

**Example**: `/output/discover/articles/redesigning-supply-chains/index.html`

> **Note**: The base path `/discover/articles/` is configurable to match your live site structure. Markus can adjust this in `config.json` without code changes.

#### Page Sections

1. **Header Navigation** (consistent across all pages)
   - Logo + link to home
   - Main nav: Discover → Articles, Podcasts, Videos, etc.
   - Breadcrumb: Home → Articles → {Category} → {Title}

2. **Article Header**
   - Featured image (full-width or contained)
   - Primary category badge
   - Title (H1)
   - Subtitle (H2)
   - Author info with photo (if available) + publish date
   - Read time estimate (word count / 200)

3. **Article Body**
   - Clean semantic HTML
   - Proper heading hierarchy (H3, H4)
   - Paragraph spacing
   - Pull quotes (if detected)
   - Inline images (if extracted from Word)

4. **Additional Resources Section** (if any added)
   - Sidebar or end-of-article section
   - Each resource displayed with icon + title + description
   - Resources grouped by type:
     - 📄 Documents (PDFs, reports)
     - 🖼️ Graphics & Visuals
     - 🎥 Videos
     - 🔗 External Links
   - Click to download/view/open in new tab

5. **Article Footer**
   - Tag cloud: PMH Classifications, MegaChallenges, Topics, Entities
   - Primary PDF download button (links to `/output/articles/{slug}/{slug}.pdf`)
   - Share buttons (LinkedIn, X/Twitter, Email)

6. **Author Bio**
   - Author name, title, organization
   - Short bio (from author database)
   - Social links (if available)

6. **Related Articles** (future enhancement - can be empty for Phase 1)

#### Additional Resources Example (HTML Structure)

```html
<aside class="additional-resources">
  <h3>Additional Resources</h3>

  <div class="resource-group">
    <h4>📄 Documents</h4>
    <div class="resource-item">
      <a href="/discover/articles/supply-chains/infographic.pdf" target="_blank">
        <span class="icon">📄</span>
        <span class="title">Supply Chain Resilience Infographic</span>
      </a>
      <p class="description">Visual model of the framework discussed in the article</p>
    </div>
  </div>

  <div class="resource-group">
    <h4>🎥 Videos</h4>
    <div class="resource-item">
      <a href="https://youtube.com/watch?v=abc123" target="_blank" rel="noopener">
        <span class="icon">🎥</span>
        <span class="title">5-Minute Overview</span>
      </a>
      <p class="description">Video explainer for this concept</p>
    </div>
  </div>

  <div class="resource-group">
    <h4>🔗 External References</h4>
    <div class="resource-item">
      <a href="https://example.org/research/paper.pdf" target="_blank" rel="noopener">
        <span class="icon">🔗</span>
        <span class="title">Original Research Paper</span>
      </a>
      <p class="description">Source document referenced in Section 3</p>
    </div>
  </div>
</aside>
```

7. **Site Footer** (consistent across all pages)

#### Schema.org Markup

Embedded JSON-LD in `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "author": {"@type": "Person", "name": "{author}"},
  "datePublished": "{publish_date}",
  "image": "{featured_image_url}",
  "articleSection": "{primary_category}",
  "keywords": "{topics_comma_separated}",
  "wordCount": {word_count}
}
```

#### File Output Structure

```
/output/
├── discover/
│   ├── articles/
│   │   ├── redesigning-supply-chains/
│   │   │   ├── index.html
│   │   │   ├── redesigning-supply-chains.pdf (main PDF)
│   │   │   ├── featured-image.jpg
│   │   │   ├── resources/                     (additional resources folder)
│   │   │   │   ├── infographic.pdf
│   │   │   │   ├── chart-01.png
│   │   │   │   └── model-diagram.jpg
│   │   ├── moon-economic-framework/
│   │   │   ├── index.html
│   │   │   ├── moon-economic-framework.pdf
│   │   │   ├── featured-image.jpg
│   │   │   └── resources/                     (if any additional resources)
│   │   └── ... (all 200 articles)
│   └── articles-index/
│       └── index.html (directory page)
├── assets/
│   ├── css/
│   │   └── styles.css (single stylesheet for all pages)
│   ├── js/
│   │   └── filter.js (client-side filtering)
│   └── data/
│       └── articles.json (index data for filtering)
├── authors/
│   ├── david-goldsmith.jpg
│   └── ... (other author photos as added)
└── config.json (site configuration - domain, branding, paths)
```

---

### Feature 4: Articles Directory / Index Page

#### Purpose
Single page that lists all published articles with search, filter, and sort capabilities.

#### URL
`/output/articles-index/index.html`

#### Page Layout

```
┌────────────────────────────────────────────────────────────┐
│  PROJECT MOON HUT                                          │
│  [Home] [About] [Discover ▼] [Contact]                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Articles & White Papers                                   │
│  Explore 203 articles across the Mearth ecosystem         │
│                                                            │
│  [Search: _______________________] [🔍]                    │
│                                                            │
├──────────────────┬─────────────────────────────────────────┤
│ FILTERS          │  RESULTS (203 articles)                │
│                  │  Sort by: [Recent ▼]                   │
│ Primary Category │                                        │
│ ☐ Leadership(18) │  ┌────────────────────────────────┐   │
│ ☐ Materials (15) │  │ [Featured Image Thumbnail]     │   │
│ ☐ Innovation(24) │  │ Leadership & Decision-Making   │   │
│ [Show all 14...] │  │ Redesigning Supply Chains...   │   │
│                  │  │ By Dr. Sarah Chen | Apr 15     │   │
│ PMH Zones        │  │ 13 min read | PMH Zones: 1,8,9 │   │
│ ☐ Earth (52)     │  │ [Read Article] [Download PDF]  │   │
│ ☐ LEO (38)       │  └────────────────────────────────┘   │
│ ☐ Moon (67)      │                                        │
│ [Show all 15...] │  ┌────────────────────────────────┐   │
│                  │  │ [Another Article Card]         │   │
│ MegaChallenges   │  └────────────────────────────────┘   │
│ ☐ Challenge 1    │                                        │
│ ☐ Challenge 2    │  [Load More] or [1] [2] [3] [4]...   │
│                  │                                        │
│ Entities         │                                        │
│ ☐ MearthLink(42) │                                        │
│ ☐ PMH Found.(28) │                                        │
│                  │                                        │
│ [Clear Filters]  │                                        │
└──────────────────┴─────────────────────────────────────────┘
```

#### Client-Side Filtering Logic

**Data Source**: `/assets/data/articles.json`

```json
{
  "articles": [
    {
      "slug": "redesigning-supply-chains",
      "title": "Redesigning Global Supply Chains for Resilience",
      "excerpt": "A systems approach to supply chain architecture...",
      "author": "Dr. Sarah Chen",
      "publish_date": "2026-04-15",
      "read_time": 13,
      "featured_image": "/articles/redesigning-supply-chains/featured-image.jpg",
      "pdf_url": "/articles/redesigning-supply-chains/redesigning-supply-chains.pdf",
      "primary_category": "materials-mining-supply-chains",
      "pmh_zones": [1, 8, 9],
      "mega_challenges": ["climate-change", "ecosystems-collapses"],
      "topics": ["supply-chain", "resilience", "logistics"],
      "entities": ["mearthlink", "mearth-space-industries"],
      "additional_resources": [
        {
          "type": "pdf",
          "title": "Supply Chain Infographic",
          "description": "Visual model of the framework",
          "url": "/articles/redesigning-supply-chains/resources/infographic.pdf"
        },
        {
          "type": "video",
          "title": "5-Minute Overview",
          "description": "Video explainer for this concept",
          "url": "https://youtube.com/watch?v=abc123"
        },
        {
          "type": "link",
          "title": "Original Research Paper",
          "description": "Source document referenced in Section 3",
          "url": "https://example.org/research/paper.pdf"
        }
      ]
    }
    // ... 202 more articles
  ],
  "metadata": {
    "total_articles": 203,
    "generated_at": "2026-05-19T10:00:00Z"
  }
}
```

**JavaScript Filter Implementation**:
- Load `articles.json` on page load
- Filter array based on selected checkboxes
- Re-render article cards dynamically
- Update counts in filter sidebar
- No page reload required

#### Sort Options
- **Recent First** (default)
- **Oldest First**
- **Title (A-Z)**
- **Title (Z-A)**
- **Most Read** (future: requires view tracking)

#### Search Functionality
- Simple text matching on title + excerpt
- Highlights matching terms in results
- Updates in real-time as user types

---

### Feature 5: Author Database (Simple)

#### Storage
Single JSON file: `/data/authors.json`

```json
{
  "authors": [
    {
      "id": "david-goldsmith",
      "full_name": "David Goldsmith",
      "title": "Founder",
      "organization": "Project Moon Hut Foundation / Mearth",
      "bio": "Author of Paid to THINK, strategist, and founder of Project Moon Hut and the Mearth initiative. Leading the development of the Earth-Moon economic ecosystem.",
      "photo": "/authors/david-goldsmith.jpg",
      "linkedin": "https://linkedin.com/in/davidgoldsmith",
      "website": "https://davidgoldsmith.com",
      "is_default": true
    }
  ]
}
```

#### Management
- **David Goldsmith pre-configured as default author**
- Simple web form to add/edit additional authors
- Referenced by `author_id` in article metadata
- Can be manually edited in JSON file if needed
- Author selection dropdown defaults to David Goldsmith

---

### Feature 6: Export Package for Upload

#### What Gets Exported

After clicking **"Generate & Export"**, system creates:

```
/export-{timestamp}/
├── articles/               (all article folders)
├── articles-index/         (directory page)
├── assets/                 (CSS, JS, data files)
├── authors/                (author photos)
├── UPLOAD_INSTRUCTIONS.txt (for Markus)
└── sitemap.xml             (auto-generated for SEO)
```

#### Upload Instructions (Auto-Generated)

```txt
UPLOAD INSTRUCTIONS
===================

1. Extract this ZIP file
2. Upload the entire contents to your web server at:
   /public_html/discover/

3. The articles will be accessible at:
   https://projectmoonhut.org/discover/articles/{slug}/

4. The articles directory will be at:
   https://projectmoonhut.org/discover/articles-index/

5. Submit the sitemap to Google Search Console:
   https://projectmoonhut.org/discover/sitemap.xml

6. No database or server-side code required - all static HTML.

Questions? Contact: [email]
```

---

## USER WORKFLOW (END-TO-END)

### Scenario: Publishing One Article

**Time Estimate**: 15-20 minutes per article (including review)

1. **Start Local Server** (one-time per session)
   ```bash
   cd pmh-article-publisher
   npm start
   # Server running at http://localhost:3000
   ```

2. **Upload Files**
   - Navigate to http://localhost:3000
   - Drag `article.docx`, `article.pdf`, `featured.jpg` into upload zone
   - Click "Parse Document"
   - Wait ~5 seconds for extraction

3. **Review & Edit**
   - Check extracted title, subtitle, body
   - Make any corrections to text
   - Select author from dropdown (or add new)
   - Choose primary category (required)
   - Check relevant PMH Zones (1-15)
   - Check relevant MegaChallenges (1-6)
   - Add topics from list
   - Select entity associations
   - **Time**: 10-15 minutes

4. **Preview**
   - Click "Preview" button
   - New tab opens showing rendered article page
   - Check layout, images, formatting
   - Close tab, make edits if needed

5. **Generate & Export**
   - Click "Generate & Export" button
   - System creates HTML page
   - System updates `articles.json` index
   - Success message: "Article published! Added to export package."
   - **Time**: ~10 seconds

6. **Repeat for More Articles** (or batch process)

7. **Export Final Package** (once all articles are ready)
   - Click "Export All for Upload"
   - System creates ZIP file: `pmh-articles-export-2026-05-19.zip`
   - Download ZIP (~100MB for 200 articles)

8. **Hand Off to Markus**
   - Send ZIP file to Markus
   - Markus uploads to `projectmoonhut.org/discover/`
   - Articles go live immediately (no database setup needed)

---

## BATCH PROCESSING (For 200 Articles)

### Challenge
Processing 200 articles one-by-one would take 50+ hours.

### Solution: Semi-Automated Batch Mode

#### Preparation Phase (User Does Once)
1. Organize files in folder structure:
   ```
   /articles-to-publish/
   ├── article-001/
   │   ├── article-001.docx
   │   ├── article-001.pdf
   │   └── featured-001.jpg
   ├── article-002/
   │   ├── article-002.docx
   │   ├── article-002.pdf
   │   └── featured-002.jpg
   └── ... (200 folders)
   ```

2. Create a CSV metadata file (can be done in Excel):
   ```csv
   folder,author_id,primary_category,pmh_zones,mega_challenges,topics,entities
   article-001,david-goldsmith,mearth-framework,"8,9",2,"moon,infrastructure","mearthlink,pmh-foundation"
   article-002,sarah-chen,materials-supply-chains,"1,8","3,5","supply-chain,resilience","mearthlink"
   ...
   ```

#### Batch Processing (System Does Automatically)
1. User clicks "Batch Process" in web UI
2. Selects `/articles-to-publish/` folder and `metadata.csv`
3. System processes each article:
   - Extract content from Word doc
   - Apply metadata from CSV row
   - Generate HTML page
   - Add to index
   - Show progress: "Processing 47 of 200..."
4. **Time**: ~2 hours for 200 articles (fully automated)
5. User reviews any flagged errors (e.g., missing images, parse failures)
6. Export final package

#### Error Handling
- Articles with parse errors saved to `/review-queue/`
- User can manually fix and re-process
- Continue batch for remaining articles

---

## TECHNICAL IMPLEMENTATION DETAILS

### Configuration File (config.json)

All site-specific settings are configurable without touching code:

```json
{
  "site": {
    "name": "Mearth",
    "url": "https://mearth.com",
    "description": "Exploring the Earth-Moon economic ecosystem"
  },
  "paths": {
    "base": "/discover",
    "articles": "/discover/articles",
    "assets": "/assets"
  },
  "branding": {
    "logo": "/assets/images/mearth-logo.png",
    "primary_color": "#1a365d",
    "secondary_color": "#2d3748"
  },
  "defaults": {
    "author_id": "david-goldsmith"
  }
}
```

> **Flexibility Note**: You can easily switch between Mearth.com and ProjectMoonHut.org contexts by updating `config.json`. No code changes needed.

### Dependencies (package.json)

```json
{
  "name": "mearth-article-publisher",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mammoth": "^1.6.0",
    "pdf-parse": "^1.1.1",
    "ejs": "^3.1.9",
    "multer": "^1.4.5-lts.1",
    "csv-parser": "^3.0.0"
  }
}
```

**Total Install Size**: ~25MB

### File Structure

```
mearth-article-publisher/
├── server.js                 (Express app - 200 lines)
├── package.json
├── config.json               (site configuration - EDITABLE)
├── data/
│   ├── authors.json          (author database - starts with David Goldsmith)
│   ├── categories.json       (14 categories with definitions)
│   ├── pmh-zones.json        (15 zones with descriptions)
│   ├── mega-challenges.json  (6 MegaChallenges - named, not numbered)
│   ├── topics.json           (controlled topics list)
│   └── entities.json         (entity list)
├── templates/
│   ├── article.ejs           (article page template)
│   ├── index.ejs             (directory page template)
│   └── admin.ejs             (upload/edit form)
├── output/                   (generated HTML files)
│   ├── articles/
│   ├── articles-index/
│   ├── assets/
│   └── authors/
├── uploads/                  (temporary upload folder)
└── README.md                 (setup instructions)
```

### Server.js (Core Logic Outline)

```javascript
const express = require('express');
const mammoth = require('mammoth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Route: Upload page
app.get('/', (req, res) => {
  res.render('admin', {
    authors: loadAuthors(),
    categories: loadCategories(),
    // ... load other taxonomy data
  });
});

// Route: Parse uploaded Word document
app.post('/parse', upload.fields([
  { name: 'docx', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  const docxPath = req.files['docx'][0].path;

  // Extract content using mammoth
  const result = await mammoth.convertToHtml({ path: docxPath });
  const html = result.value;

  // Parse title, subtitle, body
  const parsed = parseArticleHTML(html);

  res.json({
    title: parsed.title,
    subtitle: parsed.subtitle,
    body: parsed.body,
    wordCount: countWords(parsed.body)
  });
});

// Route: Generate HTML and save
app.post('/generate', (req, res) => {
  const articleData = req.body; // All form data

  // Create slug from title
  const slug = createSlug(articleData.title);

  // Create article folder
  const articlePath = path.join(__dirname, 'output', 'articles', slug);
  fs.mkdirSync(articlePath, { recursive: true });

  // Copy PDF and image to article folder
  copyFiles(articleData.files, articlePath);

  // Render article HTML from template
  const html = renderTemplate('article', articleData);
  fs.writeFileSync(path.join(articlePath, 'index.html'), html);

  // Update articles.json index
  updateArticlesIndex(articleData);

  res.json({ success: true, slug: slug });
});

// Route: Export final package
app.get('/export', (req, res) => {
  // Create ZIP of /output folder
  const zipPath = createExportZip();
  res.download(zipPath);
});

// Helper functions
function parseArticleHTML(html) {
  // Extract title (first H1), subtitle (first H2), body (rest)
  // Return { title, subtitle, body }
}

function createSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function updateArticlesIndex(articleData) {
  const indexPath = path.join(__dirname, 'output', 'assets', 'data', 'articles.json');
  const index = JSON.parse(fs.readFileSync(indexPath));
  index.articles.push({
    slug: articleData.slug,
    title: articleData.title,
    // ... other metadata
  });
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

app.listen(3000, () => {
  console.log('PMH Article Publisher running at http://localhost:3000');
});
```

**Total Code**: ~500 lines for complete working system

---

## SETUP INSTRUCTIONS (For Kyle's Server or Local Machine)

### Prerequisites
- **Node.js 18+** installed
- **Text editor** (VS Code recommended)
- **Web browser** (Chrome, Firefox, etc.)

### Installation (5 minutes)

```bash
# 1. Clone or download the project
git clone https://github.com/pmh/article-publisher.git
cd article-publisher

# 2. Install dependencies
npm install

# 3. Verify data files exist
ls data/  # Should show authors.json, categories.json, etc.

# 4. Start the server
npm start

# Output: "PMH Article Publisher running at http://localhost:3000"
```

### First Use

1. Open browser to `http://localhost:3000`
2. You should see the upload form
3. Test with one sample article
4. Verify output in `/output/articles/` folder
5. Open generated HTML file in browser to preview

---

## TESTING PLAN

### Phase 1: Single Article Test (Week 1)

**Test Article**: Use one finished article (5-10 pages)

**Test Checklist**:
-  Word document parses correctly
-  Title, subtitle extracted accurately
-  Body HTML is clean (no formatting issues)
-  Featured image displays correctly
-  PDF download link works
-  Manual tagging saves properly
-  Generated HTML renders correctly in browser
-  Articles index updates with new entry
-  Search and filter work on index page
-  Schema.org markup is valid (use Google Rich Results Test)
-  Export ZIP contains all necessary files

**Success Criteria**: Article is indistinguishable from a hand-coded HTML page

### Phase 2: Batch Test (Week 2)

**Test Set**: 10 articles with varying characteristics
- 1 short article (2 pages)
- 3 medium articles (5-10 pages)
- 3 long articles (15-25 pages)
- 2 articles with complex formatting (tables, images)
- 1 article with unusual characters or special formatting

**Test Checklist**:
-  CSV metadata import works
-  Batch processing completes without crashing
-  Error handling for problematic files
-  All 10 articles generate correctly
-  Index page shows all 10 articles
-  Filtering works with multiple articles
-  Export package is reasonable size

**Success Criteria**: 8/10 articles process without manual intervention

### Phase 3: Full Production (Week 3-4)

**Test Set**: All 200 articles

**Process**:
1. Organize all article files in batch structure
2. Create metadata CSV (can copy/paste from existing documentation)
3. Run batch processor
4. Review flagged errors (~10-20 articles expected)
5. Manually fix error cases
6. Re-run batch for fixed articles
7. Generate final export package
8. Markus uploads to projectmoonhut.org
9. Verify 10 random articles live on site
10. Submit sitemap to Google Search Console

**Success Criteria**: 200 articles published, searchable, and indexed by Google within 2 weeks

---

## DELIVERABLES

### Build Core System
-  Express server with upload form
-  Word/PDF parsing
-  HTML template for articles
-  Basic index page
-  Test with 1 article

### Add Features & Batch Processing
-  Complete tagging interface (all taxonomies)
-  CSV batch import
-  Search and filter on index page
-  Export package creation
-  Test with 10 articles

### Production Run
-  Process all 200 articles
-  Quality review
-  Generate final export package
-  Documentation for Markus

### Deploy & Monitor
-  Markus uploads to site
-  Verify live articles
-  Submit sitemap to Google
-  Monitor for any issues
-  Gather feedback for Phase 2


## SUCCESS METRICS

### Technical Metrics
- **Page Load Time**: <2 seconds (static HTML should be instant)
- **Parse Success Rate**: >90% of Word docs parse cleanly
- **Processing Time**: <30 seconds per article (automated)

### Business Metrics
- **Articles Published**: 200+ within 4 weeks
- **Google Indexing**: 80%+ of articles indexed within 2 weeks
- **User Engagement**: (measure after launch)
  - Time on site >3 minutes
  - Bounce rate <50%
  - Articles per session >1.5

### Content Metrics
- **SEO Visibility**: Articles appear in search results for relevant keywords
- **PDF Downloads**: Track via simple counter
- **Shareability**: Articles can be linked from LinkedIn, X, etc.

---

## FUTURE ENHANCEMENTS (Phase 2+)

Once Phase 1 is proven, consider:

### Phase 2: Podcasts
- Similar workflow: Upload audio file + transcript + guest info
- Generate static HTML episode pages
- Podcast directory with filters

### Phase 3: AI-Assisted Tagging
- Integrate OpenAI API to suggest categories and tags
- Human still reviews and approves
- Reduces manual tagging time from 10 min to 2 min

### Phase 4: Videos
- YouTube integration
- Transcript extraction
- Video directory

### Phase 5: Analytics Dashboard
- Track most-read articles
- See which tags are most popular
- Monitor search queries
- Simple Google Analytics integration

### Phase 6: CMS Migration
- Once workflow is proven, consider migrating to hosted CMS
- Payload CMS or Sanity as recommended in full architecture doc
- Keep same HTML output structure

---

## RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Word doc parsing fails for complex documents | Medium | Medium | Manual fallback: user can edit extracted content in form |
| 200 articles too many to process in 4 weeks | Low | Medium | Batch processing automation + clear error handling |
| Markus has trouble uploading to server | Low | Low | Provide clear instructions + test with 10 articles first |
| Google doesn't index static pages | Very Low | High | Submit sitemap, verify robots.txt allows crawling |
| Users can't find articles (poor UX) | Medium | High | Test search/filter with sample users before full rollout |
| System only works on one machine | Low | Medium | Document setup process, create GitHub repo for backup |

---

## OPEN QUESTIONS (Need Answers Before Starting)

1. **MegaChallenges Names**: What are the 6 MegaChallenges? (Need names for checkboxes)

2. **Topics List**: Do you have a controlled list of topics? If not, should we create one from existing articles?

3. **Author Data**: Do you have a list of all authors with their bios, titles, and social links? Or should we build this as we process articles?

4. **Existing Website Structure**: What is the current folder structure of projectmoonhut.org? Where should articles live?
   - Proposed: `/discover/articles/{slug}/`
   - Proposed: `/discover/articles-index/`

5. **Node.js on Server**: Can Kyle's server run Node.js? If not, should we run locally on Markus' machine?

6. **File Naming Convention**: Are article files already named consistently? Or do we need a naming guide?

7. **Featured Images**: Do all 200 articles have a featured image? If not, should we have a default/placeholder?

8. **PDF Availability**: Do all articles have a matching PDF? Or is PDF optional?

9. **Author Photos**: Do you have author headshots available? Or should we pull from LinkedIn?

10. **Existing Site Design**: Should the generated HTML match your current site design (colors, fonts, header/footer)? Can you provide CSS or a screenshot?

---

## DECISION MATRIX (Choose Your Approach)

### Option A: Simple & Fast (Recommended for Phase 1)
- **Manual tagging only** (no AI)
- **Basic search** (text matching)
- **Simple design** (clean but generic)
- **Local processing** (Node.js on Kyle's server or Markus' laptop)

### Option B: Semi-Automated
- **AI-suggested tags** (human reviews/approves)
- **Advanced search** (Algolia integration)
- **Custom design** (matches existing site perfectly)
- **Cloud processing** (hosted on Vercel/Railway)

### Option C: Full System (From Original Doc)
- **Complete CMS** with dashboards
- **Multi-content types** (articles, videos, podcasts)
- **Advanced automation** with analytics
- **Hosted infrastructure** with CI/CD

**My Recommendation**: Start with **Option A**, prove the workflow with 10 articles, then decide if you need Option B features.

---

## NEXT STEPS

### If You Approve This Plan

1. **Answer Open Questions** (Week 0)
   - Provide MegaChallenges list
   - Confirm topics list or let us extract from articles
   - Confirm server setup (Kyle's server vs. local)

2. **Gather Sample Files** (Week 0)
   - 3 representative articles (Word + PDF + image)
   - Author information for those 3 articles
   - Screenshot of current website for design reference

3. **Kick Off Development** (Week 1)
   - Developer starts building core system
   - Test with 1 article by end of week

4. **Iterate & Test** (Week 2)
   - Refine based on feedback
   - Test with 10 articles
   - Get approval to proceed to full batch

5. **Full Production Run** (Week 3)
   - Process all 200 articles
   - Quality review
   - Generate export package

6. **Deploy & Monitor** (Week 4)
   - Markus uploads to site
   - Verify live
   - Submit to Google
   - Celebrate! 🎉

---

## APPENDICES

### Appendix A: Sample Metadata CSV

```csv
folder,title,author_id,primary_category,pmh_zones,mega_challenges,topics,entities,publish_date
article-001,"Redesigning Supply Chains",sarah-chen,materials-mining-supply-chains,"1,8,9","3,5","supply-chain,resilience,logistics","mearthlink,mearth-space",2026-04-15
article-002,"Moon Economic Framework",david-goldsmith,mearth-framework,"8,9",2,"moon,economy,infrastructure","pmh-foundation,mearthlink",2026-03-10
```

**How to Create This**:
1. Open Excel/Google Sheets
2. Create columns as shown above
3. One row per article
4. Export as CSV
5. Use in batch processor

### Appendix B: Sample `authors.json`

```json
{
  "authors": [
    {
      "id": "david-goldsmith",
      "full_name": "David Goldsmith",
      "title": "Founder",
      "organization": "Project Moon Hut Foundation",
      "bio": "Author of Paid to THINK, strategist, and founder of Project Moon Hut...",
      "photo": "/authors/david-goldsmith.jpg",
      "linkedin": "https://linkedin.com/in/davidgoldsmith",
      "website": "https://davidgoldsmith.com"
    },
    {
      "id": "sarah-chen",
      "full_name": "Dr. Sarah Chen",
      "title": "Chief Systems Architect",
      "organization": "Mearth Space Industries",
      "bio": "Expert in supply chain resilience and complex systems design...",
      "photo": "/authors/sarah-chen.jpg",
      "linkedin": "https://linkedin.com/in/sarahchen"
    }
  ]
}
```

### Appendix C: Sample Generated HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redesigning Supply Chains | Project Moon Hut</title>
  <meta name="description" content="A systems approach to supply chain...">
  <link rel="stylesheet" href="/assets/css/styles.css">

  <!-- Schema.org markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Redesigning Supply Chains for Resilience",
    "author": {"@type": "Person", "name": "Dr. Sarah Chen"},
    "datePublished": "2026-04-15",
    "image": "/articles/redesigning-supply-chains/featured.jpg",
    "articleSection": "Materials, Mining & Supply Chains"
  }
  </script>
</head>
<body>
  <!-- Header/Nav (consistent across all pages) -->
  <header>
    <nav><!-- Logo, menu, etc. --></nav>
  </header>

  <main>
    <article>
      <img src="featured.jpg" alt="Featured image">

      <div class="article-meta">
        <span class="category">Materials, Mining & Supply Chains</span>
      </div>

      <h1>Redesigning Supply Chains for Resilience</h1>
      <h2>A systems approach to supply chain architecture</h2>

      <div class="author-info">
        <img src="/authors/sarah-chen.jpg" alt="Dr. Sarah Chen">
        <div>
          <strong>Dr. Sarah Chen</strong>
          <span>April 15, 2026 · 13 min read</span>
        </div>
      </div>

      <div class="article-body">
        <!-- Clean HTML from Word doc -->
        <p>...</p>
        <h3>...</h3>
        <p>...</p>
      </div>

      <div class="article-tags">
        <strong>PMH Zones:</strong> Earth, The Moon, Mearth Line<br>
        <strong>MegaChallenges:</strong> Challenge 3, Challenge 5<br>
        <strong>Topics:</strong> #Supply Chain #Resilience #Logistics<br>
        <strong>Entities:</strong> MearthLink, Mearth Space Industries
      </div>

      <a href="redesigning-supply-chains.pdf" class="btn-download">
        Download PDF
      </a>

      <div class="author-bio">
        <img src="/authors/sarah-chen.jpg" alt="Dr. Sarah Chen">
        <div>
          <h3>About Dr. Sarah Chen</h3>
          <p>Expert in supply chain resilience...</p>
          <div class="social-links">
            <a href="https://linkedin.com/in/sarahchen">LinkedIn</a>
          </div>
        </div>
      </div>
    </article>
  </main>

  <footer>
    <!-- Site footer -->
  </footer>
</body>
</html>
```

### Appendix D: Folder Structure (Detailed)

```
pmh-article-publisher/
│
├── server.js                          # Express server (main application)
├── package.json                       # Dependencies
├── package-lock.json
├── README.md                          # Setup & usage instructions
│
├── data/                              # JSON "database" files
│   ├── authors.json                   # All authors
│   ├── categories.json                # 14 primary categories
│   ├── pmh-zones.json                 # 15 PMH zones
│   ├── mega-challenges.json           # 6 MegaChallenges
│   ├── topics.json                    # Controlled topics list
│   └── entities.json                  # Entity associations
│
├── templates/                         # EJS templates
│   ├── admin.ejs                      # Upload & edit form
│   ├── article.ejs                    # Article page template
│   ├── index.ejs                      # Directory page template
│   ├── partials/
│   │   ├── header.ejs                 # Site header
│   │   └── footer.ejs                 # Site footer
│
├── uploads/                           # Temporary file storage (gitignored)
│   └── (temp files during processing)
│
├── output/                            # Generated static site (gitignored)
│   ├── articles/
│   │   ├── redesigning-supply-chains/
│   │   │   ├── index.html
│   │   │   ├── redesigning-supply-chains.pdf
│   │   │   └── featured.jpg
│   │   └── .../ (200 article folders)
│   │
│   ├── articles-index/
│   │   └── index.html                 # Main directory page
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css             # Site stylesheet
│   │   ├── js/
│   │   │   └── filter.js              # Client-side filtering
│   │   └── data/
│   │       └── articles.json          # Index data for JS
│   │
│   ├── authors/
│   │   ├── david-goldsmith.jpg
│   │   └── .../ (author photos)
│   │
│   └── sitemap.xml                    # Auto-generated sitemap
│
└── exports/                           # ZIP files for download (gitignored)
    └── pmh-articles-2026-05-19.zip
```

---

## CONCLUSION

This Phase 1 MVP specification provides a **practical, achievable path** to publishing your 200 articles within 4 weeks at a fraction of the cost of a full CMS system.

**Key Benefits**:
-  **Simple**: No complex infrastructure, runs locally
-  **Fast**: 4 weeks to 200 articles published
-  **Proven**: Static HTML = guaranteed Google indexing
-  **Flexible**: Easy to add features later (AI, analytics, etc.)
-  **Maintainable**: Simple codebase PMH team can manage

**What You Get**:
- 200 articles as static HTML pages
- Searchable, filterable directory
- SEO-optimized with Schema.org markup
- PDF downloads
- Author profiles with social links
- Export package ready for immediate upload

**Next Phase**: Once articles are live and driving traffic, we can add podcasts, videos, and eventually migrate to the full CMS system outlined in the comprehensive document.

---



