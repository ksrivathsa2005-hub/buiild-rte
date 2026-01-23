import RTE from '../rte-package/src/index.js';

const editor = new RTE('editor-container', {
    // Defaults will be used automatically
});

// Load sample content
const sampleContent = `
<h1>Welcome to RTE Demo</h1>
<p>This is a <strong>feature-rich</strong> Rich Text Editor built with vanilla JavaScript.</p>
<h2>Key Features</h2>
<ul>
    <li>Full formatting support (Bold, Italic, Underline)</li>
    <li>Headings and paragraph styles</li>
    <li>Lists and indentation</li>
    <li>Media insertion (Images, Audio, Video)</li>
    <li>Link and table support</li>
    <li>Source code editing</li>
    <li>Sanitized output for security</li>
</ul>
<p><em>Try editing this content and click "Get Sanitized HTML" to see the clean output!</em></p>
`;

document.getElementById('get-content-btn').addEventListener('click', () => {
    const content = editor.getContent();
    document.getElementById('output-view').classList.add('active');
    document.getElementById('output-code').textContent = content;
    console.log('Content:', content);
});

document.getElementById('clear-btn').addEventListener('click', async () => {
    const confirmed = await editor.modal.confirm('Clear Content', 'Are you sure you want to clear all contents? This cannot be undone.');
    if (confirmed) {
        editor.clearContent();
        document.getElementById('output-view').classList.remove('active');
    }
});

document.getElementById('load-sample-btn').addEventListener('click', () => {
    editor.setContent(sampleContent);
});

// Parsing demo handlers
document.getElementById('load-json-btn').addEventListener('click', () => {
    document.getElementById('json-file-input').click();
});

document.getElementById('json-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                // If JSON has content/html property, use it; otherwise format JSON as readable HTML
                if (json.content || json.html) {
                    window.contentManager.loadFromJSON(json);
                } else {
                    // Format JSON as readable HTML for display
                    const formattedHtml = `<h2>JSON Content</h2><pre style="background:#f5f5f5;padding:1rem;border-radius:4px;overflow-x:auto;">${JSON.stringify(json, null, 2)}</pre>`;
                    editor.setContent(formattedHtml);
                }
            } catch (err) {
                alert('Invalid JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
    }
    e.target.value = '';
});

document.getElementById('load-html-btn').addEventListener('click', () => {
    document.getElementById('html-file-input').click();
});

document.getElementById('html-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Set the HTML content directly
            editor.setContent(event.target.result);
            console.log('Loaded HTML file');
        };
        reader.readAsText(file);
    }
    e.target.value = '';
});

// Content Source Management - Support for different content sources
window.contentManager = {
    // Load from static HTML
    loadFromHTML(html) {
        editor.loadFromHTML(html);
        console.log('Loaded from HTML');
    },

    // Load from JSON
    loadFromJSON(jsonData) {
        editor.loadFromJSON(jsonData);
        console.log('Loaded from JSON:', jsonData);
    },

    // Load from API endpoint
    async loadFromAPI(url) {
        try {
            await editor.loadFromAPI(url);
            console.log('Loaded from API:', url);
        } catch (error) {
            console.error('API loading error:', error);
            alert('Failed to load from API: ' + error.message);
        }
    },

    // Save to API endpoint
    async saveToAPI(url) {
        try {
            const result = await editor.saveToAPI(url);
            console.log('Saved to API:', result);
            alert('Content saved successfully!');
        } catch (error) {
            console.error('API save error:', error);
            alert('Failed to save to API: ' + error.message);
        }
    },

    // Export in different formats
    exportContent(format) {
        const exported = editor.export(format);
        const link = document.createElement('a');
        const blob = new Blob([exported], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);

        const filename = `document.${format === 'markdown' ? 'md' : format === 'rtf' ? 'rtf' : format === 'text' ? 'txt' : 'html'}`;
        link.download = filename;
        link.click();

        console.log(`Exported as ${format}:`, exported);
    }
};

// Example: Load sample JSON data
const sampleJSON = {
    content: `<h1>Loaded from JSON</h1><p>This content was loaded from a JSON object.</p>`,
    metadata: { author: 'Demo', timestamp: new Date().toISOString() }
};

// Example: Load from mock database/API
async function loadFromDatabase() {
    // Simulating database fetch
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                content: `<h1>Loaded from Database</h1><p>This content was fetched from a mock database.</p>`,
                id: 'doc-001',
                updated: new Date().toISOString()
            });
        }, 1000);
    });
}

// Load sample on startup if no content exists (persisted)
if (!editor.getContent()) {
    editor.setContent(sampleContent);
}