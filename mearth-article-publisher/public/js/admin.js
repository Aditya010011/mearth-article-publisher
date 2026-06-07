// Admin interface JavaScript

let uploadedFiles = {};
let resourceCounter = 0;

// Handle document upload and parsing
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const statusDiv = document.getElementById('parseStatus');
  
  statusDiv.innerHTML = '<div class="text-blue-600">Parsing document...</div>';
  statusDiv.classList.remove('hidden');
  
  try {
    const response = await fetch('/parse', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Populate form fields
      document.getElementById('title').value = result.data.title;
      document.getElementById('subtitle').value = result.data.subtitle || '';
      document.getElementById('body').value = result.data.body;
      document.getElementById('wordCount').textContent = result.data.wordCount;
      document.getElementById('readTime').textContent = Math.ceil(result.data.wordCount / 200);
      
      // Store uploaded files
      uploadedFiles = result.data.files;
      
      // Show editor section
      document.getElementById('editorSection').classList.remove('hidden');
      
      statusDiv.innerHTML = '<div class="text-green-600">✓ Document parsed successfully! Review and edit below.</div>';
      
      // Scroll to editor
      document.getElementById('editorSection').scrollIntoView({ behavior: 'smooth' });
      
    } else {
      statusDiv.innerHTML = `<div class="text-red-600">Error: ${result.error}</div>`;
    }
  } catch (error) {
    statusDiv.innerHTML = `<div class="text-red-600">Error: ${error.message}</div>`;
  }
});

// Update word count and read time on body change
document.getElementById('body').addEventListener('input', (e) => {
  const text = e.target.value.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  document.getElementById('wordCount').textContent = wordCount;
  document.getElementById('readTime').textContent = Math.ceil(wordCount / 200);
});

// Add resource functionality
function addResource() {
  resourceCounter++;
  const container = document.getElementById('resourcesContainer');
  
  const resourceHtml = `
    <div class="resource-item" id="resource-${resourceCounter}">
      <div class="flex justify-between mb-2">
        <h4 class="font-semibold">Resource ${resourceCounter}</h4>
        <button type="button" onclick="removeResource(${resourceCounter})" class="text-red-600 hover:text-red-800">
          Remove
        </button>
      </div>
      
      <div class="grid grid-cols-1 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select class="resource-type w-full border rounded p-2" onchange="toggleResourceInput(${resourceCounter})">
            <option value="pdf">📄 PDF Document</option>
            <option value="image">🖼️ Image/Graphic</option>
            <option value="video">🎥 Video Link</option>
            <option value="link">🔗 External Link</option>
            <option value="presentation">📊 Presentation/Deck</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" class="resource-title w-full border rounded p-2" placeholder="e.g., Supply Chain Infographic" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <input type="text" class="resource-description w-full border rounded p-2" placeholder="Brief explanation">
        </div>
        
        <div class="resource-file-input">
          <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
          <input type="file" class="resource-file w-full border rounded p-2">
        </div>
        
        <div class="resource-url-input hidden">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input type="url" class="resource-url w-full border rounded p-2" placeholder="https://...">
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', resourceHtml);
}

function removeResource(id) {
  const element = document.getElementById(`resource-${id}`);
  if (element) {
    element.remove();
  }
}

function toggleResourceInput(id) {
  const container = document.getElementById(`resource-${id}`);
  const type = container.querySelector('.resource-type').value;
  const fileInput = container.querySelector('.resource-file-input');
  const urlInput = container.querySelector('.resource-url-input');
  
  if (type === 'video' || type === 'link') {
    fileInput.classList.add('hidden');
    urlInput.classList.remove('hidden');
  } else {
    fileInput.classList.remove('hidden');
    urlInput.classList.add('hidden');
  }
}

// Handle article generation
document.getElementById('articleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const statusDiv = document.getElementById('generateStatus');
  statusDiv.innerHTML = '<div class="text-blue-600">Generating article...</div>';
  
  try {
    // Collect form data
    const articleData = {
      title: document.getElementById('title').value,
      subtitle: document.getElementById('subtitle').value,
      body: document.getElementById('body').value,
      author_id: document.getElementById('author_id').value,
      publish_date: document.getElementById('publish_date').value,
      wordCount: parseInt(document.getElementById('wordCount').textContent),
      primary_category: document.getElementById('primary_category').value,
      pmh_zones: Array.from(document.querySelectorAll('input[name="pmh_zones"]:checked')).map(cb => cb.value),
      mega_challenges: Array.from(document.querySelectorAll('input[name="mega_challenges"]:checked')).map(cb => cb.value),
      topics: Array.from(document.querySelectorAll('input[name="topics"]:checked')).map(cb => cb.value),
      entities: Array.from(document.querySelectorAll('input[name="entities"]:checked')).map(cb => cb.value),
      meta_description: document.getElementById('meta_description').value,
      files: uploadedFiles,
      additional_resources: collectAdditionalResources()
    };
    
    // Create FormData with resources
    const formData = new FormData();
    formData.append('articleData', JSON.stringify(articleData));

    // Append resource files
    document.querySelectorAll('.resource-item').forEach((item, index) => {
      const fileInput = item.querySelector('.resource-file');
      if (fileInput && fileInput.files[0]) {
        formData.append('additional_resources', fileInput.files[0]);
      }
    });

    // Send to server
    const response = await fetch('/generate', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      statusDiv.innerHTML = `
        <div class="text-green-600">
          <p class="font-bold">✓ Article generated successfully!</p>
          <p class="mt-2">Slug: <code class="bg-gray-100 px-2 py-1 rounded">${result.slug}</code></p>
          <p class="mt-2">The article has been added to the export package.</p>
          <div class="mt-4">
            <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Another Article
            </button>
            <button onclick="exportArticles()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2">
              Export All Articles
            </button>
          </div>
        </div>
      `;
    } else {
      statusDiv.innerHTML = `<div class="text-red-600">Error: ${result.error}</div>`;
    }

  } catch (error) {
    statusDiv.innerHTML = `<div class="text-red-600">Error: ${error.message}</div>`;
  }
});

function collectAdditionalResources() {
  // Implementation to collect resource data
  const resources = [];
  document.querySelectorAll('.resource-item').forEach(item => {
    const type = item.querySelector('.resource-type').value;
    resources.push({
      type: (type === 'video' || type === 'link') ? 'link' : 'file',
      file_type: type,
      link_type: type,
      title: item.querySelector('.resource-title').value,
      description: item.querySelector('.resource-description').value,
      url: item.querySelector('.resource-url')?.value || ''
    });
  });
  return resources;
}

function exportArticles() {
  window.location.href = '/export';
}

function viewArticles() {
  window.open('/api/articles', '_blank');
}

function previewArticle() {
  // Collect article data
  const articleData = {
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
    body: document.getElementById('body').value,
    author_id: document.getElementById('author_id').value,
    publish_date: document.getElementById('publish_date').value,
    wordCount: parseInt(document.getElementById('wordCount').textContent),
    primary_category: document.getElementById('primary_category').value,
    pmh_zones: Array.from(document.querySelectorAll('input[name="pmh_zones"]:checked')).map(cb => cb.value),
    mega_challenges: Array.from(document.querySelectorAll('input[name="mega_challenges"]:checked')).map(cb => cb.value),
    topics: Array.from(document.querySelectorAll('input[name="topics"]:checked')).map(cb => cb.value),
    entities: Array.from(document.querySelectorAll('input[name="entities"]:checked')).map(cb => cb.value)
  };

  // Open preview in new window
  const previewWindow = window.open('', 'Article Preview', 'width=1000,height=800,scrollbars=yes');

  // Create preview HTML
  const previewHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview: ${articleData.title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p class="font-bold">⚠️ Preview Mode</p>
          <p class="text-sm">This is a preview. Close this window to return to editing.</p>
        </div>

        <article class="bg-white rounded-lg shadow-md p-8">
          <div class="mb-4">
            <span class="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white">
              ${articleData.primary_category || 'No Category'}
            </span>
          </div>

          <h1 class="text-4xl font-bold text-gray-900 mb-4">${articleData.title || 'Untitled'}</h1>
          ${articleData.subtitle ? `<h2 class="text-2xl text-gray-700 mb-6">${articleData.subtitle}</h2>` : ''}

          <div class="flex items-center gap-4 py-4 border-y border-gray-200 mb-6">
            <div class="flex-1">
              <p class="font-semibold text-gray-900">Author: ${articleData.author_id || 'Unknown'}</p>
              <p class="text-sm text-gray-600">
                ${new Date(articleData.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ·
                ${Math.ceil(articleData.wordCount / 200)} min read ·
                ${articleData.wordCount.toLocaleString()} words
              </p>
            </div>
          </div>

          <div class="prose prose-lg max-w-none mb-8">
            ${articleData.body}
          </div>

          ${articleData.pmh_zones.length > 0 || articleData.mega_challenges.length > 0 || articleData.topics.length > 0 || articleData.entities.length > 0 ? `
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Tags</h3>

            ${articleData.pmh_zones.length > 0 ? `
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">PMH Zones:</p>
              <div class="flex flex-wrap gap-2">
                ${articleData.pmh_zones.map(zone => `<span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">${zone}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${articleData.mega_challenges.length > 0 ? `
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">MegaChallenges:</p>
              <div class="flex flex-wrap gap-2">
                ${articleData.mega_challenges.map(mc => `<span class="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">${mc}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${articleData.topics.length > 0 ? `
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">Topics:</p>
              <div class="flex flex-wrap gap-2">
                ${articleData.topics.map(topic => `<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">#${topic}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${articleData.entities.length > 0 ? `
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">Entities:</p>
              <div class="flex flex-wrap gap-2">
                ${articleData.entities.map(entity => `<span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">${entity}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
          ` : ''}
        </article>
      </div>

      <style>
        .prose p { margin-bottom: 1.25rem; font-size: 1.125rem; }
        .prose h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .prose h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .prose ul, .prose ol { margin-bottom: 1.25rem; padding-left: 1.625rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose a { color: #2563eb; text-decoration: underline; }
        .prose strong { font-weight: 600; }
        .prose em { font-style: italic; }
      </style>
    </body>
    </html>
  `;

  previewWindow.document.write(previewHTML);
  previewWindow.document.close();
}
