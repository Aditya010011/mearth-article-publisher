# Mearth Article Publisher - Phase 1 MVP

Static HTML article publisher for Mearth (Project Moon Hut) - Converts Word documents into searchable, SEO-optimized static HTML pages.

## Features

- 📄 Parse Word documents (.docx) to extract title, subtitle, and body content
- 🎨 Generate clean, static HTML pages with SEO optimization
- 🏷️ Manual tagging system (Categories, PMH Zones, MegaChallenges, Topics, Entities)
- 📎 Additional Resources support (PDFs, images, video links, external references)
- 👤 Author management with social links
- 📊 Searchable, filterable article directory
- 📦 Export package ready for upload to web server
- 🔍 Schema.org structured data for better Google indexing

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Text editor (VS Code recommended)
- Web browser

### Installation

```bash
# 1. Navigate to the project directory
cd mearth-article-publisher

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open browser to http://localhost:3000
```

## Usage

### Publishing a Single Article

1. **Upload Files**
   - Word document (.docx) - Required
   - PDF file (.pdf) - Required
   - Featured image (JPG/PNG) - Required

2. **Review & Edit**
   - Check extracted title, subtitle, body
   - Make any corrections in the textarea
   - Select author (defaults to David Goldsmith)
   - Set publish date

3. **Tag the Article**
   - Choose Primary Category (required)
   - Select relevant PMH Zones (1-15)
   - Select MegaChallenges (no ranking)
   - Add Topics (2-5 recommended)
   - Select Entity Associations

4. **Additional Resources (Optional)**
   - Click "Add Resource" to attach:
     - Extra PDFs (infographics, appendices)
     - Images/graphics
     - Video links (YouTube, etc.)
     - External references

5. **Generate & Export**
   - Click "Preview" to see rendered page (optional)
   - Click "Generate & Export" to create static HTML
   - Article is added to export package

6. **Export All**
   - Click "Export All for Upload" button
   - Download ZIP file
   - Send to web administrator for upload

### Batch Processing (For 200 Articles)

See `batch-processing-guide.md` for detailed instructions on processing multiple articles at once.

## File Structure

```
mearth-article-publisher/
├── server.js                 # Express server
├── package.json             # Dependencies
├── config.json              # Site configuration (EDITABLE)
├── README.md                # This file
│
├── data/                    # JSON data files
│   ├── authors.json         # Author database
│   ├── categories.json      # 14 primary categories
│   ├── pmh-zones.json       # 15 classification zones
│   ├── mega-challenges.json # 6 MegaChallenges
│   ├── entities.json        # Entity associations
│   └── topics.json          # Topics list
│
├── templates/               # EJS templates
│   ├── admin.ejs            # Admin interface
│   ├── article.ejs          # Article page template
│   └── index.ejs            # Directory page template
│
├── public/                  # Static assets
│   ├── css/                 # Stylesheets
│   └── js/                  # JavaScript
│
├── uploads/                 # Temporary upload folder
├── output/                  # Generated static site
│   └── discover/
│       └── articles/
│           └── {slug}/
│               ├── index.html
│               ├── {slug}.pdf
│               ├── featured-image.jpg
│               └── resources/ (if additional resources)
│
├── drafts/                  # Saved drafts
└── exports/                 # Export ZIP files
```

## Configuration

Edit `config.json` to customize:

- **Site branding**: Name, tagline, logo, colors
- **Paths**: Where articles are published
- **Defaults**: Default author, read speed, page size
- **Features**: Enable/disable features
- **Validation**: File size limits, allowed types

## Data Files

### Adding Authors

Edit `data/authors.json`:

```json
{
  "id": "john-doe",
  "full_name": "John Doe",
  "title": "Researcher",
  "organization": "Mearth Research",
  "bio": "Expert in...",
  "photo": "/authors/john-doe.jpg",
  "linkedin": "https://linkedin.com/in/johndoe",
  "is_default": false
}
```

### Adding Topics

Edit `data/topics.json`:

```json
{
  "id": "new-topic",
  "name": "New Topic Name",
  "slug": "new-topic"
}
```

## Troubleshooting

### Word Document Won't Parse
- Make sure file is `.docx` (not `.doc`)
- Try opening and re-saving in Microsoft Word
- Check that document has at least one heading

### Images Not Displaying
- Verify image file is JPG or PNG
- Check file size (must be under 10MB)
- Make sure filename has no special characters

### Export Failed
- Check disk space
- Verify all required articles have been generated
- Try closing and restarting the server

## Support

For questions or issues:
- Email: info@moonhut.org
- Documentation: See Phase1_MVP_Specification.md

## License

Copyright © 2026 Project Moon Hut Foundation / Mearth. All rights reserved.
