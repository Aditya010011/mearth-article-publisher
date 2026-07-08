# Changelog - Version 1.1

## Release Date: 2026-07-08

### 🐛 Critical Fixes

#### 1. **Fixed Internal Server Error on /parse endpoint**
- **Issue**: David reported "Error: Internal Server Error" when clicking Parse Document
- **Root Cause**: File path resolution issues in deployed environment
- **Fix**: Updated all file paths to use `path.join(__dirname, ...)` for proper cross-platform compatibility
- **Status**: ✅ RESOLVED

#### 2. **Fixed /generate endpoint 404 error**
- **Issue**: After clicking "Generate & Export", users got 404 error
- **Root Cause**: Path resolution and directory structure issues
- **Fix**: Fixed all relative paths to use absolute paths with `__dirname`
- **Status**: ✅ RESOLVED

#### 3. **Fixed filename handling with spaces**
- **Issue**: Files like "24-08-17 PMH Project Papers - Igniting Mearth Economy V12 G.docx" caused issues
- **Root Cause**: Spaces in filenames not properly sanitized
- **Fix**: Updated multer config to replace spaces with hyphens during upload
- **Status**: ✅ RESOLVED

#### 4. **Fixed featured image upload/display**
- **Issue**: Featured images not displaying properly in generated articles
- **Root Cause**: Hard-coded .jpg extension, not preserving original file extension
- **Fix**: Now preserves original image extension (jpg, png, gif) and uses correct filename
- **Status**: ✅ RESOLVED

---

### ✨ New Features

#### 1. **Secondary Category Field**
- **Requested by**: David
- **Description**: Added optional Secondary Category selection in addition to Primary Category
- **Benefits**: Better categorization and cross-referencing of articles
- **Implementation**:
  - Added `secondary_category` field to admin form
  - Updated data schema to store secondary category
  - Articles can now be tagged with 1-2 categories

#### 2. **Editable Contact Information**
- **Requested by**: David
- **Description**: Every article can now have custom contact information
- **Default**: "Have questions about this article? Contact us at info@moonhut.org"
- **Implementation**:
  - Added `contact_info` field in admin form (optional)
  - Displays at bottom of each article in a styled info box
  - Falls back to default if not specified

#### 3. **Duplicate Content Detection**
- **Requested by**: David
- **Description**: Smart duplicate detection based on content similarity, not just title matching
- **Algorithm**: Jaccard similarity (word overlap analysis)
- **Warning Levels**:
  - **HIGH (70%+ similar)**: Red warning - very likely duplicate
  - **MEDIUM (40-70% similar)**: Yellow notice - possibly related content
  - **LOW (<40% similar)**: No warning
- **Implementation**:
  - Runs automatically when parsing Word documents
  - Shows matched article slug and similarity percentage
  - Does NOT block publishing - just warns

#### 4. **Add New Topics Dynamically**
- **Requested by**: David
- **Description**: Users can now add new topics from the admin interface without editing JSON files
- **Implementation**:
  - "+ Add New Topic" button in admin interface
  - Prompts for topic name
  - Automatically creates slug (lowercase, hyphenated)
  - Saves to `topics.json` immediately
  - New topic appears in checkbox list and is auto-selected

---

### 🔧 Technical Improvements

1. **Better Error Handling**
   - Added try-catch blocks around file loading
   - Configuration errors now show helpful messages
   - Server won't start if required data files are missing

2. **Path Resolution**
   - All paths now use `path.join(__dirname, ...)` for Windows/Linux compatibility
   - Fixed upload, output, and export directory references

3. **Helper Function Safety**
   - `countWords()` now handles null/empty input
   - `calculateReadTime()` and `createExcerpt()` use safe defaults if config not loaded
   - Added null checks throughout

4. **File Naming**
   - Spaces in filenames automatically converted to hyphens
   - Preserves original file extensions
   - Timestamp prefix prevents name collisions

---

### 📝 Data Schema Updates

**Articles now support:**
- `secondary_category` (string, optional)
- `contact_info` (string, optional)

**Config.json additions:**
- `site.contact_text` - Default contact message for all articles

---

### 🧪 Testing Recommendations

1. **Test with David's files**:
   - "24-08-17 PMH Project Papers - Igniting Mearth Economy V12 G.docx"
   - "24-08-17 PMH P...omy V12 G.pdf"
   - "Screenshot 202...-15 104809.png"

2. **Test duplicate detection**:
   - Upload same article twice
   - Upload similar articles
   - Verify warning appears

3. **Test new features**:
   - Select secondary category
   - Add custom contact info
   - Create new topic dynamically

4. **Verify fixes**:
   - Parse completes without errors
   - Generate creates article successfully
   - Featured image displays correctly
   - Export downloads ZIP file

---

### 📋 Deployment Notes

**Files Changed:**
- `server.js` - Major path fixes, new endpoints, duplicate detection
- `config.json` - Added contact_text
- `templates/admin.ejs` - New fields for secondary category, contact info, add topic button
- `templates/article.ejs` - Contact info display, fixed image handling
- `public/js/admin.js` - Duplicate warning display, new topic creation, secondary category
- `data/topics.json` - Now dynamically updatable

**No Breaking Changes** - All changes are backward compatible

---

### 👥 Credits

**Feedback & Testing**: David Goldsmith, Markus  
**Development**: Aditya  
**Version**: 1.1.0  
**Date**: July 8, 2026

---

### 🚀 What's Next?

Potential future enhancements based on feedback:
- Batch upload processing for 200+ articles
- Article editing capability (not just creation)
- Draft save functionality
- Better image optimization
- Markdown support as alternative to Word
