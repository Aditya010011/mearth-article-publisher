# MEARTH ARTICLE PUBLISHER - QUICK REFERENCE

**Phase 1 MVP** - Everything you need to know on one page

---

## 📚 DOCUMENT INDEX

1. **`Phase1_MVP_Specification.md`** (34 pages)
   - Complete technical specification
   - All features, workflows, and implementation details
   - **Read this for**: Full understanding of the system

2. **`Phase1_Updates_Summary.md`** (8 pages)
   - Changes based on David's feedback (v1.1)
   - Key decisions and rationale
   - **Read this for**: What changed from V02

3. **`PMH_Content_Engine_Document_Plan.md`** (80+ pages)
   - Long-term vision (full CMS with AI, analytics, etc.)
   - **Read this for**: Future phases (Phase 2, 3, 4+)

4. **`data-files/`** folder
   - Ready-to-use JSON configuration files
   - **Use these**: When building the system

---

## 🎯 PHASE 1 AT A GLANCE

**Goal**: Publish 200 articles as static HTML pages with search/filter

**Timeline**: 4 weeks
- Week 1: Build core system + test 1 article
- Week 2: Add features + test 10 articles
- Week 3: Process all 200 articles
- Week 4: Deploy & monitor

**Cost**: ~$4,000 (one-time)

**Team**: 1 developer

**Tech**: Node.js + Express + EJS templates (500 lines of code)

---

## 📥 INPUTS (What You Provide)

For each article:
- ✅ Word document (`.docx`) - article text
- ✅ PDF file (`.pdf`) - main PDF for download
- ✅ Featured image (`.jpg` or `.png`) - header image
- ✅ **Additional resources** (optional) - extra PDFs, graphics, video links, external links

---

## 📤 OUTPUTS (What System Generates)

For each article:
- ✅ Static HTML page (`/discover/articles/{slug}/index.html`)
- ✅ Searchable directory entry
- ✅ SEO-optimized with Schema.org markup
- ✅ Main PDF download link
- ✅ **Additional resources section** (if any added) - extra docs, videos, links
- ✅ Author bio with social links
- ✅ Tag cloud (categories, zones, challenges, topics)

**Export package**: ZIP file ready for Markus to upload

---

## 🏷️ TAGGING TAXONOMY

### Primary Category (select 1 of 14):
1. Leadership & Decision-Making
2. Innovation & Systems Thinking
3. Mearth Framework
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

### PMH Classification Zones (select any of 15):
1. Earth
2. Atmosphere
3. Low Earth Orbit (LEO)
4. Medium Earth Orbit (MEO)
5. High Earth Orbit (HEO)
6. Space Between HEO and Moon Orbit
7. Moon Orbit
8. The Moon
9. The Mearth Line
10. Space Between Moon and Mars
11. Mars Atmosphere/Orbit
12. Mars
13. Phobos
14. Deimos
15. Beyond

### MegaChallenges (select any of 6, no ranking):
- Climate Change
- Mass Extinction
- Ecosystems Collapses
- Displacement
- Unrest
- Explosive Impact

### Entities (select any):
- MearthLink
- Mearth Space Industries
- Mearth Cultiva
- Mearth Habitus
- Mearth Energy
- Mearth Eterna
- Project Moon Hut Foundation

### Topics (select 2-5):
- (Will be defined from existing articles or provided by David)

---

## ⚙️ WORKFLOW (5 Steps)

### 1. UPLOAD
- Drag Word doc, PDF, and image into web interface
- Click "Parse Document"
- Wait ~5 seconds

### 2. REVIEW
- Check extracted title, subtitle, body (in plain textarea)
- Make any edits if needed

### 3. TAG
- Select author (defaults to David Goldsmith)
- Choose primary category (required)
- Check relevant PMH zones
- Check relevant MegaChallenges
- Add topics
- Select entity associations

### 4. GENERATE
- Click "Preview" to see rendered page (optional)
- Click "Generate & Export"
- Article added to output folder + index updated

### 5. REPEAT
- Process next article, or
- Use batch mode for multiple articles at once

---

## 📊 BATCH PROCESSING (For 200 Articles)

### Step 1: Organize Files
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

### Step 2: Create Metadata CSV
Open `data-files/batch-upload-template.csv` and fill in:
- folder name
- title, subtitle
- author_id (usually "david-goldsmith")
- publish_date
- primary_category
- pmh_zones (comma-separated)
- mega_challenges (comma-separated)
- topics (comma-separated)
- entities (comma-separated)

### Step 3: Run Batch Processor
- Click "Batch Process" in web UI
- Select folder + CSV file
- System processes all articles automatically
- **Time**: ~2 hours for 200 articles

### Step 4: Review Errors (if any)
- Fix ~10-20 articles that had parse issues
- Re-run for fixed articles

### Step 5: Export
- Click "Export All for Upload"
- Download ZIP file
- Send to Markus

---

## 🔧 CONFIGURATION

All settings in `data-files/config.json`:

**Site branding**:
- Name: "Mearth"
- URL: "https://mearth.com"
- Tagline, logo, colors

**Paths** (for Markus):
- Base: `/discover`
- Articles: `/discover/articles`
- Assets: `/assets`

**Defaults**:
- Author: "david-goldsmith"
- Articles per page: 20
- Read speed: 200 words/min

**Features**:
- PDF downloads: ✅ enabled
- Author bios: ✅ enabled
- Comments: ❌ disabled (Phase 2)
- Analytics: ❌ disabled (Phase 2)

---

## ✅ SUCCESS METRICS

After 4 weeks, you should have:
- ✅ 200 articles published
- ✅ Searchable directory (by category, zone, challenge, topic)
- ✅ Google indexing articles within 2 weeks
- ✅ Professional presentation matching Mearth branding
- ✅ Shareable URLs for LinkedIn, X, etc.
- ✅ Time-on-site metrics measurable

---

## 🚀 NEXT PHASES

### Phase 2: Podcasts (4 weeks, +$3K)
- Similar workflow for audio + transcripts
- Guest database
- Podcast directory

### Phase 3: Videos + AI Tagging (8 weeks, +$8K)
- YouTube integration
- AI-suggested tags (human approval)
- Video directory

### Phase 4: Full CMS Migration (Future)
- Hosted infrastructure
- Analytics dashboards
- Advanced automation
- (See `PMH_Content_Engine_Document_Plan.md`)

---

## 📞 OPEN QUESTIONS (Need Answers)

Before starting development:

1. **Topics list**: Do you have a controlled list? Or extract from articles?
2. **File naming**: Are files consistently named? Need naming guide?
3. **Featured images**: All 200 articles have images? Or need placeholder?
4. **PDF availability**: All articles have PDFs? Or optional?
5. **David's photo**: Do you have a headshot for author bio?
6. **Site design**: Should match current Mearth.com design? (Need screenshot or CSS)
7. **Sample articles**: Can you provide 3 articles for testing?

---

## 📁 FILES TO USE

When developer starts:

1. Copy `data-files/config.json` → `/config.json`
2. Copy `data-files/authors.json` → `/data/authors.json`
3. Copy `data-files/mega-challenges.json` → `/data/mega-challenges.json`
4. Copy `data-files/batch-upload-template.csv` → Use as template

---

## 💻 FOR DEVELOPERS

**Setup** (5 minutes):
```bash
git clone [repo-url]
cd mearth-article-publisher
npm install
npm start
# Open http://localhost:3000
```

**Key files**:
- `server.js` - Express app (~500 lines)
- `templates/` - EJS templates for HTML generation
- `data/` - JSON "database" files
- `config.json` - All configurable settings

**Dependencies** (6 packages):
- express, mammoth, pdf-parse, ejs, multer, csv-parser

---

**Questions? Contact [to be filled in]**
