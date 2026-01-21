import RTE from '../rte-package/src/index.js';

const editor = new RTE('editor-container', {
    toolbar: [
        // Clipboard Actions Group
        {
            group: 'clipboard',
            items: [
                { type: 'button', label: 'Undo', command: 'undo', icon: '<i class="fas fa-undo"></i>' },
                { type: 'button', label: 'Redo', command: 'redo', icon: '<i class="fas fa-redo"></i>' },
                { type: 'button', label: 'Cut', command: 'cut', icon: '<i class="fas fa-cut"></i>' },
                { type: 'button', label: 'Copy', command: 'copy', icon: '<i class="fas fa-copy"></i>' },
                { type: 'button', label: 'Paste', command: 'paste', icon: '<i class="fas fa-paste"></i>' }
            ]
        },
        
        // Text Formatting Group
        {
            group: 'formatting',
            items: [
                { type: 'button', label: 'Bold', command: 'bold', icon: '<i class="fas fa-bold"></i>' },
                { type: 'button', label: 'Italic', command: 'italic', icon: '<i class="fas fa-italic"></i>' },
                { type: 'button', label: 'Underline', command: 'underline', icon: '<i class="fas fa-underline"></i>' },
                { type: 'button', label: 'Strikethrough', command: 'strikeThrough', icon: '<i class="fas fa-strikethrough"></i>' },
                { type: 'button', label: 'Superscript', command: 'superscript', icon: '<i class="fas fa-superscript"></i>' },
                { type: 'button', label: 'Subscript', command: 'subscript', icon: '<i class="fas fa-subscript"></i>' },
                { type: 'button', label: 'Code', command: 'code', icon: '<i class="fas fa-code"></i>' },
                { type: 'button', label: 'Clear Format', command: 'clearFormatting', icon: '<i class="fas fa-eraser"></i>' }
            ]
        },
        
        // Paragraph & List Formatting Group
        {
            group: 'paragraph',
            items: [
                {
                    type: 'select',
                    label: 'Paragraph',
                    command: 'formatBlock',
                    icon: '<i class="fas fa-heading"></i>',
                    options: [
                        { label: 'Paragraph', value: 'p' },
                        { label: 'Heading 1', value: 'h1' },
                        { label: 'Heading 2', value: 'h2' },
                        { label: 'Heading 3', value: 'h3' },
                        { label: 'Heading 4', value: 'h4' },
                        { label: 'Heading 5', value: 'h5' },
                        { label: 'Heading 6', value: 'h6' }
                    ]
                },
                { type: 'button', label: 'Bulleted List', command: 'insertUnorderedList', icon: '<i class="fas fa-list-ul"></i>' },
                { type: 'button', label: 'Numbered List', command: 'insertOrderedList', icon: '<i class="fas fa-list-ol"></i>' },
                { type: 'button', label: 'Block Quote', command: 'insertBlockquote', icon: '<i class="fas fa-quote-left"></i>' }
            ]
        },
        
        // Alignment & Indentation Group
        {
            group: 'alignment',
            items: [
                { type: 'button', label: 'Align Left', command: 'alignLeft', icon: '<i class="fas fa-align-left"></i>' },
                { type: 'button', label: 'Align Center', command: 'alignCenter', icon: '<i class="fas fa-align-center"></i>' },
                { type: 'button', label: 'Align Right', command: 'alignRight', icon: '<i class="fas fa-align-right"></i>' },
                { type: 'button', label: 'Justify', command: 'alignJustify', icon: '<i class="fas fa-align-justify"></i>' },
                { type: 'button', label: 'Increase Indent', command: 'indent', icon: '<i class="fas fa-indent"></i>' },
                { type: 'button', label: 'Decrease Indent', command: 'outdent', icon: '<i class="fas fa-outdent"></i>' }
            ]
        },
        
        // Insert Elements Group
        {
            group: 'insert',
            items: [
                { type: 'button', label: 'Link', command: 'createLink', icon: '<i class="fas fa-link"></i>' },
                { type: 'button', label: 'Image', command: 'insertImage', icon: '<i class="fas fa-image"></i>' },
                { type: 'button', label: 'Audio', command: 'insertAudio', icon: '<i class="fas fa-volume-up"></i>' },
                { type: 'button', label: 'Video', command: 'insertVideo', icon: '<i class="fas fa-video"></i>' },
                { type: 'button', label: 'Table', command: 'insertTable', icon: '<i class="fas fa-table"></i>' },
                { type: 'button', label: 'Emoji', command: 'insertEmoji', icon: '<i class="fas fa-grin"></i>' },
                { type: 'button', label: 'Horizontal Line', command: 'insertHorizontalRule', icon: '<i class="fas fa-minus"></i>' }
            ]
        },
        
        // Font & Style Group
        {
            group: 'typography',
            items: [
                {
                    type: 'select',
                    label: 'Font',
                    command: 'fontName',
                    icon: '<i class="fas fa-font"></i>',
                    options: [
                        { label: 'Arial', value: 'Arial' },
                        { label: 'Verdana', value: 'Verdana' },
                        { label: 'Georgia', value: 'Georgia' },
                        { label: 'Times New Roman', value: 'Times New Roman' },
                        { label: 'Courier New', value: 'Courier New' },
                        { label: 'Trebuchet MS', value: 'Trebuchet MS' }
                    ]
                },
                {
                    type: 'select',
                    label: 'Size',
                    command: 'fontSize',
                    icon: '<i class="fas fa-text-height"></i>',
                    options: [
                        { label: 'Small', value: '12px' },
                        { label: 'Normal', value: '16px' },
                        { label: 'Large', value: '18px' },
                        { label: 'XL', value: '24px' },
                        { label: '2XL', value: '32px' }
                    ]
                },
                { type: 'color', label: 'Text Color', command: 'foreColor', icon: '<i class="fas fa-palette"></i>' },
                { type: 'color', label: 'Highlight', command: 'backColor', icon: '<i class="fas fa-highlighter"></i>' }
            ]
        },
        
        // Text Case & Code Group
        {
            group: 'transform',
            items: [
                { type: 'button', label: 'Uppercase', command: 'uppercase', icon: '<i class="fas fa-arrow-up"></i>' },
                { type: 'button', label: 'Lowercase', command: 'lowercase', icon: '<i class="fas fa-arrow-down"></i>' },
                { type: 'button', label: 'Code Block', command: 'insertCodeBlock', icon: '<i class="fas fa-code"></i>' }
            ]
        },
        
        // View Options Group
        {
            group: 'view',
            items: [
                { type: 'button', label: 'Source Code', command: 'toggleSource', icon: '<i class="fas fa-file-code"></i>' },
                { type: 'button', label: 'Fullscreen', command: 'toggleFullscreen', icon: '<i class="fas fa-expand"></i>' }
            ]
        }
    ]
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

// Load sample on startup
editor.setContent(sampleContent);
