# ADDITIONAL RESOURCES FEATURE - USER GUIDE

**Added**: 2026-05-19  
**Requested by**: David Goldsmith

---

## 🎯 PURPOSE

Sometimes an article needs **more than just the main PDF**. You might want to include:
- 📊 **Supplementary graphics** (infographics, charts, models)
- 🎥 **Related videos** (YouTube explainers, presentations)
- 📄 **Additional documents** (detailed reports, appendices)
- 🔗 **External references** (source papers, related articles, datasets)

The **Additional Resources** feature lets you attach any number of these to an article.

---

## 📋 HOW IT WORKS

### In the Admin Interface

When creating/editing an article, you'll see a new section:

```
┌─────────────────────────────────────────────────────┐
│ SECTION H: Additional Resources (Optional)          │
│                                                     │
│ [+ Add Resource]                                    │
│                                                     │
│ Resource 1                               [Remove]  │
│ ┌─────────────────────────────────────────────┐   │
│ │ Type: [PDF Document ▼]                      │   │
│ │ Title: Supply Chain Infographic             │   │
│ │ Description: Visual model of the framework  │   │
│ │ File: [Choose File] infographic.pdf         │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ Resource 2                               [Remove]  │
│ ┌─────────────────────────────────────────────┐   │
│ │ Type: [Video Link ▼]                        │   │
│ │ Title: 5-Minute Overview                    │   │
│ │ Description: Video explainer                │   │
│ │ URL: https://youtube.com/watch?v=abc123     │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ [+ Add Another Resource]                           │
└─────────────────────────────────────────────────────┘
```

### Resource Types

| Type | Icon | What It's For | How It Works |
|------|------|--------------|--------------|
| **PDF Document** | 📄 | Additional PDFs, reports, appendices | Upload file, stored in article's `/resources/` folder |
| **Image/Graphic** | 🖼️ | Infographics, diagrams, models, charts | Upload image file (JPG, PNG) |
| **Video Link** | 🎥 | YouTube, Vimeo, etc. | Enter URL, opens in new tab |
| **External Link** | 🔗 | Source papers, references, datasets | Enter URL, opens in new tab |
| **Presentation/Deck** | 📊 | Slides, keynotes (as PDF) | Upload PDF of slides |

---

## 📂 FILE ORGANIZATION

Each article gets its own `resources/` subfolder:

```
/discover/articles/redesigning-supply-chains/
├── index.html                      (article page)
├── redesigning-supply-chains.pdf   (main PDF)
├── featured-image.jpg              (header image)
└── resources/                      (additional resources)
    ├── infographic.pdf
    ├── chart-01.png
    └── model-diagram.jpg
```

---

## 🎨 HOW IT DISPLAYS ON THE PAGE

Resources appear in a dedicated section at the end of the article (or in a sidebar):

```
┌─────────────────────────────────────────────────┐
│ Additional Resources                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ 📄 Documents                                    │
│ ┌───────────────────────────────────────────┐   │
│ │ 📄 Supply Chain Infographic                │   │
│ │    Visual model of the framework           │   │
│ │    [Download PDF]                          │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ 🎥 Videos                                       │
│ ┌───────────────────────────────────────────┐   │
│ │ 🎥 5-Minute Overview                       │   │
│ │    Video explainer for this concept        │   │
│ │    [Watch on YouTube →]                    │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ 🔗 External References                          │
│ ┌───────────────────────────────────────────┐   │
│ │ 🔗 Original Research Paper                 │   │
│ │    Source document referenced in Section 3 │   │
│ │    [View Source →]                         │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

Resources are grouped by type for easy scanning.

---

## 🔢 BATCH PROCESSING

You can include additional resources in your CSV metadata file.

### CSV Format

Use the `additional_resources` column with this format:

```
type|filename/url|title|description;type|filename/url|title|description
```

**Separator**: Use `;` between resources, `|` between fields

### Example CSV Row

```csv
folder,title,...,additional_resources
article-001,Redesigning Supply Chains,...,"pdf|infographic.pdf|Supply Chain Model|Visual framework;video|https://youtube.com/watch?v=abc123|Overview Video|5-min explainer;link|https://example.org/source.pdf|Source Paper|Referenced research"
```

**Breakdown**:
1. `pdf|infographic.pdf|Supply Chain Model|Visual framework`
2. `;` (separator)
3. `video|https://youtube.com/watch?v=abc123|Overview Video|5-min explainer`
4. `;` (separator)
5. `link|https://example.org/source.pdf|Source Paper|Referenced research`

### Files Location for Batch Mode

When batch processing, put additional resource files in the article folder:

```
/articles-to-publish/
├── article-001/
│   ├── article-001.docx
│   ├── article-001.pdf
│   ├── featured-001.jpg
│   ├── infographic.pdf          ← additional resource file
│   └── chart-model.png          ← another resource file
```

System will auto-detect and move them to the `/resources/` subfolder.

---

## 💡 USE CASES

### Use Case 1: Article with Infographic
**Article**: "Redesigning Supply Chains"  
**Additional Resources**:
- 📄 Infographic PDF (visual summary)
- 🎥 YouTube video (5-min overview)

**Why**: Some readers prefer visuals; video reaches different audience

---

### Use Case 2: Research-Heavy Article
**Article**: "Moon Economic Framework"  
**Additional Resources**:
- 🔗 Link to original research paper
- 🔗 Link to NASA source data
- 📄 Appendix with detailed calculations

**Why**: Provides citations and deeper dive for interested readers

---

### Use Case 3: Presentation Companion
**Article**: "Leadership in Complex Systems"  
**Additional Resources**:
- 📊 Slide deck (PDF export of presentation)
- 🔗 Link to recorded talk
- 🖼️ Key diagrams as standalone images

**Why**: Article summarizes talk; resources provide full content

---

## 🎯 BEST PRACTICES

### Do:
✅ Keep resource titles **short and descriptive** (3-7 words)  
✅ Add **brief descriptions** (1 line explaining what it is)  
✅ Use **meaningful filenames** (`supply-chain-model.pdf` not `file123.pdf`)  
✅ Group related resources (e.g., all graphics together)  
✅ Test links before publishing (make sure YouTube URLs work)

### Don't:
❌ Don't upload **huge files** (keep PDFs under 10MB)  
❌ Don't use **generic titles** ("Document 1", "Link")  
❌ Don't add resources that **aren't directly related** to the article  
❌ Don't link to **temporary URLs** that might break later

---

## 📊 DATA STRUCTURE (For Developers)

### JSON Format

```json
{
  "additional_resources": [
    {
      "type": "pdf",
      "title": "Supply Chain Infographic",
      "description": "Visual model of the framework discussed in the article",
      "url": "/discover/articles/redesigning-supply-chains/resources/infographic.pdf",
      "filename": "infographic.pdf",
      "file_size_kb": 245
    },
    {
      "type": "video",
      "title": "5-Minute Overview on YouTube",
      "description": "Video explainer for this concept",
      "url": "https://youtube.com/watch?v=abc123",
      "external": true
    },
    {
      "type": "link",
      "title": "Original Research Paper",
      "description": "Source document referenced in Section 3",
      "url": "https://example.org/research/paper.pdf",
      "external": true
    }
  ]
}
```

---

## ✅ VALIDATION RULES

System validates resources on upload:

| Check | Rule | Error Message |
|-------|------|---------------|
| File size | Max 10MB for uploaded files | "File too large (max 10MB)" |
| File type | PDFs, images (JPG/PNG) only | "Invalid file type" |
| URL format | Must be valid http/https URL | "Invalid URL format" |
| Title | Required, max 100 chars | "Title required" |
| Description | Optional, max 200 chars | "Description too long" |

---

## 🚀 IMPLEMENTATION NOTES

**Phase 1**: Fully functional in initial build  
**Complexity**: Low (simple file upload + link storage)  
**Dev Time**: +2-3 hours  
**User Impact**: High (adds significant value)

**Technical details**:
- Store resources as array in article JSON metadata
- Copy uploaded files to `/resources/` subfolder
- Validate external URLs (check if reachable)
- Group by type in template rendering
- Track download counts per resource (optional)

---

## 📞 QUESTIONS?

**Q: How many resources can I add per article?**  
A: No hard limit, but recommend 3-7 for readability. If you have 20+ resources, consider creating a separate "Resources Hub" article.

**Q: Can I add resources to articles after publishing?**  
A: Yes! Edit the article, add resources, regenerate the page.

**Q: What if a YouTube link breaks?**  
A: System shows a warning on the admin side if external links return errors. You can update or remove broken links.

**Q: Can I reorder resources?**  
A: Yes, drag-and-drop to reorder in the admin interface.

---

**This feature makes your articles much more valuable by connecting readers to all related materials in one place!** 🎉
