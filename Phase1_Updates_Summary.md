# PHASE 1 MVP - UPDATES SUMMARY v1.1

**Date**: 2026-05-19  
**Based on**: David's feedback on V02 specification

---

## ✅ CHANGES IMPLEMENTED

### 1. **MegaChallenges - No Numerical Ranking**

**Old approach**: Treated as numbered sequence (1-6)  
**New approach**: Named entities with no implied order

**The 6 MegaChallenges** (interconnected, simultaneous):
- Climate Change
- Mass Extinction
- Ecosystems Collapses
- Displacement
- Unrest
- Explosive Impact

**Implementation**:
- Interface shows checkboxes with names (not numbers)
- Data stored by name/slug (e.g., "climate-change")
- JSON structure emphasizes they're interconnected
- Clear note added: "No numerical order or ranking implied"

**Files updated**:
- ✅ `Phase1_MVP_Specification.md` (Section D of tagging interface)
- ✅ Created `data-files/mega-challenges.json` (ready to use)

---

### 2. **Editing Interface - Plain Textarea (Safer)**

**Decision**: Use **plain textarea** for Phase 1 instead of rich editor

**Reasoning**:
- ✅ No formatting corruption risk
- ✅ Simpler implementation
- ✅ Extracted HTML from Word is already clean
- ✅ Fewer dependencies
- ✅ Faster to build and test

**User Experience**:
- Textarea shows clean HTML from Word parsing
- You can make minor edits directly (fix typos, adjust headings)
- For major edits, go back to source Word document

**Phase 2 option**: Add rich editor if needed once workflow is proven

**Files updated**:
- ✅ `Phase1_MVP_Specification.md` (Section A of tagging interface)

---

### 3. **Output Path Structure - Configurable**

**Live path structure** (confirmed with Markus):
```
/discover/articles/{slug}/
  ├── index.html
  ├── {slug}.pdf
  └── featured-image.jpg
```

**Implementation**:
- All paths defined in `config.json` (no hardcoding)
- Markus can adjust base path without touching code
- Export package matches your live site structure

**Example paths**:
- Article page: `/discover/articles/redesigning-supply-chains/index.html`
- Directory: `/discover/articles-index/index.html`
- PDF: `/discover/articles/redesigning-supply-chains/redesigning-supply-chains.pdf`

**Files updated**:
- ✅ `Phase1_MVP_Specification.md` (Output structure sections)
- ✅ Created `data-files/config.json` (fully configurable)

---

### 4. **Author Structure - David Goldsmith as Default**

**Default author**: David Goldsmith (pre-configured)

**System capabilities**:
- ✅ Author dropdown defaults to "David Goldsmith"
- ✅ "Add New Author" button for future contributors
- ✅ Simple form to add authors (name, title, bio, social links)
- ✅ Author profile pages auto-generated
- ✅ No restructuring needed when adding authors

**Author data structure** (ready to use):
```json
{
  "id": "david-goldsmith",
  "full_name": "David Goldsmith",
  "title": "Founder",
  "organization": "Project Moon Hut Foundation / Mearth",
  "bio": "Author of Paid to THINK, strategist, and founder...",
  "is_default": true
}
```

**Files updated**:
- ✅ `Phase1_MVP_Specification.md` (Author database section)
- ✅ Created `data-files/authors.json` (David pre-configured)

---

### 5. **Branding Flexibility - Mearth.com Focus**

**Primary branding**: Mearth (not Project Moon Hut)

**Configurable elements**:
- Site name: "Mearth"
- Domain: mearth.com (or projectmoonhut.org as fallback)
- Logo, colors, tagline
- Contact email
- Social handles

**Implementation**:
- All branding in `config.json` (one place to edit)
- Templates use variables: `{{site_name}}`, `{{site_url}}`
- Easy to switch contexts without code changes

**Example config**:
```json
{
  "site": {
    "name": "Mearth",
    "url": "https://mearth.com",
    "tagline": "Exploring the Earth-Moon Economic Ecosystem"
  }
}
```

**Files updated**:
- ✅ `Phase1_MVP_Specification.md` (Multiple sections)
- ✅ Created `data-files/config.json` (all branding settings)
- ✅ Renamed from "pmh-article-publisher" to "mearth-article-publisher"

---

### 6. **Operational Workflow - Confirmed**

**Confirmed workflow**:
```
Local/Workbench → Generate Content → Export Package → Markus Uploads → Live Site
```

**No changes needed** - Phase 1 spec already matched this workflow perfectly!

---

## 📁 NEW FILES CREATED

### `data-files/` folder (ready to use in system)

1. **`mega-challenges.json`**
   - All 6 MegaChallenges with names, slugs, descriptions
   - Clear metadata note about interconnection
   - Ready to import into system

2. **`authors.json`**
   - David Goldsmith pre-configured as default
   - All fields populated (name, title, bio, links)
   - Structure supports adding more authors

3. **`config.json`**
   - Complete site configuration
   - Branding (Mearth-focused)
   - Paths (configurable for Markus)
   - Defaults (David as author, etc.)
   - Feature flags (PDF downloads, etc.)
   - Export settings

**Usage**: These JSON files can be copied directly into the system's `/data/` folder when development starts.

---

## 📊 WHAT'S DIFFERENT FROM V02

| Element | V02 | V1.1 (This Update) |
|---------|-----|-------------------|
| MegaChallenges | Numbered 1-6 | **Named (no ranking)** |
| Editor | Rich text editor option | **Plain textarea (safer)** |
| Paths | Generic `/articles/` | **`/discover/articles/` (configurable)** |
| Author | Generic examples | **David Goldsmith pre-configured** |
| Branding | "PMH Article Publisher" | **"Mearth" with full config** |
| Config | Scattered in code | **Centralized in config.json** |

---

## ✅ CONFIRMATION CHECKLIST

Based on your feedback, confirm these are aligned:

- [✓] MegaChallenges are named entities (no 1-6 ranking)
- [✓] Plain textarea for editing (no rich editor corruption risk)
- [✓] Output path `/discover/articles/{slug}/` (configurable by Markus)
- [✓] David Goldsmith as default author (add others later)
- [✓] Mearth.com branding (not PMH)
- [✓] Local generation → export → Markus upload workflow

---

## 🚀 NEXT STEPS

### If This Update is Approved:

1. **Answer Remaining Open Questions** (from original Phase 1 spec, page 27):
   - Topics list: Do you have a controlled list, or should we extract from existing articles?
   - File naming: Are article files already consistently named?
   - Featured images: Do all 200 articles have images, or need default/placeholder?
   - PDF availability: Do all articles have matching PDFs?
   - Author photos: Do you have a headshot of David we can use?
   - Existing site design: Should we match current mearth.com/projectmoonhut.org design? (Need CSS or screenshot)

2. **Gather Sample Files** (to test the system):
   - 3 representative articles (Word + PDF + featured image)
   - Author info/photo for David
   - Screenshot of current website for design consistency

3. **Kick Off Development** (Week 1):
   - Set up project structure
   - Implement Word/PDF parsing
   - Build admin interface
   - Test with 1 article

4. **Timeline Remains**:
   - Week 1: Core system + 1 article test
   - Week 2: Features + 10 articles test
   - Week 3: Process all 200 articles
   - Week 4: Deploy & monitor

---

## 💰 COST & TIMELINE (Unchanged)

- **Development**: ~$4,000
- **Timeline**: 4 weeks to 200 articles live
- **Ongoing**: $0/month (static hosting)

---

## 📝 DOCUMENTS STATUS

### Updated:
- ✅ `Phase1_MVP_Specification.md` (v1.1 - all changes integrated)

### Created:
- ✅ `Phase1_Updates_Summary.md` (this document)
- ✅ `data-files/mega-challenges.json`
- ✅ `data-files/authors.json`
- ✅ `data-files/config.json`

### Unchanged (still relevant):
- ✅ `PMH_Content_Engine_Document_Plan.md` (long-term vision)
- ✅ `classification_system_indetail.md` (reference)
- ✅ `PMH.md` (requirements)
- ✅ `audio_instruction.txt` (original context)

---

**Great job on the feedback, David! This V1.1 is much more practical and aligned with your immediate needs. Ready to proceed?** 🚀
