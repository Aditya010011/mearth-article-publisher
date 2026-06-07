# PROJECT MOON HUT CONTENT ENGINE
## Comprehensive Document Plan v1.0
 
**Purpose**: AI-assisted content management platform that converts 200+ articles, 100+ podcasts, 200+ videos, and 1000+ images into a static, SEO-optimized knowledge base.

---

## EXECUTIVE SUMMARY

The Project Moon Hut Content Engine addresses a critical business need: publishing 200+ finished articles and hundreds of multimedia assets currently locked due to manual overhead. The system will:

- Generate **static HTML pages** (not dynamic) for Google indexability
- Achieve **90% automation** through AI-assisted classification and metadata extraction
- Support **5 content types**: Articles, Videos, Podcasts, Wallpapers, Infographics
- Maintain a **unified Author/Guest database** for contributor profiles
- Implement **human-in-the-loop approval** for quality assurance
- Enable **multi-dimensional discovery** through structured tagging and filtering

**Business Impact**: Increase site engagement time, improve SEO visibility, support fundraising efforts, and establish PMH as a credible thought leader in Earth-Moon economic systems.

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 Dual-Engine Approach

The platform separates content into two distinct rendering strategies based on SEO requirements:

#### **Engine A: Metadata-Heavy Static SEO Engine**
- **Purpose**: Create indexable, searchable pages with rich metadata
- **Content Types**: Articles, Podcasts, Videos with transcripts
- **Output**: Static HTML pages with Schema.org markup
- **SEO Priority**: High (primary driver of organic traffic)

#### **Engine B: Media Gallery Engine**
- **Purpose**: Visual browsing and download experience
- **Content Types**: Wallpapers, Infographics
- **Output**: Gallery views with modal interactions
- **SEO Priority**: Low (supports existing traffic, not discoverable via search)

### 1.2 Static Site Generation Framework

**Recommended Approach**: Hybrid Static Site Generation (SSG) with Incremental Static Regeneration (ISR)

**Why Static?**
- Google cannot index JavaScript-rendered dynamic pages effectively
- Faster page loads (pre-rendered HTML)
- Lower hosting costs (CDN-friendly)
- Better accessibility and reliability

**Framework Selection Criteria**:
- Must support 500+ pages without slow build times
- Must integrate with headless CMS
- Must support incremental builds (add one article without rebuilding all 200)
- Must support rich metadata and Schema.org injection
- Must have mature ecosystem for content transformation

### 1.3 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT INTAKE LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ File Upload  │  │ API Ingestion│  │ Manual Entry │         │
│  │ (Word/PDF)   │  │ (YouTube/Pod)│  │ (Forms)      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI PROCESSING PIPELINE                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Document Parser → Metadata Extractor → AI Classifier  │    │
│  │  (Word/PDF→HTML)   (Title/Author/Images) (Tags+Conf%)  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HEADLESS CMS (Content Store)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Articles   │  │   Authors    │  │  Media Files │         │
│  │   Podcasts   │  │   Guests     │  │  (S3/CDN)    │         │
│  │   Videos     │  │   Tags       │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REVIEW & APPROVAL UI                         │
│  - Flag low-confidence AI suggestions (<70%)                    │
│  - Manual override interface for tags/categories                │
│  - Preview static page before publish                           │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              STATIC SITE GENERATOR (Build Layer)                │
│  Triggers: Manual publish OR scheduled rebuild                  │
│  Output: Static HTML + JSON for client-side filtering           │
└─────────────────────────────┬───────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PUBLIC WEBSITE (CDN)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Articles   │  │   Podcasts   │  │   Videos     │         │
│  │   Directory  │  │   Directory  │  │   Directory  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │  Wallpapers  │  │ Infographics │                           │
│  │   Gallery    │  │   Gallery    │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Core Architectural Principles

1. **Separation of Concerns**: Content management (CMS) is decoupled from presentation (SSG)
2. **Progressive Enhancement**: Static HTML works without JavaScript; filtering enhances with JS
3. **Scalability by Design**: System handles 200 articles now, 2,000 in the future
4. **Human-in-the-Loop**: AI suggests, humans approve (especially for <70% confidence)
5. **Incremental Publishing**: Add one article without rebuilding entire site

---

## 2. UNIFIED DATA SCHEMA

### 2.1 Database Architecture

**Storage Strategy**: Headless CMS with PostgreSQL backend + S3 for media files

**Schema Philosophy**:
- **Normalized structure** for authors, tags, categories (avoid duplication)
- **Relational links** between content types (Article → Infographic → Video)
- **Versioning support** for content updates
- **Audit trail** for AI suggestions vs. human overrides

### 2.2 Core Entities

#### **2.2.1 Authors/Guests Table**

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  organization VARCHAR(255),
  email VARCHAR(255),
  bio TEXT,
  headshot_url VARCHAR(500),

  -- Social Links
  linkedin_url VARCHAR(500),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  x_url VARCHAR(500),
  tiktok_url VARCHAR(500),
  youtube_url VARCHAR(500),
  amazon_book_url VARCHAR(500),
  website_urls TEXT[], -- Array for multiple websites

  -- Affiliation
  affiliation ENUM('PMH_FOUNDATION', 'MEARTH_ENTITY', 'PARTNER_ORG',
                   'GUEST_EXTERNAL', 'INTERNAL_CONTRIBUTOR'),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_authors_slug ON authors(slug);
CREATE INDEX idx_authors_affiliation ON authors(affiliation);
```

#### **2.2.2 Articles Table**

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Core Content
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  body_html TEXT NOT NULL, -- Parsed from Word/PDF
  body_plain_text TEXT, -- For search indexing
  excerpt TEXT, -- First 300 chars or custom

  -- Featured Media
  featured_image_url VARCHAR(500) NOT NULL,
  featured_image_alt TEXT,
  pdf_url VARCHAR(500), -- Optional downloadable PDF

  -- Publishing
  publish_date TIMESTAMP NOT NULL,
  status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',

  -- Primary Navigation (Single-Select)
  primary_category_id UUID REFERENCES categories(id) NOT NULL,

  -- AI Classification Metadata
  ai_suggested_category_id UUID REFERENCES categories(id),
  ai_category_confidence DECIMAL(5,2), -- 0.00 to 100.00
  ai_processed_at TIMESTAMP,
  human_override BOOLEAN DEFAULT FALSE,

  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Metadata
  word_count INTEGER,
  read_time_minutes INTEGER,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX idx_articles_primary_category ON articles(primary_category_id);
```

#### **2.2.3 Article Authors (Many-to-Many Join Table)**

```sql
CREATE TABLE article_authors (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  author_order INTEGER DEFAULT 1, -- For multiple authors
  PRIMARY KEY (article_id, author_id)
);

CREATE INDEX idx_article_authors_article ON article_authors(article_id);
CREATE INDEX idx_article_authors_author ON article_authors(author_id);
```

#### **2.2.4 Videos Table**

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Core Content
  title VARCHAR(500) NOT NULL,
  description TEXT,

  -- Video Source
  video_source ENUM('YOUTUBE', 'VIMEO', 'INTERNAL') NOT NULL,
  video_url VARCHAR(500) NOT NULL, -- Embed URL
  video_id VARCHAR(255), -- YouTube/Vimeo ID
  thumbnail_url VARCHAR(500),
  duration_seconds INTEGER,

  -- Transcript (determines if static page is created)
  transcript_html TEXT, -- If exists → static page
  transcript_plain_text TEXT,
  has_transcript BOOLEAN DEFAULT FALSE,

  -- Creator
  creator_id UUID REFERENCES authors(id),

  -- Publishing
  publish_date TIMESTAMP NOT NULL,
  status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',

  -- Metadata
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_videos_slug ON videos(slug);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_has_transcript ON videos(has_transcript);
```

#### **2.2.5 Podcasts Table**

```sql
CREATE TABLE podcasts (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,

  -- Core Content
  episode_title VARCHAR(500) NOT NULL,
  episode_number INTEGER NOT NULL,
  series ENUM('AGE_OF_INFINITE', 'REDEFINING_TOMORROW') NOT NULL,

  -- Audio Source
  podbean_embed_code TEXT NOT NULL,
  audio_url VARCHAR(500), -- Direct file URL if available
  duration_seconds INTEGER,

  -- Guest Information
  guest_id UUID REFERENCES authors(id) NOT NULL,
  episode_description TEXT,

  -- Transcript (Mandatory for podcasts)
  transcript_html TEXT NOT NULL,
  transcript_plain_text TEXT NOT NULL,

  -- Publishing
  publish_date TIMESTAMP NOT NULL,
  status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',

  -- Metadata
  listens_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_podcasts_slug ON podcasts(slug);
CREATE INDEX idx_podcasts_series ON podcasts(series);
CREATE INDEX idx_podcasts_episode_number ON podcasts(series, episode_number);
```

#### **2.2.6 Wallpapers Table**

```sql
CREATE TABLE wallpapers (
  id UUID PRIMARY KEY,

  -- Core Content
  title VARCHAR(255), -- Internal only, optional
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,

  -- Auto-Detected Properties
  file_type VARCHAR(10), -- 'jpg', 'png', etc.
  width_px INTEGER,
  height_px INTEGER,
  file_size_kb INTEGER,
  orientation ENUM('DESKTOP', 'MOBILE', 'SQUARE') NOT NULL,

  -- AI-Suggested Tagging
  ai_primary_style VARCHAR(100), -- Layer A (single-select)
  ai_visual_character TEXT[], -- Layer B (multi-select)
  ai_mood_energy TEXT[], -- Layer C (multi-select)
  ai_confidence DECIMAL(5,2),
  human_override BOOLEAN DEFAULT FALSE,

  -- Publishing
  status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallpapers_orientation ON wallpapers(orientation);
CREATE INDEX idx_wallpapers_status ON wallpapers(status);
```

#### **2.2.7 Infographics Table**

```sql
CREATE TABLE infographics (
  id UUID PRIMARY KEY,

  -- Core Content
  title VARCHAR(255) NOT NULL,
  one_line_description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  file_type ENUM('IMAGE', 'PDF') NOT NULL,

  -- Publishing
  status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_infographics_status ON infographics(status);
```

### 2.3 Taxonomy Tables (Admin-Locked)

**Design Principle**: All taxonomy values are predefined and admin-controlled to prevent tag sprawl.

#### **2.3.1 Categories Table (14 Primary Categories)**

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  definition TEXT NOT NULL, -- Used by AI classification engine
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data with 14 categories from PMH.md
INSERT INTO categories (id, name, slug, definition, sort_order) VALUES
  (uuid_generate_v4(), 'Leadership & Decision-Making', 'leadership-decision-making',
   'Focuses on leadership thinking, strategic direction, decision frameworks...', 1),
  -- ... (remaining 13 categories)
```

#### **2.3.2 PMH Classification System (1-15)**

```sql
CREATE TABLE pmh_classifications (
  id UUID PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL CHECK (number BETWEEN 1 AND 15),
  name VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Note: Actual values need to be provided by PMH team
```

#### **2.3.3 MegaChallenges (6 Total)**

```sql
CREATE TABLE mega_challenges (
  id UUID PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL CHECK (number BETWEEN 1 AND 6),
  name VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Note: Actual values need to be provided by PMH team
```

#### **2.3.4 Topics (Multi-Select Tags)**

```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin-managed, expandable over time
```

#### **2.3.5 Entity Associations**

```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed data
INSERT INTO entities (name, slug) VALUES
  ('MearthLink', 'mearthlink'),
  ('Mearth Space Industries', 'mearth-space-industries'),
  ('Mearth Cultiva', 'mearth-cultiva'),
  ('Mearth Habitus', 'mearth-habitus'),
  ('Mearth Energy', 'mearth-energy'),
  ('Mearth Eterna', 'mearth-eterna');
```

#### **2.3.6 Wallpaper Style Taxonomy**

```sql
CREATE TABLE wallpaper_styles (
  id UUID PRIMARY KEY,
  layer ENUM('PRIMARY_STYLE', 'VISUAL_CHARACTER', 'MOOD_ENERGY') NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(layer, name)
);

-- Seed with Layer A (20 styles), Layer B (16 characters), Layer C (10 moods)
```

### 2.4 Relational Tagging (Many-to-Many Join Tables)

#### **Article Tagging**

```sql
-- Articles ↔ PMH Classifications
CREATE TABLE article_pmh_classifications (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  classification_id UUID REFERENCES pmh_classifications(id) ON DELETE CASCADE,
  ai_suggested BOOLEAN DEFAULT FALSE,
  confidence DECIMAL(5,2),
  PRIMARY KEY (article_id, classification_id)
);

-- Articles ↔ MegaChallenges
CREATE TABLE article_mega_challenges (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES mega_challenges(id) ON DELETE CASCADE,
  ai_suggested BOOLEAN DEFAULT FALSE,
  confidence DECIMAL(5,2),
  PRIMARY KEY (article_id, challenge_id)
);

-- Articles ↔ Topics
CREATE TABLE article_topics (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  ai_suggested BOOLEAN DEFAULT FALSE,
  confidence DECIMAL(5,2),
  PRIMARY KEY (article_id, topic_id)
);

-- Articles ↔ Entities
CREATE TABLE article_entities (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, entity_id)
);
```

**Similar tables for Videos, Podcasts, Infographics** (omitted for brevity)

### 2.5 Content Relationships (Cross-References)

```sql
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY,
  source_type ENUM('ARTICLE', 'VIDEO', 'PODCAST', 'INFOGRAPHIC') NOT NULL,
  source_id UUID NOT NULL,
  related_type ENUM('ARTICLE', 'VIDEO', 'PODCAST', 'INFOGRAPHIC', 'WALLPAPER') NOT NULL,
  related_id UUID NOT NULL,
  relationship_type ENUM('RELATED_PAPER', 'RELATED_VIDEO', 'RELATED_DECK',
                         'EXPLAINER_VIDEO', 'INFOGRAPHIC', 'GENERIC_RELATED') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_type, source_id, related_type, related_id)
);

CREATE INDEX idx_content_rel_source ON content_relationships(source_type, source_id);
CREATE INDEX idx_content_rel_related ON content_relationships(related_type, related_id);
```

**Use Case Example**:
- Infographic "Mearth Economic Framework" links to:
  - `related_paper`: Article "Economic Model Whitepaper"
  - `explainer_video`: Video "5-Min Framework Overview"
  - `related_deck`: Presentation slides (stored as another file type)

---

## 3. AUTOMATION & AI PIPELINE

### 3.1 Pipeline Architecture

The automation pipeline consists of 4 sequential stages:

```
┌───────────────┐     ┌────────────────┐     ┌──────────────┐     ┌──────────────┐
│  STAGE 1:     │────▶│  STAGE 2:      │────▶│  STAGE 3:    │────▶│  STAGE 4:    │
│  File Intake  │     │  Parsing &     │     │  AI          │     │  Human       │
│  & Validation │     │  Extraction    │     │  Classification│   │  Review      │
└───────────────┘     └────────────────┘     └──────────────┘     └──────────────┘
```

### 3.2 Stage 1: File Intake & Validation

#### **Supported Input Formats**

| Content Type | Accepted Formats | Validation Checks |
|-------------|-----------------|-------------------|
| Articles | `.docx`, `.pdf` | Min 500 words, has title, has image |
| Videos | YouTube URL, embed code | Valid URL, extractable metadata |
| Podcasts | Podbean embed, MP3 | Has transcript, has guest info |
| Wallpapers | `.jpg`, `.png` | Min 1920x1080, max 10MB |
| Infographics | `.jpg`, `.png`, `.pdf` | Min 800px width, has title |

#### **Upload Interface Requirements**

**Admin UI Form Fields**:
- Drag-and-drop file upload
- Paste URL (for videos/podcasts)
- Auto-detect file type
- Show file preview immediately
- Display validation errors inline

**Bulk Upload Support**:
- CSV manifest with metadata + file paths
- Process up to 50 articles in one batch
- Queue system for long-running jobs
- Progress indicator with ETA

### 3.3 Stage 2: Parsing & Extraction

#### **3.3.1 Article Parsing (Word/PDF → HTML)**

**Libraries/Tools**:
- **Word (.docx)**: `mammoth.js` (Node) or `python-docx` (Python) for clean HTML conversion
- **PDF**: `pdfplumber` (Python) or `pdf.js` (JavaScript) for text extraction
- **Image Extraction**: `pdf-lib` for PDFs, extract embedded images from Word XML

**Extraction Logic**:

```python
def parse_article_document(file_path, file_type):
    """
    Extract structured content from Word or PDF document.
    Returns dict with title, subtitle, body_html, images, metadata.
    """
    result = {
        'title': None,
        'subtitle': None,
        'body_html': '',
        'featured_image': None,
        'inline_images': [],
        'author': None,
        'copyright': None,
        'word_count': 0
    }

    if file_type == 'docx':
        # Strategy: Use document structure to identify components
        doc = Document(file_path)

        # Heuristic: First Heading 1 or bold text = title
        result['title'] = extract_title_from_word(doc)

        # Heuristic: First image = featured image
        result['featured_image'] = extract_first_image(doc)

        # Convert body paragraphs to clean HTML
        result['body_html'] = convert_paragraphs_to_html(doc.paragraphs)

        # Extract inline images (charts, diagrams)
        result['inline_images'] = extract_all_images_except_first(doc)

        # Search for author in last paragraph or document properties
        result['author'] = extract_author_metadata(doc)

        # Calculate word count
        result['word_count'] = count_words(doc)

    elif file_type == 'pdf':
        # Strategy: Parse text blocks and identify structure
        pdf = pdfplumber.open(file_path)

        # Extract text from all pages
        full_text = '\n\n'.join([page.extract_text() for page in pdf.pages])

        # Heuristic: Largest font on first page = title
        result['title'] = extract_title_from_pdf_fonts(pdf.pages[0])

        # Extract images from PDF
        images = extract_images_from_pdf(pdf)
        result['featured_image'] = images[0] if images else None
        result['inline_images'] = images[1:] if len(images) > 1 else []

        # Convert plain text to semantic HTML (paragraph detection)
        result['body_html'] = convert_text_to_html_with_paragraphs(full_text)

        # Search for author/copyright in first or last page
        result['author'] = search_for_author_pattern(full_text)
        result['copyright'] = search_for_copyright_pattern(full_text)

        result['word_count'] = len(full_text.split())

    return result
```

**Output**: Structured JSON object ready for AI classification

#### **3.3.2 Video Metadata Extraction (YouTube API)**

```javascript
async function extractYouTubeMetadata(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  const apiKey = process.env.YOUTUBE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
  );

  const data = await response.json();
  const video = data.items[0];

  return {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail_url: video.snippet.thumbnails.maxres.url,
    duration_seconds: parseDuration(video.contentDetails.duration),
    publish_date: video.snippet.publishedAt,
    channel_name: video.snippet.channelTitle,
    // Attempt to extract transcript (if available via captions API)
    transcript: await fetchYouTubeTranscript(videoId)
  };
}
```

#### **3.3.3 Image Property Detection**

```python
from PIL import Image

def analyze_image_file(file_path):
    """
    Auto-detect image properties for wallpapers.
    """
    img = Image.open(file_path)
    width, height = img.size

    # Determine orientation
    aspect_ratio = width / height
    if aspect_ratio > 1.5:
        orientation = 'DESKTOP'
    elif aspect_ratio < 0.75:
        orientation = 'MOBILE'
    else:
        orientation = 'SQUARE'

    return {
        'width_px': width,
        'height_px': height,
        'file_type': img.format.lower(),
        'file_size_kb': os.path.getsize(file_path) // 1024,
        'orientation': orientation,
        'thumbnail_url': generate_thumbnail(file_path, max_width=400)
    }
```

### 3.4 Stage 3: AI Classification

#### **3.4.1 Classification Goals**

For **Articles**:
- Suggest **Primary Category** (single-select, 14 options)
- Suggest **Topics** (multi-select from controlled list)
- Suggest **PMH Classifications** (1-15, multi-select)
- Suggest **MegaChallenges** (1-6, multi-select)
- Return **confidence score** (0-100%) for each suggestion

For **Wallpapers**:
- Suggest **Primary Style** (Layer A, single-select)
- Suggest **Visual Character** (Layer B, multi-select)
- Suggest **Mood/Energy** (Layer C, multi-select)

#### **3.4.2 AI Model Selection**

**Recommended Approach**: Large Language Model (LLM) with structured output

**Options**:
1. **OpenAI GPT-4** (or GPT-4 Turbo) with function calling for structured JSON output
2. **Anthropic Claude 3.5 Sonnet** with XML/JSON structured prompts
3. **Open-source alternative**: Llama 3 70B (self-hosted for cost optimization)

**Rationale**:
- LLMs can understand nuanced category definitions (e.g., "Leadership & Decision-Making" vs. "Innovation & Systems Thinking")
- Function calling ensures structured output (no parsing errors)
- Few-shot examples improve accuracy
- Cost: ~$0.01-0.05 per article classification

#### **3.4.3 Classification Prompt Structure**

**System Prompt Template**:

```
You are an expert content classifier for Project Moon Hut, a thought leadership platform focused on Earth-Moon economic systems, innovation, and large-scale systems thinking.

Your task is to analyze article content and suggest appropriate categorization.

## PRIMARY CATEGORY DEFINITIONS (single-select required)

1. Leadership & Decision-Making
   Definition: Focuses on leadership thinking, strategic direction, decision frameworks, and how individuals or organizations choose paths forward under uncertainty...

2. Innovation & Systems Thinking
   Definition: Explores new ways of thinking, reframing challenges, systems design, and paradigm-shifting approaches...

[... all 14 category definitions ...]

## CLASSIFICATION RULES

- Choose the PRIMARY category that best represents the article's core focus
- An article about "decision-making in energy systems" → Energy & Power Systems (not Leadership)
- An article about "leading energy transitions" → Leadership & Decision-Making (not Energy)
- When uncertain between two categories, choose the one that represents the article's PRIMARY contribution
- Provide a confidence score (0-100) based on clarity of fit

## TOPICS (multi-select)

Suggest 2-5 relevant topics from this list: [list of topics]

## OUTPUT FORMAT

Return JSON:
{
  "primary_category": {
    "slug": "leadership-decision-making",
    "confidence": 87
  },
  "topics": [
    {"slug": "strategic-planning", "confidence": 92},
    {"slug": "risk-management", "confidence": 78}
  ],
  "pmh_classifications": [3, 7, 11],
  "mega_challenges": [2, 4],
  "reasoning": "This article focuses on executive decision-making frameworks for long-term infrastructure projects, which aligns with Leadership & Decision-Making rather than Infrastructure because..."
}
```

**User Prompt Template**:

```
Classify the following article:

TITLE: {{article.title}}
SUBTITLE: {{article.subtitle}}

BODY (first 3000 words):
{{article.body_plain_text[:3000]}}

Return classification as JSON.
```

#### **3.4.4 Implementation Example (Python)**

```python
import openai
import json

def classify_article_with_ai(article_data, category_definitions, topics_list):
    """
    Classify article using GPT-4 with function calling.
    Returns structured classification with confidence scores.
    """

    # Build system prompt with all category definitions
    system_prompt = build_classification_system_prompt(
        category_definitions,
        topics_list
    )

    # Define expected output structure
    classification_schema = {
        "name": "classify_article",
        "description": "Classify an article into categories with confidence scores",
        "parameters": {
            "type": "object",
            "properties": {
                "primary_category": {
                    "type": "object",
                    "properties": {
                        "slug": {"type": "string"},
                        "confidence": {"type": "number", "minimum": 0, "maximum": 100}
                    },
                    "required": ["slug", "confidence"]
                },
                "topics": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "slug": {"type": "string"},
                            "confidence": {"type": "number"}
                        }
                    }
                },
                "pmh_classifications": {"type": "array", "items": {"type": "integer"}},
                "mega_challenges": {"type": "array", "items": {"type": "integer"}},
                "reasoning": {"type": "string"}
            },
            "required": ["primary_category", "topics"]
        }
    }

    # Call GPT-4 with function calling
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": format_article_for_classification(article_data)}
        ],
        functions=[classification_schema],
        function_call={"name": "classify_article"},
        temperature=0.3  # Lower temperature for consistent classifications
    )

    # Extract structured result
    function_call = response.choices[0].message.function_call
    classification = json.loads(function_call.arguments)

    # Add metadata
    classification['model_used'] = 'gpt-4-turbo'
    classification['timestamp'] = datetime.utcnow().isoformat()
    classification['tokens_used'] = response.usage.total_tokens

    return classification
```

#### **3.4.5 Confidence Score Interpretation**

| Confidence Range | Interpretation | Action |
|-----------------|----------------|--------|
| 90-100% | High confidence - clear fit | Auto-approve (optional) |
| 70-89% | Medium confidence - likely correct | Standard review queue |
| 50-69% | Low confidence - uncertain | **Flag for manual review** |
| 0-49% | Very low confidence - poor fit | **Require human classification** |

**Review Queue Logic**:
- Articles with **primary category confidence < 70%** → Flag for review
- Articles with **all topics confidence < 60%** → Flag for review
- Human override always takes precedence over AI suggestion

### 3.5 Stage 4: Human Review Interface

#### **3.5.1 Review Dashboard Requirements**

**Dashboard Views**:

1. **Pending Review Queue**
   - Show all articles in `PENDING_REVIEW` status
   - Sort by: Upload date, AI confidence (lowest first), word count
   - Filter by: Confidence range, missing metadata, content type

2. **Article Review Card**
   ```
   ┌─────────────────────────────────────────────────────────────┐
   │ Article: "Redesigning Global Supply Chains for Resilience" │
   │ Author: [Dropdown: Select/Add Author]                       │
   │ Word Count: 3,245 | Read Time: 13 min                      │
   ├─────────────────────────────────────────────────────────────┤
   │ AI SUGGESTIONS (click to override)                          │
   │                                                             │
   │ Primary Category: ⚠️ Materials, Mining & Supply Chains     │
   │   Confidence: 68% [FLAG: Below 70%]                        │
   │   Alternative: Infrastructure & Logistics (62%)             │
   │   [Override] [Accept]                                      │
   │                                                             │
   │ Topics: ✓ Supply Chain (95%), ✓ Resilience (88%),         │
   │         ✓ Logistics (82%)                                  │
   │   [Edit Topics]                                            │
   │                                                             │
   │ PMH Classifications: 7, 14 [Edit]                          │
   │ MegaChallenges: 3, 5 [Edit]                               │
   ├─────────────────────────────────────────────────────────────┤
   │ [Preview Static Page] [Reject & Return] [Approve & Publish]│
   └─────────────────────────────────────────────────────────────┘
   ```

3. **Bulk Actions**
   - Select multiple articles
   - Assign same author to multiple articles
   - Apply same topic tag to batch
   - Approve all high-confidence (>85%) items at once

#### **3.5.2 Override Tracking**

```sql
CREATE TABLE human_overrides (
  id UUID PRIMARY KEY,
  content_type ENUM('ARTICLE', 'VIDEO', 'WALLPAPER', 'INFOGRAPHIC'),
  content_id UUID NOT NULL,
  field_name VARCHAR(100), -- 'primary_category', 'topics', etc.
  ai_suggested_value JSONB,
  human_selected_value JSONB,
  override_reason TEXT,
  reviewer_user_id UUID REFERENCES users(id),
  overridden_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose**:
- Track AI accuracy over time
- Identify patterns in AI misclassification
- Retrain models with human-corrected examples

### 3.6 Automation Metrics & Monitoring

**Key Performance Indicators (KPIs)**:

| Metric | Target | Purpose |
|--------|--------|---------|
| Auto-approval rate (>85% confidence) | 40-60% | Measure AI accuracy |
| Manual review time per article | <5 min | Efficiency tracking |
| AI classification accuracy (post-review) | >80% | Model performance |
| Articles processed per hour | 20+ | Pipeline throughput |
| Failed parsing rate | <5% | Quality assurance |

**Monitoring Dashboard**:
- Real-time queue depth (articles waiting for review)
- Average confidence scores by category
- Most frequently overridden AI suggestions
- Processing time per pipeline stage

---

## 4. SEO & DISCOVERY STRATEGY

### 4.1 Schema.org Structured Data Implementation

#### **4.1.1 Article Schema**

Every article page includes `<script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Redesigning Global Supply Chains for Resilience",
  "alternativeHeadline": "A systems approach to supply chain architecture",
  "image": {
    "@type": "ImageObject",
    "url": "https://pmh.org/images/article-featured-123.jpg",
    "width": 1200,
    "height": 630
  },
  "author": [
    {
      "@type": "Person",
      "name": "Dr. Sarah Chen",
      "url": "https://pmh.org/authors/sarah-chen",
      "sameAs": [
        "https://linkedin.com/in/sarahchen",
        "https://twitter.com/drsarahchen"
      ]
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Project Moon Hut",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pmh.org/logo.png"
    }
  },
  "datePublished": "2026-04-15T09:00:00Z",
  "dateModified": "2026-04-15T09:00:00Z",
  "articleSection": "Materials, Mining & Supply Chains",
  "keywords": ["supply chain", "resilience", "logistics", "systems thinking"],
  "wordCount": 3245,
  "articleBody": "First 500 chars of article for indexing...",
  "about": [
    {
      "@type": "Thing",
      "name": "Supply Chain Management"
    },
    {
      "@type": "Thing",
      "name": "Economic Resilience"
    }
  ]
}
```

#### **4.1.2 VideoObject Schema (for videos with transcripts)**

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Understanding Mearth Economic Framework",
  "description": "5-minute explainer on the Earth-Moon economic model",
  "thumbnailUrl": "https://img.youtube.com/vi/ABC123/maxresdefault.jpg",
  "uploadDate": "2026-03-20T10:00:00Z",
  "duration": "PT5M32S",
  "contentUrl": "https://www.youtube.com/watch?v=ABC123",
  "embedUrl": "https://www.youtube.com/embed/ABC123",
  "transcript": "Full transcript text...",
  "author": {
    "@type": "Person",
    "name": "David Morrison"
  }
}
```

#### **4.1.3 Person Schema (Author Profile Pages)**

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dr. Sarah Chen",
  "jobTitle": "Chief Systems Architect",
  "affiliation": {
    "@type": "Organization",
    "name": "Mearth Space Industries"
  },
  "description": "Expert in supply chain resilience and complex systems design",
  "image": "https://pmh.org/authors/sarah-chen-headshot.jpg",
  "sameAs": [
    "https://linkedin.com/in/sarahchen",
    "https://twitter.com/drsarahchen",
    "https://amazon.com/author/sarahchen"
  ],
  "url": "https://pmh.org/authors/sarah-chen"
}
```

### 4.2 Meta Tags & Open Graph

**Standard Meta Tags** (in `<head>` of every page):

```html
<meta name="description" content="Exploring systems-level approaches to supply chain resilience in a globally interconnected economy.">
<meta name="keywords" content="supply chain, resilience, logistics, systems thinking">
<meta name="author" content="Dr. Sarah Chen">
<link rel="canonical" href="https://pmh.org/articles/redesigning-global-supply-chains">
```

**Open Graph Tags** (for social media sharing):

```html
<meta property="og:title" content="Redesigning Global Supply Chains for Resilience">
<meta property="og:description" content="A systems approach to supply chain architecture">
<meta property="og:image" content="https://pmh.org/images/article-featured-123.jpg">
<meta property="og:url" content="https://pmh.org/articles/redesigning-global-supply-chains">
<meta property="og:type" content="article">
<meta property="article:published_time" content="2026-04-15T09:00:00Z">
<meta property="article:author" content="Dr. Sarah Chen">
<meta property="article:section" content="Materials, Mining & Supply Chains">
<meta property="article:tag" content="supply chain">
```

**Twitter Card Tags**:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Redesigning Global Supply Chains for Resilience">
<meta name="twitter:description" content="A systems approach to supply chain architecture">
<meta name="twitter:image" content="https://pmh.org/images/article-featured-123.jpg">
```

### 4.3 Multi-Dimensional Filtering System

#### **4.3.1 Frontend Filter Architecture**

**Two-Stage Approach**:
1. **Static Generation**: Pre-generate JSON index of all articles with metadata
2. **Client-Side Filtering**: JavaScript filters the static index (no server calls)

**Benefits**:
- Instant filtering (no network latency)
- Works without JavaScript (progressive enhancement)
- Reduces server load
- Supports complex multi-filter combinations

#### **4.3.2 JSON Index Structure**

At build time, generate `/api/articles-index.json`:

```json
{
  "generated_at": "2026-05-13T10:00:00Z",
  "total_articles": 203,
  "articles": [
    {
      "id": "uuid-123",
      "slug": "redesigning-global-supply-chains",
      "title": "Redesigning Global Supply Chains for Resilience",
      "excerpt": "A systems approach to...",
      "publish_date": "2026-04-15",
      "read_time_minutes": 13,
      "featured_image_url": "/images/article-123-thumb.jpg",
      "authors": [
        {"name": "Dr. Sarah Chen", "slug": "sarah-chen"}
      ],
      "primary_category": {
        "slug": "materials-mining-supply-chains",
        "name": "Materials, Mining & Supply Chains"
      },
      "topics": [
        {"slug": "supply-chain", "name": "Supply Chain"},
        {"slug": "resilience", "name": "Resilience"}
      ],
      "pmh_classifications": [7, 14],
      "mega_challenges": [3, 5],
      "entities": ["mearthlink", "mearth-space-industries"]
    }
    // ... 202 more articles
  ],
  "facets": {
    "categories": [
      {"slug": "leadership-decision-making", "name": "Leadership & Decision-Making", "count": 18},
      {"slug": "materials-mining-supply-chains", "name": "Materials, Mining & Supply Chains", "count": 15}
      // ... all 14 categories with counts
    ],
    "topics": [
      {"slug": "supply-chain", "name": "Supply Chain", "count": 42},
      {"slug": "innovation", "name": "Innovation", "count": 38}
      // ... all topics with counts
    ],
    "authors": [
      {"slug": "sarah-chen", "name": "Dr. Sarah Chen", "count": 12},
      // ... all authors with article counts
    ]
  }
}
```

#### **4.3.3 Filter UI Components**

**Articles Directory Page Layout**:

```
┌────────────────────────────────────────────────────────────────────┐
│  Articles Directory                    [Search: ____________] [🔍] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Filters                              Results (203 articles)      │
│  ┌──────────────────────┐             ┌──────────────────────┐   │
│  │ PRIMARY CATEGORY     │             │ [Article Card]       │   │
│  │ ☐ Leadership (18)    │             │ Title + Excerpt      │   │
│  │ ☑ Materials (15)     │             │ Author + Date        │   │
│  │ ☐ Innovation (24)    │             │ Tags                 │   │
│  │ [Show all 14...]     │             └──────────────────────┘   │
│  │                      │                                        │
│  │ TOPICS               │             ┌──────────────────────┐   │
│  │ ☑ Supply Chain (42)  │             │ [Article Card]       │   │
│  │ ☐ Resilience (38)    │             └──────────────────────┘   │
│  │ [Show all...]        │                                        │
│  │                      │             [Load More] or [Page 2]   │
│  │ MEGACHALLENGES       │                                        │
│  │ ☐ Challenge 1 (...)  │                                        │
│  │                      │                                        │
│  │ AUTHORS              │                                        │
│  │ ☐ Dr. Sarah Chen(12) │                                        │
│  │ [Search authors...]  │                                        │
│  │                      │                                        │
│  │ DATE RANGE           │                                        │
│  │ [2024] to [2026]     │                                        │
│  │                      │                                        │
│  │ ENTITY               │                                        │
│  │ ☐ MearthLink (52)    │                                        │
│  │ ☐ Mearth Energy (31) │                                        │
│  │                      │                                        │
│  │ [Clear All Filters]  │                                        │
│  └──────────────────────┘                                        │
└────────────────────────────────────────────────────────────────────┘
```

#### **4.3.4 Filtering Logic (JavaScript)**

```javascript
class ArticleFilterEngine {
  constructor(articlesData) {
    this.allArticles = articlesData.articles;
    this.filteredArticles = [...this.allArticles];
    this.activeFilters = {
      categories: [],
      topics: [],
      authors: [],
      pmh_classifications: [],
      mega_challenges: [],
      entities: [],
      date_range: { start: null, end: null },
      search_query: ''
    };
  }

  applyFilters() {
    let results = [...this.allArticles];

    // Category filter (OR logic within category)
    if (this.activeFilters.categories.length > 0) {
      results = results.filter(article =>
        this.activeFilters.categories.includes(article.primary_category.slug)
      );
    }

    // Topics filter (AND logic - article must have ALL selected topics)
    if (this.activeFilters.topics.length > 0) {
      results = results.filter(article => {
        const articleTopicSlugs = article.topics.map(t => t.slug);
        return this.activeFilters.topics.every(topic =>
          articleTopicSlugs.includes(topic)
        );
      });
    }

    // Author filter (OR logic)
    if (this.activeFilters.authors.length > 0) {
      results = results.filter(article => {
        const articleAuthorSlugs = article.authors.map(a => a.slug);
        return this.activeFilters.authors.some(author =>
          articleAuthorSlugs.includes(author)
        );
      });
    }

    // Date range filter
    if (this.activeFilters.date_range.start || this.activeFilters.date_range.end) {
      results = results.filter(article => {
        const publishDate = new Date(article.publish_date);
        const startOk = !this.activeFilters.date_range.start ||
                        publishDate >= new Date(this.activeFilters.date_range.start);
        const endOk = !this.activeFilters.date_range.end ||
                      publishDate <= new Date(this.activeFilters.date_range.end);
        return startOk && endOk;
      });
    }

    // Search query (full-text search on title + excerpt)
    if (this.activeFilters.search_query) {
      const query = this.activeFilters.search_query.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
      );
    }

    this.filteredArticles = results;
    return results;
  }

  // Update filter counts based on current results
  updateFacetCounts() {
    const counts = {
      categories: {},
      topics: {},
      authors: {}
    };

    this.filteredArticles.forEach(article => {
      counts.categories[article.primary_category.slug] =
        (counts.categories[article.primary_category.slug] || 0) + 1;

      article.topics.forEach(topic => {
        counts.topics[topic.slug] = (counts.topics[topic.slug] || 0) + 1;
      });

      article.authors.forEach(author => {
        counts.authors[author.slug] = (counts.authors[author.slug] || 0) + 1;
      });
    });

    return counts;
  }
}
```

#### **4.3.5 Sort Options**

Users can sort filtered results by:
- **Publish Date** (newest first, oldest first)
- **Title** (A-Z, Z-A)
- **Author** (A-Z)
- **Read Time** (shortest first, longest first)
- **Relevance** (if search query is active)

### 4.4 URL Structure & Routing

#### **4.4.1 Clean URL Patterns**

| Content Type | URL Pattern | Example |
|-------------|-------------|---------|
| Article | `/articles/{slug}` | `/articles/redesigning-global-supply-chains` |
| Article Directory | `/articles` | `/articles` |
| Video | `/videos/{slug}` | `/videos/mearth-framework-overview` |
| Video Directory | `/videos` | `/videos` |
| Podcast Episode | `/podcasts/{series}/{slug}` | `/podcasts/age-of-infinite/hans-kuhnesman` |
| Podcast Directory | `/podcasts` or `/podcasts/{series}` | `/podcasts/redefining-tomorrow` |
| Author Profile | `/authors/{slug}` | `/authors/sarah-chen` |
| Wallpapers Gallery | `/wallpapers` | `/wallpapers` |
| Infographics Gallery | `/infographics` | `/infographics` |
| Category Archive | `/articles/category/{slug}` | `/articles/category/leadership-decision-making` |
| Topic Archive | `/articles/topic/{slug}` | `/articles/topic/supply-chain` |

#### **4.4.2 Pagination Strategy**

**Option 1: Offset-Based Pagination** (traditional)
- `/articles?page=2`
- `/articles/category/leadership-decision-making?page=3`

**Option 2: Load More** (infinite scroll)
- Initial load: 20 articles
- "Load More" button fetches next 20 from static JSON
- No page reload, better UX

**Recommended**: Hybrid approach
- Static HTML has first 20 articles (no JS required)
- JavaScript enables "Load More" for subsequent results
- Fallback to `?page=2` URLs if JS disabled

### 4.5 Site Search Implementation

#### **4.5.1 Search Options**

**Option A: Static JSON Search** (simple, free)
- Search across pre-generated JSON index
- Client-side fuzzy matching with Fuse.js
- Pros: Free, instant, no backend
- Cons: Limited to indexed fields, no full-text article search

**Option B: Algolia** (recommended for production)
- SaaS search platform with instant results
- Full-text search across article bodies
- Typo tolerance, faceted search, analytics
- Cost: ~$35/month for 10K searches
- Integration: Push article data to Algolia on publish

**Option C: Self-Hosted ElasticSearch**
- Full control, powerful queries
- Requires dedicated server and maintenance
- Cost: $20-50/month for small instance
- Complexity: High

**Recommendation**: Start with Option A (static JSON), upgrade to Algolia when traffic justifies cost.

---

## 5. IMPLEMENTATION ROADMAP

### 5.1 Phased Rollout Strategy

#### **Phase 1: MVP - Articles Engine (Weeks 1-6)**

**Goal**: Publish the backlog of 200 articles with 70% automation

**Scope**:
-  Build article parsing pipeline (Word/PDF → HTML)
-  Implement AI classification (primary category + topics)
-  Create admin review UI
-  Generate static article pages with Schema.org markup
-  Build articles directory with filtering
-  Set up Author database
-  Deploy first 10 articles for testing

**Deliverables**:
1. Admin CMS for article upload
2. AI classification service (API)
3. Review dashboard
4. Static site with 10 sample articles
5. Documentation for editorial team

**Success Criteria**:
- 10 articles published with <30 min manual effort each
- AI classification accuracy >75%
- Google indexes static pages within 48 hours
- Page load time <2 seconds

**Team Requirements**:
- 1 Full-Stack Developer
- 1 AI/ML Engineer (part-time for classification setup)
- 1 Content Editor (for testing review UI)

#### **Phase 2: Videos & Podcasts (Weeks 7-10)**

**Goal**: Add podcast and video publishing capabilities

**Scope**:
-  YouTube metadata extraction API
-  Podbean embed integration
-  Transcript upload and parsing
-  Guest database (extend Author schema)
-  Generate podcast episode static pages
-  Video directory (modal vs. static page logic)

**Deliverables**:
1. Podcast episodes directory
2. 20 published podcast episodes
3. Video directory with transcript support
4. 30 published videos

**Success Criteria**:
- Podcast transcripts fully indexed by Google
- Video pages with transcripts rank in search
- <15 min to publish one podcast episode

#### **Phase 3: Media Galleries (Weeks 11-12)**

**Goal**: Launch wallpapers and infographics galleries

**Scope**:
-  Image upload and thumbnail generation
-  AI-based wallpaper style tagging
-  Modal viewer UI
-  Download tracking
-  Relational linking (infographic → article)

**Deliverables**:
1. Wallpapers gallery with filterable styles
2. 50 published wallpapers
3. Infographics gallery with related content links
4. 30 published infographics

**Success Criteria**:
- Modal viewer works on mobile and desktop
- Download tracking captures user emails
- Related content links increase cross-engagement

#### **Phase 4: Optimization & Scaling (Weeks 13-16)**

**Goal**: Refine automation, improve performance, scale to full catalog

**Scope**:
-  Batch processing for remaining 190 articles
-  AI model retraining with human override data
-  Performance optimization (image CDN, caching)
-  Analytics integration (Google Analytics, custom metrics)
-  Email capture and lead nurturing automation
-  Search upgrade (migrate to Algolia if needed)

**Deliverables**:
1. All 200 articles published
2. All 100 podcast episodes published
3. Performance audit report
4. Analytics dashboard
5. Automated weekly reports on engagement

**Success Criteria**:
- 90%+ automation rate achieved
- Average time-on-site >5 minutes
- Organic search traffic measurable in Google Search Console
- AI classification accuracy >85%

### 5.2 Milestone Timeline

```
Week 1-2:   Setup infrastructure, database schema, dev environment
Week 3-4:   Build article parsing pipeline + AI classification
Week 5-6:   Admin UI + review dashboard + deploy first 10 articles
Week 7-8:   Videos & podcasts backend + metadata extraction
Week 9-10:  Podcast/video directories + publish 50 items
Week 11-12: Media galleries + modal viewers + 80 wallpapers
Week 13-14: Batch processing + publish remaining articles
Week 15-16: Optimization, analytics, training documentation
```

### 5.3 Resource Planning

#### **Team Structure**

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total Effort |
|------|---------|---------|---------|---------|--------------|
| Full-Stack Dev | 40h/wk | 40h/wk | 40h/wk | 40h/wk | 640 hours |
| AI/ML Engineer | 20h/wk | 10h/wk | 5h/wk | 10h/wk | 180 hours |
| UI/UX Designer | 20h/wk | 10h/wk | 15h/wk | 5h/wk | 200 hours |
| Content Editor | 10h/wk | 10h/wk | 5h/wk | 20h/wk | 180 hours |
| DevOps/Infrastructure | 5h/wk | 5h/wk | 5h/wk | 10h/wk | 100 hours |

**Total Estimated Effort**: ~1,300 hours over 16 weeks

#### **Budget Estimates**

| Category | Cost | Notes |
|----------|------|-------|
| Development Labor | $65,000 - $90,000 | Based on blended rate of $50-70/hour |
| AI API Costs (OpenAI/Claude) | $500 - $1,000 | ~200 articles × $0.03 + videos/wallpapers |
| Hosting & Infrastructure | $200 - $500 | Vercel/Netlify + PostgreSQL + S3 storage |
| Third-Party Services | $500 - $1,500 | Algolia (optional), analytics, CDN |
| **Total MVP Cost** | **$66,200 - $93,000** | For complete 16-week buildout |

**Ongoing Monthly Costs** (post-launch):
- Hosting: $50-100
- AI classification (new content): $20-50
- Search (Algolia, if used): $35-75
- Monitoring & analytics: $20
- **Total**: ~$125-245/month

### 5.4 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| AI classification accuracy <70% | Medium | High | Start with conservative confidence thresholds; collect human overrides for retraining |
| PDF parsing fails for complex layouts | High | Medium | Manual fallback workflow; improve parser iteratively |
| YouTube API limits exceeded | Low | Low | Cache metadata; use API keys efficiently |
| Build times too slow (500+ pages) | Medium | Medium | Implement incremental builds; use ISR |
| Content editor adoption issues | Medium | High | Thorough training; intuitive UI design; ongoing support |
| Google indexing slower than expected | Low | Medium | Submit sitemap proactively; use Google Search Console |
| Budget overrun | Medium | High | Phase releases tightly; deprioritize non-essential features |

---

## 6. TECHNICAL STACK RECOMMENDATIONS

### 6.1 Philosophy: "Simple but Robust"

**Core Principles**:
1. **Minimize custom code**: Use proven libraries and frameworks
2. **Maximize automation**: Reduce manual intervention wherever possible
3. **Prioritize maintainability**: Future PMH team must be able to manage it
4. **Optimize for performance**: Static pages, CDN delivery, fast builds
5. **Ensure scalability**: Handle 200 articles now, 2,000 articles later

### 6.2 Recommended Stack (Option A: Next.js + Headless CMS)

#### **Frontend & Static Site Generation**

**Framework**: **Next.js 14+** with App Router

**Why Next.js?**
-  Built-in SSG (Static Site Generation) + ISR (Incremental Static Regeneration)
-  Excellent SEO support (server-side rendering, metadata API)
-  Image optimization out-of-the-box (`next/image`)
-  API routes for lightweight backend logic
-  Large ecosystem and community support
-  Easy deployment to Vercel (same company)

**Alternative**: Astro (lighter weight, multi-framework support)

#### **Headless CMS**

**Recommendation**: **Payload CMS** (self-hosted) or **Sanity** (SaaS)

**Payload CMS**:
-  Free, open-source, self-hosted
-  Built with Node.js + MongoDB/PostgreSQL
-  Rich admin UI out-of-the-box
-  Full control over data schema
-  Supports custom fields, relationships, file uploads
-  Webhook support for triggering builds
-  Requires hosting and maintenance

**Sanity**:
-  SaaS, no hosting required
-  Real-time collaboration
-  Excellent React-based editor (Portable Text)
-  Free tier: 3 users, 100K API requests/month
-  Built-in CDN for images
-  Proprietary query language (GROQ)
-  Costs scale with usage

**Recommendation**: **Payload CMS** for full control, **Sanity** if team prefers SaaS simplicity

#### **Database**

**Recommendation**: **PostgreSQL** (hosted on Railway, Render, or Supabase)

**Why PostgreSQL?**
-  Mature, reliable, open-source
-  Excellent support for JSON fields (for flexible metadata)
-  Full-text search capabilities
-  Strong data integrity and relationships
-  Works with Payload CMS

**Hosting Options**:
- **Supabase**: Free tier includes PostgreSQL + auth + storage
- **Railway**: $5/month for small DB
- **Render**: $7/month for managed PostgreSQL

#### **File Storage (Images, PDFs)**

**Recommendation**: **AWS S3** or **Cloudflare R2**

**AWS S3**:
-  Industry standard, highly reliable
-  Deep integration with CDNs
-  ~$0.023/GB/month storage
-  Free tier: 5GB storage, 20K GET requests/month

**Cloudflare R2**:
-  S3-compatible API
-  **Zero egress fees** (major cost saver)
-  $0.015/GB/month storage
-  Free tier: 10GB storage/month

**Recommendation**: **Cloudflare R2** for cost efficiency (no egress fees)

#### **AI Classification Service**

**Recommendation**: **OpenAI GPT-4 Turbo** (via API)

**Why GPT-4?**
-  Best-in-class accuracy for nuanced text classification
-  Function calling for structured JSON output
-  Cost-effective at scale ($0.01/1K input tokens, $0.03/1K output)
-  Easy to integrate (REST API)
-  Frequent model updates

**Cost Estimate**:
- Average article: ~4,000 tokens input + ~500 tokens output
- Cost per article: ~$0.055
- 200 articles: ~$11 total

**Alternative**: **Anthropic Claude 3.5 Sonnet** (similar pricing, excellent for structured output)

#### **Deployment & Hosting**

**Recommendation**: **Vercel** (for Next.js frontend)

**Why Vercel?**
-  Built by Next.js creators (perfect integration)
-  Free tier: Unlimited static sites, 100GB bandwidth
-  Automatic CI/CD from GitHub
-  Global CDN included
-  Incremental Static Regeneration support
-  Preview deployments for every PR

**CMS Backend Hosting**: **Railway** or **Render** ($10-20/month)

#### **Search (Phase 2)**

**Recommendation**: **Algolia** (start with free tier)

**Free Tier**:
- 10,000 search requests/month
- 10,000 records
- Suitable for MVP launch

**Upgrade**: $35/month when traffic exceeds free tier

### 6.3 Alternative Stack (Option B: Hugo + Directus)

**For teams preferring maximum simplicity and speed**:

#### **Static Site Generator**: **Hugo**
-  Extremely fast builds (500 pages in <5 seconds)
-  No JavaScript runtime required
-  Simple template system (Go templates)
-  Less flexible than Next.js
-  Smaller ecosystem

#### **Headless CMS**: **Directus**
-  Open-source, database-agnostic
-  Auto-generates admin UI from database schema
-  No lock-in (data stays in your PostgreSQL)
-  REST + GraphQL APIs
-  Less mature than Payload/Sanity

**Use Case**: Best for smaller teams comfortable with traditional templating, prioritizing build speed over modern React features.

### 6.4 Architecture Diagram (Recommended Stack)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT EDITORS                          │
│                     (Admin UI in Browser)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAYLOAD CMS (Node.js)                      │
│                   Hosted on Railway ($15/mo)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (Supabase or Railway)               │  │
│  │  - Articles, Authors, Videos, Podcasts, Tags             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  On content publish → Webhook triggers build                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI CLASSIFICATION SERVICE                    │
│                   (Serverless Function / API)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OpenAI GPT-4 Turbo API                                  │  │
│  │  - Receives article text                                 │  │
│  │  - Returns category + topics + confidence scores         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS STATIC SITE BUILD                    │
│                      (Vercel Build Process)                     │
│  1. Fetch all published content from Payload CMS API            │
│  2. Generate static HTML pages for articles, podcasts, etc.     │
│  3. Generate JSON indexes for filtering                         │
│  4. Optimize images (next/image)                                │
│  5. Deploy to CDN                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Global Edge)                     │
│                    Static HTML + Assets                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                          END USERS                              │
│              (Fast static page loads, SEO-friendly)             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE R2 / AWS S3                       │
│              (Media Files: Images, PDFs, Audio)                 │
│              Connected via CDN for fast delivery                │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Development Workflow

#### **Local Development**

```bash
# Clone repository
git clone https://github.com/pmh/content-engine.git
cd content-engine

# Install dependencies
npm install

# Start Payload CMS locally (with local PostgreSQL)
cd cms
npm run dev
# CMS admin UI: http://localhost:3000/admin

# Start Next.js frontend (separate terminal)
cd ../frontend
npm run dev
# Public site: http://localhost:3001

# Seed database with sample data
npm run seed:sample-data
```

#### **Content Publishing Flow**

1. **Content Editor**: Log into Payload CMS admin UI
2. **Upload**: Upload Word/PDF article or paste YouTube URL
3. **AI Processing**: System auto-extracts metadata and suggests tags
4. **Review**: Editor reviews AI suggestions, overrides if needed
5. **Approve**: Click "Publish"
6. **Webhook**: Payload sends webhook to Vercel
7. **Build**: Vercel triggers Next.js incremental build (~30 seconds)
8. **Deploy**: New article page goes live on CDN
9. **Notify**: Optional Slack/email notification to team

**Total Time**: <5 minutes from upload to live publication

#### **CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  repository_dispatch:
    types: [cms-content-published]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build Next.js site
        run: npm run build
        env:
          PAYLOAD_CMS_API_URL: ${{ secrets.PAYLOAD_CMS_API_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 6.6 Monitoring & Analytics

#### **Infrastructure Monitoring**

- **Vercel Analytics**: Built-in performance monitoring (free)
- **Uptime Monitoring**: UptimeRobot (free tier, 50 monitors)
- **Error Tracking**: Sentry (free tier, 5K events/month)

#### **Content Analytics**

- **Google Analytics 4**: Track pageviews, time-on-site, user journeys
- **Google Search Console**: Monitor SEO performance, indexing status
- **Custom Events**: Track downloads, filter usage, cross-content clicks

#### **AI Performance Tracking**

Dashboard in Payload CMS showing:
- AI classification accuracy (human override rate)
- Average confidence scores by category
- Processing time per article
- API cost per month

### 6.7 Security Considerations

#### **Authentication & Authorization**

- Payload CMS has built-in auth (email/password or OAuth)
- Role-based access control (RBAC):
  - **Admin**: Full access, can publish anything
  - **Editor**: Can create/edit content, needs approval to publish
  - **Contributor**: Can draft content only
  - **Reviewer**: Can approve/reject pending content

#### **API Security**

- Payload CMS API requires authentication tokens
- Next.js build process uses secure API keys (not exposed to client)
- Rate limiting on public-facing APIs
- CORS configured to allow only frontend domain

#### **Data Security**

- PostgreSQL connection uses SSL/TLS
- S3/R2 buckets have private access (CDN signed URLs for delivery)
- No sensitive data exposed in static site (API keys, user data)
- Regular automated backups of database

---

## 7. SUCCESS METRICS & KPIs

### 7.1 Technical Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Page Load Time (First Contentful Paint) | <1.5s | Lighthouse, Vercel Analytics |
| Time to Interactive | <3s | Lighthouse |
| Build Time (500 articles) | <5 min | CI/CD logs |
| AI Classification Accuracy | >80% | Human override rate tracking |
| Automation Rate (content published without manual intervention) | >70% | CMS analytics dashboard |
| Uptime | 99.9% | Uptime monitoring service |

### 7.2 Content Metrics

| Metric | Target (3 months post-launch) | Measurement Method |
|--------|-------------------------------|-------------------|
| Articles Published | 200+ | CMS count |
| Podcast Episodes Published | 100+ | CMS count |
| Videos Published | 150+ | CMS count |
| Average Time on Article Page | >4 min | Google Analytics |
| Bounce Rate | <40% | Google Analytics |
| Pages per Session | >2.5 | Google Analytics |
| Organic Search Impressions | 10,000+/month | Google Search Console |
| Organic Search Clicks | 500+/month | Google Search Console |

### 7.3 User Engagement Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| PDF Downloads | 200+/month | Custom event tracking |
| Wallpaper Downloads | 500+/month | Custom event tracking |
| Filter Usage (% of visitors who use filters) | 30% | Custom event tracking |
| Cross-Content Clicks (article → related video) | 15% click-through rate | Custom event tracking |
| Email Captures (for downloads) | 100+/month | CRM integration |
| Returning Visitors | 25% of total traffic | Google Analytics |

### 7.4 Business Impact Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Reduction in Content Publishing Time | 80% (from ~2 hours to ~20 min per article) | Time tracking |
| Increase in Inbound Inquiries | 50% increase | CRM/email tracking |
| Content Referenced in Fundraising Meetings | Qualitative feedback | Team reports |
| Social Media Shares | 50+ shares/month | Social analytics |

---

## 8. TRAINING & DOCUMENTATION REQUIREMENTS

### 8.1 User Documentation (for Content Editors)

**Content**:
1. **Getting Started Guide**
   - How to log into Payload CMS
   - Overview of content types (articles, videos, podcasts)
   - Understanding the review workflow

2. **Article Publishing Workflow**
   - Step-by-step: Upload Word/PDF → Review AI suggestions → Publish
   - How to select/add authors
   - How to upload featured images and PDFs
   - Understanding confidence scores

3. **AI Classification Guide**
   - What each Primary Category means
   - When to override AI suggestions
   - How to add new tags (request to admin)

4. **Troubleshooting Common Issues**
   - PDF parsing errors (fallback to manual entry)
   - Image not displaying correctly
   - YouTube video not embedding
   - Build/deploy status checking

**Format**: Video tutorials (5-10 min each) + written step-by-step guides with screenshots

### 8.2 Technical Documentation (for Developers)

**Content**:
1. **System Architecture Overview**
   - Component diagram
   - Data flow
   - API integrations

2. **Local Development Setup**
   - Prerequisites (Node.js, PostgreSQL)
   - Environment variables
   - Running CMS and frontend locally
   - Seeding test data

3. **Database Schema Reference**
   - ERD (Entity-Relationship Diagram)
   - Table descriptions
   - Key relationships

4. **AI Classification Pipeline**
   - How prompts are structured
   - Adding new categories/topics
   - Retraining with human overrides

5. **Deployment & CI/CD**
   - How builds are triggered
   - Environment configuration
   - Rollback procedures

6. **Extending the System**
   - Adding new content types
   - Custom fields in CMS
   - Modifying static page templates

**Format**: Markdown files in `/docs` directory + auto-generated API documentation

### 8.3 Admin Documentation (for System Administrators)

**Content**:
1. **User Management**
   - Creating new users
   - Role assignments
   - Password reset procedures

2. **Taxonomy Management**
   - Adding new categories (requires code deploy)
   - Adding new topics (CMS admin UI)
   - Updating category definitions

3. **Monitoring & Maintenance**
   - Where to check system health
   - Database backup/restore procedures
   - Responding to errors (Sentry alerts)

4. **Cost Optimization**
   - Monitoring AI API usage
   - CDN bandwidth tracking
   - When to upgrade hosting tiers

**Format**: Internal wiki or Notion documentation

---

## 9. FUTURE ENHANCEMENTS (Post-MVP)

### 9.1 Advanced Features (Months 6-12)

1. **Multi-Language Support**
   - Translate articles into Spanish, French, Chinese
   - Auto-translation API integration (DeepL)
   - Language switcher in UI

2. **User Accounts & Personalization**
   - User registration (save favorite articles)
   - Reading history tracking
   - Personalized content recommendations
   - Email newsletter subscriptions

3. **Advanced Analytics**
   - Heatmaps showing user scroll depth
   - A/B testing for article titles/images
   - Cohort analysis (user retention over time)

4. **Content Versioning**
   - Track article revisions over time
   - Compare versions side-by-side
   - Restore previous versions

5. **Collaborative Editing**
   - Multiple editors can work on same article
   - Comment threads on drafts
   - Approval workflows with multiple reviewers

6. **AI-Generated Summaries**
   - Auto-generate article excerpts
   - Create social media posts from articles
   - Generate audio versions (text-to-speech)

7. **Enhanced Search**
   - Natural language queries ("articles about supply chain resilience written in 2025")
   - Search within transcripts
   - Semantic search (find articles about similar concepts)

8. **Mobile App**
   - Native iOS/Android apps for offline reading
   - Push notifications for new content
   - Audio podcast player

### 9.2 Content Strategy Enhancements

1. **Content Clustering**
   - Group related articles into "Learning Paths"
   - Create curated collections (e.g., "Introduction to Mearth Framework")

2. **Interactive Content**
   - Embedded calculators or tools
   - Interactive infographics (data visualizations)
   - Quizzes to test understanding

3. **Community Features**
   - Comments on articles (moderated)
   - Reader questions answered by authors
   - Community-contributed content

4. **Premium Content**
   - Gated in-depth reports (email or payment)
   - Exclusive webinars or video series
   - Certificate programs

---

## 10. CONCLUSION & NEXT STEPS

### 10.1 Summary

The Project Moon Hut Content Engine is a **comprehensive, AI-assisted publishing platform** designed to solve a critical bottleneck: publishing 200+ high-quality articles and hundreds of multimedia assets with minimal manual overhead.

**Key Differentiators**:
-  **90% automation** through AI classification and metadata extraction
-  **Static, SEO-friendly pages** for maximum discoverability
-  **Human-in-the-loop approval** ensures quality and accuracy
-  **Unified author database** eliminates duplicate data entry
-  **Scalable architecture** handles 200 articles today, 2,000 tomorrow
-  **Cost-efficient** (~$125/month ongoing costs after initial buildout)

**Business Impact**:
- Publish backlog of 200 articles in weeks, not months
- Increase organic search traffic through static, indexed pages
- Improve user engagement with structured navigation and filtering
- Support fundraising efforts with professional content presentation
- Reduce content management overhead by 80%

### 10.2 Immediate Next Steps

1. **Stakeholder Review** (Week 1)
   - Review this document with PMH leadership
   - Confirm scope, timeline, and budget
   - Identify 5-10 sample articles for testing

2. **Gather Missing Specifications** (Week 1)
   - PMH Classification System (1-15) definitions
   - 6 MegaChallenges definitions
   - Topics controlled list
   - Sample articles (Word/PDF files)

3. **Assemble Development Team** (Week 1-2)
   - Hire or contract full-stack developer
   - Engage AI/ML engineer for classification setup
   - Onboard UI/UX designer

4. **Technical Setup** (Week 2)
   - Provision infrastructure (database, hosting, S3/R2)
   - Set up GitHub repository
   - Configure development environments
   - Create initial database schema

5. **Sprint 1: Article Parsing** (Week 3-4)
   - Build Word/PDF parser
   - Test on 10 sample articles
   - Refine extraction logic based on results

6. **Sprint 2: AI Classification** (Week 5-6)
   - Integrate OpenAI API
   - Build classification prompt with category definitions
   - Test accuracy on 10 articles, compare with human judgment

7. **Sprint 3: Admin UI** (Week 7-8)
   - Build Payload CMS review dashboard
   - Implement approval workflow
   - User acceptance testing with content editor

8. **Sprint 4: Static Site Generation** (Week 9-10)
   - Build Next.js templates for articles
   - Implement Schema.org markup
   - Deploy first 10 articles to staging environment

9. **Launch MVP** (Week 11)
   - Publish first 10 articles to production
   - Monitor Google indexing (Search Console)
   - Collect feedback from stakeholders

10. **Scale to Full Catalog** (Week 12-16)
    - Batch process remaining 190 articles
    - Add podcasts and videos
    - Launch media galleries
    - Optimize and refine based on analytics


### 10.3 Success Criteria (3 Months Post-Launch)

The platform will be considered successful if:

1.  **200+ articles published** with minimal manual effort
2.  **Google indexes 90%+ of static pages** within 2 weeks of publication
3.  **AI classification accuracy >80%** (measured by human override rate)
4.  **Average article publishing time <20 minutes** (down from 2+ hours)
5.  **Average time-on-site >4 minutes** (indicating engaging content discovery)
6.  **Organic search traffic measurable** in Google Search Console
7.  **Content editor adoption** (team uses system without constant support requests)
8.  **Platform uptime >99.5%** (reliable, production-ready)

---

## APPENDICES

### Appendix A: Glossary

**AI Classification**: Machine learning process that suggests categories and tags for content based on textual analysis.

**Confidence Score**: Percentage (0-100%) indicating how certain the AI is about a classification suggestion. Lower scores flag content for human review.

**Headless CMS**: Content management system that provides content via API, decoupled from presentation layer (frontend).

**Human-in-the-Loop**: Automation design where AI performs initial work but humans review and approve before final action.

**Incremental Static Regeneration (ISR)**: Next.js feature allowing static pages to be updated without rebuilding entire site.

**PMH Classification System**: Project Moon Hut's proprietary taxonomy (1-15) for categorizing content by thematic focus.

**Schema.org Markup**: Structured data format recognized by search engines to enhance search result displays and indexing.

**Slug**: URL-friendly version of a title (e.g., "Redesigning Supply Chains" → "redesigning-supply-chains").

**Static Site Generation (SSG)**: Building HTML pages at build time rather than runtime, resulting in faster loads and better SEO.

**Taxonomy**: Controlled vocabulary for organizing content (categories, tags, topics).

### Appendix B: Sample Database Queries

**Find all articles with low AI confidence (<70%) for review**:
```sql
SELECT a.id, a.title, a.ai_category_confidence, a.status
FROM articles a
WHERE a.ai_category_confidence < 70.00
  AND a.status = 'PENDING_REVIEW'
ORDER BY a.ai_category_confidence ASC;
```

**Get most popular articles by views**:
```sql
SELECT a.title, a.slug, a.views_count, a.publish_date,
       c.name as category_name,
       STRING_AGG(au.full_name, ', ') as authors
FROM articles a
JOIN categories c ON a.primary_category_id = c.id
JOIN article_authors aa ON a.id = aa.article_id
JOIN authors au ON aa.author_id = au.id
WHERE a.status = 'PUBLISHED'
GROUP BY a.id, a.title, a.slug, a.views_count, a.publish_date, c.name
ORDER BY a.views_count DESC
LIMIT 20;
```

**Track AI classification accuracy (human override rate)**:
```sql
SELECT
  COUNT(*) as total_articles,
  SUM(CASE WHEN human_override = TRUE THEN 1 ELSE 0 END) as overridden_count,
  ROUND(100.0 * SUM(CASE WHEN human_override = TRUE THEN 1 ELSE 0 END) / COUNT(*), 2) as override_rate_percent,
  AVG(ai_category_confidence) as avg_confidence
FROM articles
WHERE status = 'PUBLISHED'
  AND ai_processed_at IS NOT NULL;
```

**Find related content for an article**:
```sql
SELECT
  cr.relationship_type,
  cr.related_type,
  CASE
    WHEN cr.related_type = 'ARTICLE' THEN (SELECT title FROM articles WHERE id = cr.related_id)
    WHEN cr.related_type = 'VIDEO' THEN (SELECT title FROM videos WHERE id = cr.related_id)
    WHEN cr.related_type = 'PODCAST' THEN (SELECT episode_title FROM podcasts WHERE id = cr.related_id)
  END as related_title
FROM content_relationships cr
WHERE cr.source_type = 'ARTICLE'
  AND cr.source_id = 'uuid-of-article';
```

### Appendix C: Example AI Classification Prompt

```
SYSTEM PROMPT:

You are an expert content classifier for Project Moon Hut. Analyze the provided article and suggest appropriate categorization.

PRIMARY CATEGORIES (choose exactly one):

1. Leadership & Decision-Making
   Focus: Leadership thinking, strategic direction, decision frameworks under uncertainty

2. Innovation & Systems Thinking
   Focus: New paradigms, reframing challenges, systems design, cross-disciplinary thinking

[... 12 more category definitions ...]

CLASSIFICATION RULES:
- Select the PRIMARY category that represents the article's main contribution
- Provide confidence score (0-100) based on clarity of fit
- Suggest 2-5 relevant topics
- Identify applicable PMH Classifications (1-15) and MegaChallenges (1-6)

OUTPUT FORMAT (JSON):
{
  "primary_category": {"slug": "...", "confidence": 87},
  "topics": [{"slug": "...", "confidence": 92}],
  "pmh_classifications": [3, 7],
  "mega_challenges": [2],
  "reasoning": "Explanation of classification decision..."
}

---

USER PROMPT:

Classify this article:

TITLE: Redesigning Global Supply Chains for Resilience
SUBTITLE: A systems approach to supply chain architecture

BODY:
[First 3000 words of article content...]

Return classification as JSON.
```

### Appendix D: Sample Static Page HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>Redesigning Global Supply Chains for Resilience | Project Moon Hut</title>
  <meta name="description" content="A systems approach to supply chain architecture in a globally interconnected economy.">
  <meta name="keywords" content="supply chain, resilience, logistics, systems thinking">
  <meta name="author" content="Dr. Sarah Chen">
  <link rel="canonical" href="https://pmh.org/articles/redesigning-global-supply-chains">

  <!-- Open Graph -->
  <meta property="og:title" content="Redesigning Global Supply Chains for Resilience">
  <meta property="og:description" content="A systems approach to supply chain architecture">
  <meta property="og:image" content="https://pmh.org/images/article-123.jpg">
  <meta property="og:url" content="https://pmh.org/articles/redesigning-global-supply-chains">
  <meta property="og:type" content="article">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Redesigning Global Supply Chains for Resilience",
    "author": {
      "@type": "Person",
      "name": "Dr. Sarah Chen",
      "url": "https://pmh.org/authors/sarah-chen"
    },
    "datePublished": "2026-04-15T09:00:00Z",
    "image": "https://pmh.org/images/article-123.jpg",
    "articleSection": "Materials, Mining & Supply Chains",
    "wordCount": 3245
  }
  </script>
</head>
<body>
  <!-- Header/Navigation -->
  <header>
    <nav><!-- Main navigation --></nav>
  </header>

  <!-- Article Content -->
  <main>
    <article>
      <!-- Featured Image -->
      <img src="https://pmh.org/images/article-123.jpg" alt="Supply chain visualization">

      <!-- Article Header -->
      <header>
        <div class="category-badge">Materials, Mining & Supply Chains</div>
        <h1>Redesigning Global Supply Chains for Resilience</h1>
        <h2>A systems approach to supply chain architecture</h2>

        <!-- Author Info -->
        <div class="author-info">
          <img src="https://pmh.org/authors/sarah-chen.jpg" alt="Dr. Sarah Chen">
          <div>
            <a href="/authors/sarah-chen">Dr. Sarah Chen</a>
            <time datetime="2026-04-15">April 15, 2026</time>
            <span>13 min read</span>
          </div>
        </div>

        <!-- Tags -->
        <div class="tags">
          <a href="/articles/topic/supply-chain">#Supply Chain</a>
          <a href="/articles/topic/resilience">#Resilience</a>
        </div>
      </header>

      <!-- Article Body -->
      <div class="article-body">
        <!-- Rich HTML content with proper semantic markup -->
        <p>...</p>
        <h3>...</h3>
        <p>...</p>
      </div>

      <!-- Related Content -->
      <aside class="related-content">
        <h3>Related Resources</h3>
        <a href="/infographics/supply-chain-model">
          <img src="..." alt="...">
          Supply Chain Model Infographic
        </a>
        <a href="/videos/supply-chain-explainer">
          <img src="..." alt="...">
          5-Min Video Explainer
        </a>
      </aside>

      <!-- Download CTA -->
      <div class="download-cta">
        <button onclick="showEmailGate()">Download PDF Version</button>
      </div>

      <!-- Author Bio -->
      <footer class="author-bio">
        <img src="https://pmh.org/authors/sarah-chen.jpg" alt="Dr. Sarah Chen">
        <div>
          <h4>Dr. Sarah Chen</h4>
          <p>Expert in supply chain resilience and complex systems design...</p>
          <div class="social-links">
            <a href="https://linkedin.com/in/sarahchen">LinkedIn</a>
            <a href="https://twitter.com/drsarahchen">X</a>
          </div>
        </div>
      </footer>
    </article>
  </main>

  <!-- Footer -->
  <footer>
    <!-- Site footer navigation -->
  </footer>
</body>
</html>
```

### Appendix E: Technology Stack Comparison Matrix

| Criteria | Next.js + Payload | Hugo + Directus | Astro + Sanity |
|----------|-------------------|-----------------|----------------|
| **Build Speed (500 pages)** | 3-5 min | <1 min | 2-3 min |
| **Developer Experience** | Excellent (React) | Good (Go templates) | Excellent (multi-framework) |
| **SEO Capabilities** | Excellent | Excellent | Excellent |
| **CMS Flexibility** | High (self-hosted) | High (self-hosted) | Medium (SaaS) |
| **Hosting Cost** | $10-30/mo | $5-15/mo | $15-35/mo |
| **Community Support** | Very Large | Large | Growing |
| **Incremental Builds** | Yes (ISR) | Partial | Yes |
| **Recommended For** | Modern, scalable solution | Simple, fast sites | Optimized static sites |

**Recommendation**: **Next.js + Payload CMS** for balance of features, maintainability, and ecosystem support.

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-13 | AI Architect | Initial comprehensive document plan |

---

**END OF DOCUMENT**

---

