# PROJECT MOON HUT - CONTENT ENGINE SPECIFICATION (V1)

## 1. SYSTEM OVERVIEW

The platform consists of two engine types:

### A. Metadata-Heavy Engine (Static SEO Pages)

- Papers / Articles
- Videos (if transcript exists)
- Podcast Episodes

### B. Media Gallery Engine (Lightweight, Modal-Based)

- Wallpapers
- Infographics

Each content type has defined fields, tagging rules, and publish behavior.

---

## 2. PAPERS / ARTICLES ENGINE

### Purpose

Create static HTML pages optimized for SEO with structured metadata and filtering capability.

### Required Fields

- **Title**
- **Subtitle** (optional)
- **Full Body Content** (HTML or parsed from document)
- **Author** (selected from Author Database with multiple author capabilities)
- **Publish Date**
- **Featured Image**
- **PDF** (optional upload)
- **Infographic** (optional upload)
- **Video Link** (optional)
- **Related Assets** (optional)
- **Category** (single-select, controlled list; used for first-view navigation)

### Tagging (Selectable by Admin)

- Project Moon Hut Classification System (1-15, multi-select)
- 6 MegaChallenges (multi-select)
- Topics (multi-select, controlled list)
- Entity Association (multi-select: e.g., MearthLink, Mearth Energy, etc.)

### Automated (Rule-Based)

- Slug generation
- Static page creation
- File type detection
- Metadata schema markup

### Publish Behavior

- Creates static HTML page
- Appears in Articles Directory
- Filterable by tags
- Searchable by keyword
- Download PDF option (if attached)


### Category System

Articles need a "Category" as a separate field from "Topics" for "first view" navigation.

- **Category** (single-select, controlled list)

Standard taxonomy pattern (single "section" + multiple tags). Source pattern reference:

- https://developers.google.com/search/docs/appearance/structured-data
- https://schema.org/Article

### Initial Category List

These map cleanly to what you already write, and they match your wireframe intent (leadership, innovation, etc.):

1. Leadership & Decision-Making
2. Innovation & Systems Thinking
3. Mearth Framework (Earth–Moon construct)
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

Each category includes a definition used by the AI classification engine. AI must reference category definitions when suggesting primary category assignments.

---

## PRIMARY ARTICLE CATEGORY DEFINITIONS

(single-select — required for every article)

### Leadership & Decision-Making

Focuses on leadership thinking, strategic direction, decision frameworks, and how individuals or organizations choose paths forward under uncertainty. Includes executive thinking, long-range planning, and the psychology of leading complex initiatives. Applies to both institutional and personal leadership.

### Innovation & Systems Thinking

Explores new ways of thinking, reframing challenges, systems design, and paradigm-shifting approaches that change how problems and opportunities are understood. Includes cross-disciplinary thinking, structural redesign, and new models that reshape industries or societies. Not limited to technology innovation.

### Mearth Framework (Earth–Moon Construct)

Covers the Earth–Moon ecosystem framework and its economic, societal, technological, and philosophical implications. Includes discussions of the Mearth construct, Earth-based development arising from Moon initiatives, and the long-term interconnected system being built. Focus is on the integrated model rather than a single technology or project.

### Economy, Finance & Markets

Addresses economic systems, capital flows, market structures, investment models, financial innovation, and long-term value creation. Includes discussions of funding models, global markets, economic transitions, and new financial architectures. Applies to both traditional and emerging economic systems.

### Technology & Engineering

Focuses on engineering, technical systems, applied science, and the development or deployment of technologies. Includes software, hardware, infrastructure technologies, and integrated technical solutions. Applies to both Earth-based and beyond-Earth enabling technologies.

### Robotics & Automation

Covers robotics systems, automation technologies, autonomous operations, and machine-assisted processes. Includes industrial robotics, AI-driven automation, and human-machine collaboration. Focuses on operational and systemic use rather than general AI philosophy.

### Energy & Power Systems

Addresses generation, storage, transmission, and management of energy and power systems. Includes traditional and advanced energy models, grid systems, alternative energy, and power infrastructure. Focuses on reliable and scalable energy for future systems.

### Materials, Mining & Supply Chains

Covers materials science, mining systems, resource extraction, processing, logistics, and supply chain structures. Includes rare materials, hypermaterials, manufacturing inputs, and global sourcing challenges. Focus is on physical resource systems enabling long-term development.

### Food, Agriculture & Bio-Systems

Focuses on food production, agricultural systems, biological cycles, and sustainable resource cultivation. Includes advanced agriculture, controlled-environment growing, food security, and biological system design. Applies to both Earth-based and extended ecosystem models.

### Water, Environment & Resilience

Addresses water systems, environmental conditions, ecological resilience, and long-term sustainability of natural resources. Includes climate patterns, environmental adaptation, and infrastructure resilience. Focuses on maintaining stable living systems over time.

### Education & Learning Systems

Covers education models, learning frameworks, curriculum design, and knowledge transfer systems. Includes institutional education, alternative learning models, and lifelong learning structures. Focus is on how knowledge is developed and shared across generations.

### Governance, Law & Standards

Addresses governance models, regulatory systems, legal frameworks, standards creation, and institutional coordination. Includes international cooperation, policy structures, and rule-based systems guiding complex initiatives. Focus is on order, structure, and operational clarity.

### Human Behavior & Psychology

Explores human thinking, behavior, motivation, perception, and decision psychology. Includes cultural dynamics, social behavior, and cognitive patterns shaping individual and collective action. Focus is on the human dimension of progress and resistance to change.

### Infrastructure & Logistics

Covers physical and operational infrastructure including transportation, construction, supply movement, and large-scale systems deployment. Includes logistics networks, industrial build-out, and long-duration infrastructure planning. Focus is on enabling operational continuity and expansion.

---

### AI Classification Context

We have 200 articles. The system suggests:

- Category AI-suggested + confidence scored, then you only review outliers
- Add under section 8 "Automation vs Human Review → AI Suggested":
  - Category suggestion (single-select) with confidence
  - Topics suggestion (multi-select) with confidence

---

## 3. VIDEOS ENGINE

### Purpose

List and optionally index videos with structured metadata.

### Required Fields

- **Title**
- **Description** (short summary)
- **Video Source** (YouTube, internal, etc.)
- **Thumbnail**
- **Creator** (from database)

### Optional

- **Transcript** (if provided → creates static SEO page)
- **Related Paper**
- **Related Podcast**

### Tagging

- Topics (multi-select)
- Optional: PMH Classification
- Optional: MegaChallenges

### Publish Behavior

- Appears in Video Directory
- Click behavior:
  - If no transcript → modal player
  - If transcript exists → static page with transcript


---

## 4. PODCAST ENGINE (Two Series)

### Series

- Age of Infinite
- Redefining Tomorrow

### Required Fields

- **Episode Title**
- **Episode Number**
- **Series Identifier**
- **Guest** (from Guest Database)
- **Bio** (auto-pulled from Guest DB)
- **Audio Embed** (Podbean or source)
- **Full Transcript**
- **Publish Date**

### Optional

- Social links (LinkedIn, X, etc.)
- **Related Paper**
- **Related Video**

### Automated

- Static HTML page creation
- Slug
- Structured metadata for Google indexing

### Directory Behavior

- Filter by series
- Filter by guest
- Search by keyword

---

## 5. WALLPAPERS ENGINE (Gallery Model)

### Purpose

Visual browsing only. No static page.

### Required Fields

- **Title** (optional internal)
- **Image File**
- Resolution auto-detected

### Automated

- Detect orientation (desktop / mobile / square)
- File type detection
- Generate thumbnail

### User Sort Function (Filterable)

#### LAYER A — PRIMARY STYLE (1 required)

- Abstract
- African
- Art Deco
- Art Nouveau
- Bauhaus
- Constructivism
- Contemporary
- Gothic
- Hollywood Regency
- Industrial
- Japanese Zen
- Mid-Century
- Minimalist
- Modern
- Ottoman
- Scandinavian
- Rustic
- Victorian
- Cartoon
- Cosmic/Futurist

#### LAYER B — VISUAL CHARACTER (multi-tag allowed)

- Geometric
- Ornate
- Textured
- High Contrast
- Muted Palette
- Vibrant
- Symmetrical
- Organic
- Architectural
- Cultural
- Futuristic
- Sacred Geometry
- Mechanical
- Mythic
- Soft Minimal
- Dark Mode

#### LAYER C — MOOD / ENERGY

- Calm
- Bold
- Dramatic
- Playful
- Serene
- Intense
- Elegant
- Raw
- Spiritual
- Technical

### Viewer Behavior

- Click thumbnail → Modal opens
  - Zoom
  - Download
  - Close modal
- No static page required

---

## 6. INFOGRAPHICS ENGINE (Gallery Model)

### Purpose

Structured infographic display with optional relational links.

### Required Fields

- **Title**
- **One-Line Description**
- **Infographic File** (Image or PDF)

### Tagging

- Topics (multi-select)
- Entity Association (multi-select)
- Optional: PMH Classification
- Optional: MegaChallenges

### Optional Relational Links

- Related Paper
- Related Video
- Related Deck

### Viewer Behavior

- Click thumbnail → Modal viewer
  - Zoom
  - Download
  - Show related links inside modal
- No static page required

---

## 7. AUTHOR / GUEST DATABASE

### Author Fields

- **Full Name**
- **Title**
- **Organization**
- **Email**
- **Bio**
- **Headshot**


### Social Links

- LinkedIn
- Facebook
- Instagram
- X
- TikTok
- YouTube
- Amazon Book Link (optional)
- Websites

### Working inside PMH or Mearth Entity

#### Affiliation

- PMH Foundation
- Mearth Entity
- Partner Org
- Guest / External
- Internal Contributor

---

## 8. AUTOMATION VS HUMAN REVIEW

### Automated

- Slug
- File detection
- Thumbnail creation
- Orientation detection
- Static page generation (where applicable)

### AI Suggested (Optional)

- Topic tagging
- Classification tagging
- Category suggestion (single-select) with confidence score

### Human Required

- Final approval
- Author selection (if not associated with the artifact)
- Publish confirmation

---

## 9. TAG DICTIONARY (LOCKED)

All dropdown values must be predefined and editable only by admin. No dynamic user-created tags allowed.

Single-select list used by Articles directory navigation.

---

## 10. CONTENT HIERARCHY RULES

- Every Article must have exactly one Primary Category
- Articles may have multiple Topics
- Articles may have multiple MegaChallenges
- Articles may have multiple Entity Associations
- MegaChallenges are overlay tags and are not used as primary navigation sections
- Topics are filter tags and are not primary navigation sections

---

## 11. AI CLASSIFICATION INSTRUCTIONS

### When processing Articles

- Analyze full body text
- Suggest Primary Category (single)
- Suggest Topics (multi)
- Suggest MegaChallenges (multi)
- Provide confidence score (0–100%)
- Flag low confidence (<70%) for manual review

### When processing Videos

- Analyze title + description + transcript (if available)
- Suggest Topics
- Suggest MegaChallenges

#### If transcript exists

- Create static page
- Embed video player at top
- Display transcript below
- Add structured data markup (VideoObject)

#### Otherwise

- Video remains modal-only

### When processing Wallpapers

- Analyze visual features
- Suggest Layer A Primary Style
- Suggest Layer B Visual Character
- Suggest Layer C Mood

---

## SUPPLY REQUIREMENTS

To enable AI classification, supply:

- Definitions of the PMH Classification System
- 6 MegaChallenges
- 5-10 Samples of Papers