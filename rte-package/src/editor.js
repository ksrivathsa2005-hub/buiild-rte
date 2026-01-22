import { createToolbar } from './toolbar.js';
import { sanitizeHTML } from './utils/sanitizer.js';
import { CommandHandler } from './commands/handler.js';
import { StateManager } from './state/manager.js';
import { ModalManager } from './components/modal-manager.js';
import { DraggableImage } from './components/draggable-image.js';
import { QuickToolbar } from './components/quick-toolbar.js';

export class RTE {
  constructor(containerId, config = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.config = this._mergeConfig(config);
    this.editor = null;
    this.sourceView = null;
    this.toolbar = null;
    this.isSourceMode = false;
    this.isFullscreen = false;
    this.modal = new ModalManager(this);
    this.commandHandler = new CommandHandler(this);
    this.stateManager = new StateManager(this);
    this.sanitizer = sanitizeHTML;
    this._init();
  }

  _mergeConfig(userConfig) {
    const defaultConfig = {
      toolbar: [
        {
          group: 'clipboard',
          items: [
            { type: 'button', label: 'Undo', command: 'undo', icon: '⟲' },
            { type: 'button', label: 'Redo', command: 'redo', icon: '⟳' },
            { type: 'button', label: 'Cut', command: 'cut', icon: '✂' },
            { type: 'button', label: 'Copy', command: 'copy', icon: '📋' },
            { type: 'button', label: 'Paste', command: 'paste', icon: '📌' },
            { type: 'button', label: 'Paste as Text', command: 'pasteAsPlainText', icon: 'TXT' }
          ]
        },
        {
          group: 'formatting',
          items: [
            { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
            { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' },
            { type: 'button', label: 'Underline', command: 'underline', icon: '<u>U</u>' },
            { type: 'button', label: 'Strikethrough', command: 'strikeThrough', icon: '<s>S</s>' },
            { type: 'button', label: 'Superscript', command: 'superscript', icon: 'ˢᵘᵖ' },
            { type: 'button', label: 'Subscript', command: 'subscript', icon: 'ₛᵤᵦ' },
            { type: 'button', label: 'Code', command: 'code', icon: '</>' },
            { type: 'button', label: 'Clear Formatting', command: 'clearFormatting', icon: '⊘' }
          ]
        },
        {
          group: 'textCase',
          items: [
            { type: 'button', label: 'UPPERCASE', command: 'uppercase', icon: 'A' },
            { type: 'button', label: 'lowercase', command: 'lowercase', icon: 'a' },
            { type: 'button', label: 'Sentence case', command: 'sentenceCase', icon: 'Aa' }
          ]
        },
        {
          group: 'paragraph',
          items: [
            {
              type: 'select',
              label: 'Heading',
              command: 'formatBlock',
              options: [
                { label: 'Paragraph', value: 'p' },
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' }
              ]
            },
            { type: 'button', label: 'Bullet List', command: 'insertUnorderedList', icon: '•' },
            { type: 'button', label: 'Numbered List', command: 'insertOrderedList', icon: '1.' },
            { type: 'button', label: 'Blockquote', command: 'insertBlockquote', icon: '❝' },
            { type: 'button', label: 'HR', command: 'insertHorizontalRule', icon: '─' }
          ]
        },
        {
          group: 'alignment',
          items: [
            { type: 'button', label: 'Align Left', command: 'alignLeft', icon: '⊣' },
            { type: 'button', label: 'Align Center', command: 'alignCenter', icon: '⊤' },
            { type: 'button', label: 'Align Right', command: 'alignRight', icon: '⊢' },
            { type: 'button', label: 'Justify', command: 'alignJustify', icon: '⊥' }
          ]
        },
        {
          group: 'indent',
          items: [
            { type: 'button', label: 'Decrease Indent', command: 'outdent', icon: '«' },
            { type: 'button', label: 'Increase Indent', command: 'indent', icon: '»' }
          ]
        },
        {
          group: 'insert',
          items: [
            { type: 'button', label: 'Link', command: 'createLink', icon: '🔗' },
            { type: 'button', label: 'Unlink', command: 'unlink', icon: '⛔' },
            { type: 'button', label: 'Image', command: 'insertImage', icon: '🖼' },
            { type: 'button', label: 'Audio', command: 'insertAudio', icon: '🔊' },
            { type: 'button', label: 'Video', command: 'insertVideo', icon: '🎬' },
            { type: 'button', label: 'Table', command: 'insertTable', icon: '▦' },
            { type: 'button', label: 'Code Block', command: 'insertCodeBlock', icon: '{}' },
            { type: 'button', label: 'Emoji', command: 'insertEmoji', icon: '😊' },
            { type: 'button', label: 'Special Char', command: 'insertSpecialChar', icon: '§' }
          ]
        },
        {
          group: 'typography',
          items: [
            {
              type: 'select',
              label: 'Font',
              command: 'fontName',
              options: [
                { label: 'Segoe UI', value: 'Segoe UI' },
                { label: 'Arial', value: 'Arial' },
                { label: 'Verdana', value: 'Verdana' },
                { label: 'Georgia', value: 'Georgia' },
                { label: 'Times New Roman', value: 'Times New Roman' },
                { label: 'Courier New', value: 'Courier New' },
                { label: 'Trebuchet MS', value: 'Trebuchet MS' },
                { label: 'Comic Sans MS', value: 'Comic Sans MS' },
                { label: 'Impact', value: 'Impact' }
              ]
            },
            {
              type: 'select',
              label: 'Size',
              command: 'fontSize',
              options: [
                { label: '8 pt', value: '1' },
                { label: '10 pt', value: '2' },
                { label: '12 pt', value: '3' },
                { label: '14 pt', value: '4' },
                { label: '18 pt', value: '5' },
                { label: '24 pt', value: '6' },
                { label: '36 pt', value: '7' }
              ]
            },
            { type: 'color', label: 'Text Color', command: 'foreColor' },
            { type: 'color', label: 'Highlight', command: 'backColor' },
            {
              type: 'select',
              label: 'Line Height',
              command: 'lineHeight',
              options: [
                { label: '1.0', value: '1.0' },
                { label: '1.15', value: '1.15' },
                { label: '1.5', value: '1.5' },
                { label: '1.8', value: '1.8' },
                { label: '2.0', value: '2.0' },
                { label: '2.5', value: '2.5' },
                { label: '3.0', value: '3.0' }
              ]
            },
            {
              type: 'select',
              label: 'Code Language',
              command: 'codeLanguage',
              options: [
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'JavaScript', value: 'javascript' },
                { label: 'Python', value: 'python' },
                { label: 'Java', value: 'java' },
                { label: 'C#', value: 'csharp' },
                { label: 'C++', value: 'cpp' },
                { label: 'PHP', value: 'php' },
                { label: 'Ruby', value: 'ruby' },
                { label: 'SQL', value: 'sql' },
                { label: 'JSON', value: 'json' },
                { label: 'XML', value: 'xml' },
                { label: 'TypeScript', value: 'typescript' }
              ]
            }
          ]
        },
        {
          group: 'view',
          items: [
            { type: 'button', label: 'Source', command: 'toggleSource', icon: 'Source' },
            { type: 'button', label: 'Fullscreen', command: 'toggleFullscreen', icon: '⛶' }
          ]
        }
      ]
    };
    return { ...defaultConfig, ...userConfig };
  }

  _init() {
    this.container.classList.add('rte');

    // Create Toolbar
    this.toolbar = createToolbar(this.config, {
      execute: (cmd, val) => this.commandHandler.execute(cmd, val)
    });
    this.container.appendChild(this.toolbar);

    // Create Editor Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'rte__wrapper';
    wrapper.style.position = 'relative';

    // Create Editor Area
    const main = document.createElement('main');
    main.className = 'rte__content';
    main.contentEditable = true;
    main.setAttribute('role', 'textbox');
    main.setAttribute('aria-multiline', 'true');
    this.editor = main;
    wrapper.appendChild(main);

    // Create Source Area (hidden by default)
    const source = document.createElement('textarea');
    source.className = 'rte__source';
    source.style.display = 'none';
    source.style.width = '100%';
    source.style.height = '100%';
    source.style.minHeight = '200px';
    source.style.border = 'none';
    source.style.padding = 'var(--spacing-md)';
    source.style.fontFamily = 'monospace';
    source.style.fontSize = '13px';
    source.style.backgroundColor = '#f5f5f5';
    this.sourceView = source;
    wrapper.appendChild(source);

    this.container.appendChild(wrapper);

    // Initialize DraggableImage
    this.draggableImage = new DraggableImage(this);

    // Initialize QuickToolbar after DOM is ready
    this.quickToolbar = new QuickToolbar(this);

    this._bindEvents();
  }

  _bindEvents() {
    this.editor.addEventListener('keydown', (e) => {
      // Hide quick toolbar when typing (except for modifier keys)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        this.quickToolbar.hide();
      }

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (['b', 'i', 'u', 'z', 'y'].includes(key)) {
          e.preventDefault();
          const cmdMap = { b: 'bold', i: 'italic', u: 'underline', z: 'undo', y: 'redo' };
          this.commandHandler.execute(cmdMap[key]);
        }
      }
    });

    this.editor.addEventListener('mouseup', (e) => {
      this.stateManager.updateButtonStates();
      this._handleQuickToolbar(e);
    });

    this.editor.addEventListener('keyup', () => {
      this.stateManager.updateButtonStates();
    });

    this.editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
      const sanitized = sanitizeHTML(text);
      document.execCommand('insertHTML', false, sanitized);
    });
  }

  _handleQuickToolbar(event) {
    if (this.isSourceMode) return;

    setTimeout(() => {
      const target = event.target;

      // Check if clicked element is an image or contains an image
      let imageElement = null;

      if (target.tagName === 'IMG') {
        imageElement = target;
      } else if (target.querySelector && target.querySelector('img')) {
        imageElement = target.querySelector('img');
      }

      // If we found an image, show the quick toolbar
      if (imageElement && this.editor.contains(imageElement)) {
        const rect = imageElement.getBoundingClientRect();
        this.quickToolbar.show(imageElement, 'image', rect);
        return;
      }

      // Check if clicked element is a video or iframe (YouTube)
      let videoElement = null;
      if (target.tagName === 'VIDEO' || target.tagName === 'IFRAME') {
        videoElement = target;
      } else if (target.querySelector) {
        videoElement = target.querySelector('video') || target.querySelector('iframe');
      }

      if (videoElement && this.editor.contains(videoElement)) {
        const rect = videoElement.getBoundingClientRect();
        this.quickToolbar.show(videoElement, 'video', rect);
        return;
      }

      // Check if clicked element is audio
      let audioElement = null;
      if (target.tagName === 'AUDIO') {
        audioElement = target;
      } else if (target.querySelector && target.querySelector('audio')) {
        audioElement = target.querySelector('audio');
      }

      if (audioElement && this.editor.contains(audioElement)) {
        const rect = audioElement.getBoundingClientRect();
        this.quickToolbar.show(audioElement, 'audio', rect);
        return;
      }

      // Hide toolbar if clicking elsewhere
      this.quickToolbar.hide();
    }, 50);
  }

  async executeCommand(command, value = null) {
    if (command === 'toggleSource') {
      this.toggleSource();
      return;
    }

    if (this.isSourceMode) return;

    if (command === 'insertHTML' && value === '<code>') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const code = document.createElement('code');
      code.textContent = selection.toString() || 'code';
      range.deleteContents();
      range.insertNode(code);
    } else if (command === 'createLink') {
      try {
        const url = await this.modal.prompt({
          title: 'Insert Link',
          fields: [{ id: 'url', label: 'URL', type: 'url', value: 'https://', required: true }]
        });
        if (url) document.execCommand(command, false, url);
      } catch (e) { }
    } else if (command === 'insertImage') {
      try {
        const url = await this.modal.prompt({
          title: 'Insert Image',
          fields: [{ id: 'url', label: 'Image URL', type: 'url', required: true }]
        });
        if (url) document.execCommand(command, false, url);
      } catch (e) { }
    } else {
      document.execCommand(command, false, value);
    }
    this.editor.focus();
  }

  toggleSource() {
    this.isSourceMode = !this.isSourceMode;
    if (this.isSourceMode) {
      this.sourceView.value = sanitizeHTML(this.editor.innerHTML);
      this.editor.style.display = 'none';
      this.sourceView.style.display = 'block';
    } else {
      this.editor.innerHTML = sanitizeHTML(this.sourceView.value);
      this.sourceView.style.display = 'none';
      this.editor.style.display = 'block';
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      this.container.classList.add('rte--fullscreen');
      document.body.style.overflow = 'hidden';
    } else {
      this.container.classList.remove('rte--fullscreen');
      document.body.style.overflow = '';
    }
  }

  focus() {
    if (this.isSourceMode) {
      this.sourceView.focus();
    } else {
      this.editor.focus();
    }
  }

  getContent() {
    return sanitizeHTML(this.isSourceMode ? this.sourceView.value : this.editor.innerHTML);
  }

  setContent(html, skipHistory = false) {
    const sanitized = sanitizeHTML(html);
    if (this.isSourceMode) {
      this.sourceView.value = sanitized;
    } else {
      this.editor.innerHTML = sanitized;
    }
  }

  clearContent() {
    if (this.isSourceMode) {
      this.sourceView.value = '';
    } else {
      this.editor.innerHTML = '';
    }
  }

  /**
   * Load content from a static HTML string
   * @param {string} html - HTML content
   */
  loadFromHTML(html) {
    this.setContent(html);
  }

  /**
   * Load content from JSON object
   * @param {Object} data - JSON object with content property
   */
  loadFromJSON(data) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    const html = data.content || data.html || JSON.stringify(data);
    this.setContent(html);
  }

  /**
   * Load content from a URL/API
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options (method, headers, etc.)
   * @returns {Promise}
   */
  async loadFromAPI(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.loadFromJSON(data);
      return data;
    } catch (error) {
      console.error('Failed to load content from API:', error);
      throw error;
    }
  }

  /**
   * Save content to an API endpoint
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise}
   */
  async saveToAPI(url, options = {}) {
    try {
      const content = this.getContent();
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify({
          content,
          ...options.data
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to save content to API:', error);
      throw error;
    }
  }

  /**
   * Export content in various formats
   * @param {string} format - Format type: 'html', 'json', 'markdown', 'text', 'rtf'
   * @returns {string} Exported content
   */
  export(format = 'html') {
    const content = this.getContent();

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify({ content, timestamp: new Date().toISOString() });

      case 'markdown':
        // Simple HTML to Markdown conversion
        return this._htmlToMarkdown(content);

      case 'text':
        // Strip HTML tags
        const temp = document.createElement('div');
        temp.innerHTML = content;
        return temp.textContent || temp.innerText;

      case 'rtf':
        // Return RTF format
        return this._htmlToRTF(content);

      case 'html':
      default:
        return content;
    }
  }

  /**
   * Convert HTML to Markdown (basic conversion)
   * @private
   */
  _htmlToMarkdown(html) {
    let markdown = html
      .replace(/<h1[^>]*>(.+?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.+?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.+?)<\/h3>/gi, '### $1\n')
      .replace(/<strong[^>]*>(.+?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.+?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.+?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.+?)<\/i>/gi, '*$1*')
      .replace(/<u[^>]*>(.+?)<\/u>/gi, '__$1__')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.+?)<\/a>/gi, '[$2]($1)')
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
      .replace(/<ul[^>]*>(.+?)<\/ul>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>(.+?)<\/li>/gi) || [];
        return items.map(item => '- ' + item.replace(/<li[^>]*>|<\/li>/gi, '')).join('\n') + '\n';
      })
      .replace(/<ol[^>]*>(.+?)<\/ol>/gi, (match, content) => {
        const items = content.match(/<li[^>]*>(.+?)<\/li>/gi) || [];
        return items.map((item, i) => (i + 1) + '. ' + item.replace(/<li[^>]*>|<\/li>/gi, '')).join('\n') + '\n';
      })
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '');
    return markdown;
  }

  /**
   * Convert HTML to RTF (basic conversion)
   * @private
   */
  _htmlToRTF(html) {
    // Basic RTF conversion - returns simplified RTF format
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText;

    return `{\\rtf1\\ansi\\ansicpg1252\\cocoartf2\\cuc
\\margl1440\\margr1440\\margtsxn0\\margbsxn0\\mghdr0\\mglsxn0\\mgrsxn0\\UNDEFBAR\\margxsxn0\\vieww11900\\viewh8605\\viewkind0
\\c0\\pardirnatural\\partightenfactor100
\\f0\\fs24\\ltrch\\loch
${text}
}`;
  }

  destroy() {
    this.container.innerHTML = '';
    this.editor = null;
    this.sourceView = null;
    this.toolbar = null;
  }
}
