# Getting Started with Mearth Article Publisher

## Quick Setup (5 Minutes)

### Step 1: Install Node.js

If you don't have Node.js installed:
1. Download from https://nodejs.org/ (version 18 or higher)
2. Run the installer
3. Verify installation by opening a terminal/command prompt and typing:
   ```
   node --version
   ```
   You should see something like `v18.0.0` or higher

### Step 2: Install Dependencies

Open a terminal in the `mearth-article-publisher` folder and run:

```bash
npm install
```

This will install all required packages (~30 seconds).

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Mearth Article Publisher - Phase 1 MVP                  ║
║   Server running at: http://localhost:3000                ║
║                                                           ║
║   Ready to publish articles!                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Step 4: Open in Browser

Go to: **http://localhost:3000**

You should see the admin interface!

---

## Publishing Your First Article

### 1. Prepare Your Files

You need:
- ✅ **Word document** (.docx) - Your article content
- ✅ **PDF** (.pdf) - Same content in PDF format
- ✅ **Featured image** (JPG or PNG) - Main article image

### 2. Upload Files

1. Click "Choose File" for each file type
2. Click "Parse Document"
3. Wait 2-3 seconds while the system extracts the content

### 3. Review Content

Check:
- **Title** - Automatically extracted from first heading
- **Subtitle** - Optional secondary heading
- **Body** - HTML content (you can edit minor changes here)
- **Author** - Defaults to David Goldsmith
- **Publish Date** - Defaults to today

### 4. Tag the Article

**Required:**
- **Primary Category** - Choose 1 from dropdown (e.g., "Leadership & Coordination")

**Optional (but recommended):**
- **PMH Zones** - Select 1-3 relevant zones (e.g., "Strategy", "Infrastructure")
- **MegaChallenges** - Check any that apply (interconnected, no ranking)
- **Topics** - Select 2-5 tags (e.g., "Supply Chain", "Resilience")
- **Entities** - Check related organizations (e.g., "MearthLink")

### 5. Add Additional Resources (Optional)

Click **"+ Add Resource"** to attach:
- Extra PDFs (supplementary documents)
- Images/Graphics (infographics, diagrams)
- Video Links (YouTube, Vimeo)
- External References (website links)

For each resource:
1. Select **Type** (PDF, Image, Video, Link)
2. Enter **Title** (e.g., "Supply Chain Infographic")
3. Add **Description** (optional)
4. Upload file OR enter URL

### 6. Generate Article

1. Click **"Preview"** (optional) - See what the page will look like
2. Click **"✓ Generate & Export"**
3. Wait 2-3 seconds
4. Success message will appear!

Your article is now in the export package.

### 7. Export All Articles

1. Click **"📦 Export All for Upload"** at the top
2. A ZIP file will download
3. Extract the ZIP
4. Send to your web administrator (Markus) for upload

The ZIP contains:
```
discover/
  articles/
    your-article-slug/
      index.html
      your-article-slug.pdf
      featured-image.jpg
      resources/ (if you added any)
  assets/
    data/
      articles.json
```

---

## Tips & Tricks

### Word Document Formatting

✅ **Do:**
- Use Heading 1 for the title
- Use Heading 2 for subtitle
- Use regular headings (H2, H3) for sections
- Keep formatting simple (bold, italic, lists)

❌ **Don't:**
- Use complex tables (they may not convert well)
- Embed videos or animations
- Use custom fonts (they won't transfer)

### HTML Editing

The **Body** textarea shows raw HTML. You can:
- Fix typos directly in the HTML
- Adjust heading levels (`<h2>`, `<h3>`)
- Add links: `<a href="...">text</a>`

**⚠️ For major changes:** Edit the Word document and re-upload.

### Tagging Strategy

**Primary Category:** The main focus of the article
- Leadership content → "Leadership & Coordination"
- Technical content → "Technology & Engineering"
- Business content → "Economic Models"

**PMH Zones:** Where does this fit in the Mearth classification?
- Zone 1-5: Early planning/strategy
- Zone 6-10: Implementation
- Zone 11-15: Long-term operations

**Topics:** Specific keywords for search
- Use 2-5 topics per article
- Pick the most relevant

### Common Issues

**"Document won't parse"**
- Make sure it's `.docx` (not `.doc`)
- Try opening in Word and saving again
- Check that file size is under 50MB

**"Export failed"**
- Make sure at least one article has been generated
- Check that you have disk space
- Try restarting the server

**"Server won't start"**
- Port 3000 might be in use
- Try closing other applications
- Check that Node.js is installed

---

## Next Steps

### For 200+ Article Backlog

See `BATCH_PROCESSING.md` for instructions on:
- CSV bulk upload
- Processing multiple articles at once
- Automation scripts

### Customization

Edit `config.json` to change:
- Site name and branding
- Colors and styling
- Default settings
- Export paths

### Need Help?

- 📧 Email: info@moonhut.org
- 📖 Full documentation: `Phase1_MVP_Specification.md`
- 🐛 Issues: Document any bugs or problems

---

## Development Mode

For development with auto-restart:

```bash
npm run dev
```

This uses `nodemon` to restart the server when files change.

---

**Ready to publish!** 🚀
