/**
 * Command Handler - Manages all editor commands and operations
 */

export class CommandHandler {
  constructor(editor) {
    this.editor = editor;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
  }

  async execute(command, value = null) {
    if (['undo', 'redo'].includes(command)) {
      if (command === 'undo') this._undo();
      else this._redo();
      this.editor.focus();
      return;
    }

    switch (command) {
      // Clipboard
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        // value may be 'default'|'word'|'plain' when invoked from toolbar select
        this._handlePaste(value || 'default');
        break;
      case 'pasteAsPlainText':
        await this._pasteAsPlainText();
        break;

      // Formatting
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'strikeThrough':
        document.execCommand('strikeThrough');
        break;
      case 'superscript':
        document.execCommand('superscript');
        break;
      case 'subscript':
        document.execCommand('subscript');
        break;
      case 'code':
        this._insertInlineCode();
        break;
      case 'clearFormatting':
        document.execCommand('removeFormat');
        break;

      // Text Case
      case 'uppercase':
        this._changeCase('uppercase');
        break;
      case 'lowercase':
        this._changeCase('lowercase');
        break;
      case 'sentenceCase':
        this._changeCase('sentenceCase');
        break;

      // Paragraph
      case 'formatBlock':
        document.execCommand('formatBlock', false, value);
        break;
      case 'align':
        this._setAlignment(value);
        break;
      case 'alignLeft':
        this._setAlignment('left');
        break;
      case 'alignCenter':
        this._setAlignment('center');
        break;
      case 'alignRight':
        this._setAlignment('right');
        break;
      case 'alignJustify':
        this._setAlignment('justify');
        break;
      case 'insertUnorderedList':
        this._insertList('unordered', value);
        break;
      case 'insertOrderedList':
        this._insertList('ordered', value);
        break;
      case 'listStyle':
        this._setListStyle(value);
        break;
      case 'bulletStyle':
        this._setListStyle('unordered', value);
        break;
      case 'numberStyle':
        this._setListStyle('ordered', value);
        break;
      case 'indent':
        document.execCommand('indent');
        break;
      case 'outdent':
        document.execCommand('outdent');
        break;
      case 'insertBlockquote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'insertHorizontalRule':
        document.execCommand('insertHorizontalRule');
        break;

      // Typography
      case 'fontName':
        document.execCommand('fontName', false, value);
        break;
      case 'fontSize':
        this._setFontSize(value);
        break;
      case 'lineHeight':
        this._setLineHeight(value);
        break;

      // Colors
      case 'foreColor':
        document.execCommand('foreColor', false, value);
        break;
      case 'backColor':
        document.execCommand('backColor', false, value);
        break;

      // Insert
      case 'createLink':
        await this._insertLink();
        break;
      case 'insertImage':
        await this._insertImage();
        break;
      case 'insertAudio':
        await this._insertAudio();
        break;
      case 'insertVideo':
        await this._insertVideo();
        break;
      case 'insertTable':
        await this._insertTable();
        break;
      case 'insertCodeBlock':
        this._insertCodeBlock(value);
        break;
      case 'insertSpecialChar':
        await this._insertSpecialChar();
        break;
      case 'insertChecklist':
        this._insertChecklist(value || 'checkbox');
        break;
      case 'findReplace':
        await this._findReplace();
        break;
      case 'history':
        await this._showVersionHistory();
        break;
      case 'save':
        await this._save();
        break;

      // View
      case 'toggleSource':
        if (this.editor.toggleSource) {
          this.editor.toggleSource();
        }
        break;
      case 'toggleFullscreen':
        if (this.editor.toggleFullscreen) {
          this.editor.toggleFullscreen();
        }
        break;
      case 'print':
        this._printContent();
        break;

      default:
        console.warn(`Unknown command: ${command}`);
    }

    // Save state after execution (excluding view toggles which don't change content)
    if (!['toggleSource', 'toggleFullscreen', 'history', 'findReplace'].includes(command)) {
      this.saveState();
    }

    this.editor.focus();
  }

  async _findReplace() {
    this.editor.modal.findReplace({
      onFind: (query) => {
        if (!query) return 'Enter text to find';
        // window.find(string, caseSensitive, backwards, wrapAround, wholeWord, searchInFrames, showDialog)
        const found = window.find(query, false, false, true, false, false, false);
        return found ? '' : 'Not found';
      },

      onReplace: (query, replacement) => {
        if (!query) return 'Enter text to find';
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText.toLowerCase() === query.toLowerCase()) {
          document.execCommand('insertText', false, replacement);
          // Auto find next
          window.find(query, false, false, true, false, false, false);
          // Save state after replace
          this.saveState();
          return 'Replaced';
        } else {
          const found = window.find(query, false, false, true, false, false, false);
          return found ? '' : 'Not found';
        }
      },

      onReplaceAll: (query, replacement) => {
        if (!query) return 'Enter text to find';
        const selection = window.getSelection();
        // Move to start of editor to ensure we catch all
        // Note: this collapses selection to start
        selection.collapse(this.editor.container, 0);

        let count = 0;
        // Search without wrap first to avoid infinite loop
        while (window.find(query, false, false, false, false, false, false)) {
          document.execCommand('insertText', false, replacement);
          count++;
        }
        // Save state after replace all
        this.saveState();
        return `Replaced ${count} occurrences`;
      }
    });
  }

  // Alias for backward compatibility
  _saveToHistory() {
    this.saveState();
  }

  saveState() {
    const content = this.editor.getContent();

    // Don't save if content hasn't changed from the last saved state
    if (this.history.length > 0 && this.history[this.historyIndex] === content) {
      return;
    }

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(content);
    this.historyIndex++;

    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  _undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.editor.setContent(this.history[this.historyIndex], true); // true = prevent recursion if setContent triggers save
    }
  }

  _redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.editor.setContent(this.history[this.historyIndex], true);
    }
  }

  async _handlePaste(mode = 'default') {
    // Check if PasteCleanup module is enabled
    if (this.editor.modules && this.editor.modules.includes('PasteCleanup')) {
      // Use the new pasteCleanup logic
      const cfg = this.editor.config && this.editor.config.pasteCleanup ? this.editor.config.pasteCleanup : {};
      let options = {
        mode: this._getModeFromFormatOption(cfg.formatOption || 'cleanFormat'),
        deniedTags: cfg.deniedTags || [],
        deniedAttributes: cfg.deniedAttributes || [],
        allowedStyleProperties: cfg.allowedStyleProperties || []
      };

      // For toolbar-initiated paste, override mode based on selection
      if (mode === 'plain') options.mode = 'plain';
      else if (mode === 'word') options.mode = 'clean'; // word mode uses clean format

      // Get clipboard content
      try {
        const clipboard = navigator.clipboard;
        if (!clipboard) {
          document.execCommand('paste');
          return;
        }

        let html = '';
        let text = '';

        // Try to read HTML content first
        try {
          const items = await clipboard.read();
          for (const item of items) {
            if (item.types.includes('text/html')) {
              const blob = await item.getType('text/html');
              html = await blob.text();
              break;
            }
          }
          if (!html) {
            text = await clipboard.readText();
          }
        } catch (e) {
          // Fallback to readText
          text = await clipboard.readText();
        }

        const content = html || text;

        // Check if content is from Word and automatically keep format
        const isFromWord = this._isFromWord(content);
        if (isFromWord) {
          // For Word content, insert as-is without any filtering
          document.execCommand('insertHTML', false, content);
          return;
        }

        if (options.mode === 'plain') {
          const escaped = content.replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
          document.execCommand('insertHTML', false, escaped);
          return;
        }

        if (options.mode === 'clean') {
          content = this._cleanWordHtml(content);
        }

        content = this._applyPasteFilters(content, options);
        document.execCommand('insertHTML', false, content);
      } catch (e) {
        document.execCommand('paste');
      }
    } else {
      // Legacy paste handling
      // mode: 'default' | 'word' | 'plain'
      try {
        const clipboard = navigator.clipboard;
        if (!clipboard) {
          // Fallback: trigger native paste
          document.execCommand('paste');
          return;
        }

        if (mode === 'plain') {
          // open plain-text paste modal
          await this._pasteAsPlainText();
          return;
        }

        // Try to read HTML if available when 'word' requested
        if (mode === 'word' && clipboard.read) {
          try {
            const items = await clipboard.read();
            for (const item of items) {
              if (item.types.includes('text/html')) {
                const blob = await item.getType('text/html');
                const html = await blob.text();
                const cleaned = this._cleanWordHtml(html);
                document.execCommand('insertHTML', false, cleaned);
                return;
              }
            }
          } catch (e) {
            // fall through to readText
          }
        }

        // Default: read text and sanitize
        const text = await clipboard.readText();
        let sanitized = this.editor.sanitizer(text);

        // Check if content is from Word and keep format
        if (this._isFromWord(text)) {
          // For Word content, keep the format
          document.execCommand('insertHTML', false, text);
          return;
        }

        if (mode === 'word') sanitized = this._cleanWordHtml(sanitized);
        document.execCommand('insertHTML', false, sanitized);
      } catch (e) {
        // Fallback to native paste
        document.execCommand('paste');
      }
    }
  }

  // Handle paste events coming from paste DOM event
  async handlePasteEvent(e) {
    try {
      if (!e || !e.clipboardData) return;
      const clipboardData = e.clipboardData;

      // Get paste cleanup configuration
      const cfg = this.editor.config && this.editor.config.pasteCleanup ? this.editor.config.pasteCleanup : {};
      let options = {
        mode: this._getModeFromFormatOption(cfg.formatOption || 'cleanFormat'),
        deniedTags: cfg.deniedTags || [],
        deniedAttributes: cfg.deniedAttributes || [],
        allowedStyleProperties: cfg.allowedStyleProperties || []
      };

      // If formatOption is 'prompt', show options to the user
      if (cfg.formatOption === 'prompt') {
        try {
          const result = await this.editor.modal.prompt({
            title: 'Paste Options',
            message: 'Choose how to clean pasted content and optionally specify denied tags/attributes or allowed styles (comma-separated).',
            fields: [
              {
                id: 'mode', label: 'Format Option', type: 'select', value: options.mode, options: [
                  { label: 'Keep Format', value: 'keep' },
                  { label: 'Clean Format', value: 'clean' },
                  { label: 'Plain Text', value: 'plain' }
                ]
              },
              { id: 'deniedTags', label: 'Denied Tags (comma separated)', type: 'text', value: (options.deniedTags || []).join(',') },
              { id: 'deniedAttributes', label: 'Denied Attributes (comma separated)', type: 'text', value: (options.deniedAttributes || []).join(',') },
              { id: 'allowedStyleProperties', label: 'Allowed Style Properties (comma separated)', type: 'text', value: (options.allowedStyleProperties || []).join(',') }
            ]
          });

          if (result) {
            options.mode = result.mode || options.mode;
            options.deniedTags = (result.deniedTags || '').split(',').map(s => s.trim()).filter(Boolean);
            options.deniedAttributes = (result.deniedAttributes || '').split(',').map(s => s.trim()).filter(Boolean);
            options.allowedStyleProperties = (result.allowedStyleProperties || '').split(',').map(s => s.trim()).filter(Boolean);
          }
        } catch (err) {
          // user cancelled - abort paste
          return;
        }
      }

      // Obtain HTML if available, otherwise plain text
      const html = clipboardData.getData('text/html');
      const text = clipboardData.getData('text/plain');

      // Check if content is from Microsoft Word and automatically keep format
      const isFromWord = html && this._isFromWord(html);
      if (isFromWord) {
        // For Word content, insert HTML as-is without any filtering
        console.log('Word content detected, preserving all formatting');
        document.execCommand('insertHTML', false, html);
        return;
      }

      if (options.mode === 'plain') {
        const escaped = (text || html || '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
        document.execCommand('insertHTML', false, escaped);
        return;
      }

      let content = html || text || '';
      if (options.mode === 'clean') {
        content = this._cleanWordHtml(content);
      }

      content = this._applyPasteFilters(content, options);

      document.execCommand('insertHTML', false, content);
    } catch (err) {
      // fallback: try native paste
      try { document.execCommand('paste'); } catch (e) { }
    }
  }

  _applyPasteFilters(html, options = {}) {
    if (!html) return '';
    // Parse into DOM
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove denied tags with attribute-based filtering
    if (options.deniedTags && options.deniedTags.length) {
      options.deniedTags.forEach(tagPattern => {
        this._removeDeniedTags(temp, tagPattern);
      });
    }

    // Remove denied attributes
    if (options.deniedAttributes && options.deniedAttributes.length) {
      const all = temp.getElementsByTagName('*');
      for (let i = 0; i < all.length; i++) {
        const el = all[i];
        options.deniedAttributes.forEach(attr => {
          if (el.hasAttribute && el.hasAttribute(attr)) el.removeAttribute(attr);
        });
      }
    }

    // Filter style property list
    if (options.allowedStyleProperties && options.allowedStyleProperties.length) {
      const all = temp.getElementsByTagName('*');
      for (let i = 0; i < all.length; i++) {
        const el = all[i];
        if (el.hasAttribute && el.hasAttribute('style')) {
          const style = el.getAttribute('style');
          const rules = style.split(';').map(r => r.trim()).filter(Boolean);
          const allowed = options.allowedStyleProperties.map(s => s.toLowerCase());
          const kept = rules.filter(rule => {
            const prop = rule.split(':')[0] && rule.split(':')[0].trim().toLowerCase();
            return allowed.includes(prop);
          });
          if (kept.length) el.setAttribute('style', kept.join('; ')); else el.removeAttribute('style');
        }
      }
    }

    // Fallback sanitize
    try {
      return this.editor.sanitizer(temp.innerHTML);
    } catch (e) {
      return temp.innerHTML;
    }
  }

  _getModeFromFormatOption(formatOption) {
    switch (formatOption) {
      case 'plainText': return 'plain';
      case 'keepFormat': return 'keep';
      case 'cleanFormat': return 'clean';
      case 'prompt': return 'clean'; // default when prompt is shown
      default: return 'clean';
    }
  }

  _isFromWord(html) {
    if (!html) return false;

    // Check for Microsoft Word specific indicators
    const wordIndicators = [
      /mso-[a-zA-Z-]+/i,  // mso- prefixed styles and attributes
      /w:[a-zA-Z-]+/i,    // w: prefixed Word XML attributes
      /\[if [^]]*\]/i,    // conditional comments
      /\[endif\]/i,       // endif comments
      /urn:schemas-microsoft-com:office/i,  // Office schemas
      /WordDocument/i,    // Word document marker
      /class="[^"]*Mso[^"]*"/i,  // Mso classes
      /style="[^"]*mso-[^"]*"/i, // mso- styles
      /xmlns:w=/i,        // Word XML namespace
      /xmlns:o=/i,        // Office XML namespace
      /<w:[a-zA-Z]+/i,    // Word XML tags
      /<o:[a-zA-Z]+/i     // Office XML tags
    ];

    const isWord = wordIndicators.some(pattern => pattern.test(html));
    if (isWord) {
      console.log('Word content detected with pattern:', wordIndicators.find(pattern => pattern.test(html)));
    }
    return isWord;
  }

  _cleanWordHtml(html) {
    if (!html) return '';
    // Remove Word conditional comments and XML namespaces
    html = html.replace(/<!--\[if[\s\S]*?endif\]-->/gi, '');
    // Remove o:p tags
    html = html.replace(/<\/?o:p[^>]*>/gi, '');
    // Remove mso- styles and classes
    html = html.replace(/class="[^"]*mso-[^"]*"/gi, '');
    html = html.replace(/style="[^"]*mso-[^"]*"/gi, '');
    // Remove XML namespace declarations
    html = html.replace(/xmlns(:[a-z]+)?="[^"]*"/gi, '');
    // Strip comments
    html = html.replace(/<!--([\s\S]*?)-->/g, '');
    // Remove empty spans
    html = html.replace(/<span[^>]*>\s*<\/span>/gi, '');
    // Use base sanitizer afterwards
    try {
      return this.editor.sanitizer(html);
    } catch (e) {
      return html;
    }
  }

  _removeDeniedTags(container, tagPattern) {
    // Parse tag pattern like 'a[!href]' or 'a[href, target]'
    const match = tagPattern.match(/^([a-zA-Z][a-zA-Z0-9]*)(?:\[(.*?)\])?$/);
    if (!match) return;

    const tagName = match[1].toUpperCase();
    const attrPattern = match[2];

    if (!attrPattern) {
      // Simple tag removal without attributes
      const nodes = container.getElementsByTagName(tagName);
      const arr = Array.from(nodes);
      arr.forEach(n => {
        const parent = n.parentNode;
        while (n.firstChild) parent.insertBefore(n.firstChild, n);
        parent.removeChild(n);
      });
      return;
    }

    // Parse attribute conditions
    const conditions = attrPattern.split(',').map(s => s.trim());
    const nodes = container.getElementsByTagName(tagName);
    const arr = Array.from(nodes);

    arr.forEach(n => {
      let shouldRemove = false;

      for (const condition of conditions) {
        if (condition.startsWith('!')) {
          // Negative condition: remove if attribute is NOT present
          const attr = condition.substring(1);
          if (!n.hasAttribute(attr)) {
            shouldRemove = true;
            break;
          }
        } else {
          // Positive condition: remove if attribute IS present
          if (n.hasAttribute(condition)) {
            shouldRemove = true;
            break;
          }
        }
      }

      if (shouldRemove) {
        const parent = n.parentNode;
        while (n.firstChild) parent.insertBefore(n.firstChild, n);
        parent.removeChild(n);
      }
    });
  }

  _cleanWordHtml(html) {
    if (!html) return '';
    // Remove Word conditional comments and XML namespaces
    html = html.replace(/<!--\[if[\s\S]*?endif\]-->/gi, '');
    // Remove o:p tags
    html = html.replace(/<\/?o:p[^>]*>/gi, '');
    // Remove mso- styles and classes
    html = html.replace(/class=\"?Mso[A-Za-z0-9_\-]*\"?/gi, '');
    html = html.replace(/style=\"[^\"]*mso-[^\"]*\"/gi, '');
    // Remove XML namespace declarations
    html = html.replace(/xmlns(:[a-z]+)?=\"[^\"]*\"/gi, '');
    // Strip comments
    html = html.replace(/<!--([\s\S]*?)-->/g, '');
    // Remove empty spans
    html = html.replace(/<span[^>]*>\s*<\/span>/gi, '');
    // Use base sanitizer afterwards
    try {
      return this.editor.sanitizer(html);
    } catch (e) {
      return html;
    }
  }

  async _pasteAsPlainText() {
    try {
      const text = await this.editor.modal.prompt({
        title: 'Paste Plain Text',
        message: 'This example demonstrates the paste cleanup feature of the Rich Text Editor control. Copy your content from MS Word or other website, and paste it within the editor to cleanup.',
        fields: [{ id: 'text', label: 'Content', type: 'textarea', placeholder: 'Paste your text here...', required: true }]
      });
      if (text) {
        const escaped = text.replace(/[&<>"']/g, char => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char]));
        document.execCommand('insertHTML', false, escaped);
      }
    } catch (e) {
      console.log('Paste cancelled');
    }
  }

  _insertInlineCode() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const code = document.createElement('code');
      code.textContent = selection.toString() || 'code';
      range.deleteContents();
      range.insertNode(code);
    }
  }

  _changeCase(type) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const text = selection.toString();
    let newText = text;

    switch (type) {
      case 'uppercase':
        newText = text.toUpperCase();
        break;
      case 'lowercase':
        newText = text.toLowerCase();
        break;
      case 'sentenceCase':
        newText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
    }

    document.execCommand('insertText', false, newText);
  }

  _setAlignment(alignment) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let block = range.commonAncestorContainer;

    // Get the closest block element
    while (block && block.nodeType !== Node.ELEMENT_NODE) {
      block = block.parentNode;
    }

    while (block && block.nodeType === Node.ELEMENT_NODE &&
      !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'LI'].includes(block.tagName)) {
      block = block.parentNode;
    }

    if (block && block.nodeType === Node.ELEMENT_NODE) {
      block.style.textAlign = alignment;
    }
  }

  _setListStyle(type, style) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let list = range.commonAncestorContainer;

    // Get the closest list element
    while (list && list.nodeType !== Node.ELEMENT_NODE) {
      list = list.parentNode;
    }

    const tagName = type === 'unordered' ? 'UL' : 'OL';
    while (list && list.nodeType === Node.ELEMENT_NODE &&
      list.tagName !== tagName) {
      list = list.parentNode;
    }

    if (list && list.nodeType === Node.ELEMENT_NODE && list.tagName === tagName) {
      const standardStyles = ['disc', 'circle', 'square', 'none', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'];
      if (standardStyles.includes(style)) {
        list.style.listStyleType = style;
        list.removeAttribute('data-list-marker');
      } else {
        list.style.listStyleType = 'none';
        list.setAttribute('data-list-marker', style);
      }
    } else {
      // No list found, insert a new one
      this._insertList(type, style);
    }
  }

  _insertList(type, style = 'default') {
    const command = type === 'unordered' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(command);

    // If a specific style is requested, apply it to the newly created list
    if (style && style !== 'default') {
      // Small delay to ensure the list is inserted
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let list = range.commonAncestorContainer;

          // Find the list element
          while (list && list.nodeType !== Node.ELEMENT_NODE) {
            list = list.parentNode;
          }

          while (list && list.nodeType === Node.ELEMENT_NODE &&
            !((type === 'unordered' && list.tagName === 'UL') || (type === 'ordered' && list.tagName === 'OL'))) {
            list = list.parentNode;
          }

          if (list) {
            const standardStyles = ['disc', 'circle', 'square', 'none', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'];
            if (standardStyles.includes(style)) {
              list.style.listStyleType = style;
              list.removeAttribute('data-list-marker');
            } else {
              list.style.listStyleType = 'none';
              list.setAttribute('data-list-marker', style);
            }
          }
        }
      }, 10);
    }
  }

  _setLineHeight(value) {
    // Focus editor first
    this.editor.editor.focus();

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Get all block-level elements within the selection
    const blockElements = new Set();

    // If nothing is selected (collapsed), find the block containing cursor
    if (range.collapsed) {
      let node = selection.anchorNode;

      // If it's a text node, get its parent element
      if (node && node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }

      // Find the closest block-level element that's not the editor itself
      while (node && node !== this.editor.editor) {
        if (node.nodeType === Node.ELEMENT_NODE && node.parentElement === this.editor.editor) {
          // We're at a top-level block in the editor
          const tagName = node.tagName;
          if (tagName === 'P' || tagName === 'DIV' ||
            tagName === 'LI' || tagName.match(/^H[1-6]$/) ||
            tagName === 'BLOCKQUOTE' || tagName === 'PRE') {
            blockElements.add(node);
            break;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName;
          if (tagName === 'P' || tagName === 'DIV' ||
            tagName === 'LI' || tagName.match(/^H[1-6]$/) ||
            tagName === 'BLOCKQUOTE' || tagName === 'PRE') {
            blockElements.add(node);
            break;
          }
        }
        node = node.parentElement;
      }
    } else {
      // Text is selected - find all block elements that contain selected content
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      // Helper function to get the block parent of a node
      const getBlockParent = (node) => {
        let current = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        while (current && current !== this.editor.editor) {
          const tagName = current.tagName;
          if (current.nodeType === Node.ELEMENT_NODE &&
            (tagName === 'P' || tagName === 'DIV' || tagName === 'LI' ||
              tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE' || tagName === 'PRE')) {
            return current;
          }
          current = current.parentElement;
        }
        return null;
      };

      // Get start and end blocks
      const startBlock = getBlockParent(startContainer);
      const endBlock = getBlockParent(endContainer);

      if (startBlock && endBlock) {
        if (startBlock === endBlock) {
          // Selection within a single block
          blockElements.add(startBlock);
        } else {
          // Selection spans multiple blocks
          blockElements.add(startBlock);

          // Find all blocks between start and end
          let currentNode = startBlock.nextSibling;
          while (currentNode && currentNode !== endBlock) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
              const tagName = currentNode.tagName;
              if (tagName === 'P' || tagName === 'DIV' || tagName === 'LI' ||
                tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE' || tagName === 'PRE') {
                blockElements.add(currentNode);
              }
            }
            currentNode = currentNode.nextSibling;
          }

          blockElements.add(endBlock);
        }
      } else if (startBlock) {
        blockElements.add(startBlock);
      } else if (endBlock) {
        blockElements.add(endBlock);
      }
    }

    // Apply line height to all found block elements
    if (blockElements.size > 0) {
      blockElements.forEach(element => {
        // Don't apply to pre/code blocks as they have special formatting
        if (element.tagName !== 'PRE') {
          element.style.lineHeight = value;
        }
      });
    } else {
      // If no block elements found, create a new paragraph with line height
      const p = document.createElement('p');
      p.style.lineHeight = value;
      p.innerHTML = '<br>';
      range.insertNode(p);

      // Move cursor into the new paragraph
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    // Restore focus
    this.editor.editor.focus();
  }

  _setFontSize(value) {
    // Map HTML font size values to point sizes (matching the dropdown)
    const sizeMap = {
      '1': '8pt',   // 8 pt
      '2': '10pt',  // 10 pt
      '3': '12pt',  // 12 pt (Default)
      '4': '14pt',  // 14 pt
      '5': '18pt',  // 18 pt
      '6': '24pt',  // 24 pt
      '7': '36pt'   // 36 pt
    };

    const fontSize = sizeMap[value] || value;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      // If no selection, set for future typing
      this.editor.editor.focus();
      return;
    }

    const range = selection.getRangeAt(0);

    // If no text is selected, insert a zero-width space with the font size
    if (range.collapsed) {
      const span = document.createElement('span');
      span.style.fontSize = fontSize;
      span.innerHTML = '&#8203;'; // Zero-width space
      range.insertNode(span);

      // Move cursor inside the span
      range.setStart(span, 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Text is selected, wrap it in a span with font size
      const span = document.createElement('span');
      span.style.fontSize = fontSize;

      try {
        range.surroundContents(span);
      } catch (e) {
        // If surroundContents fails, use extractContents
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }

      // Restore selection
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.editor.editor.focus();
  }

  async _setCustomLineHeight() {
    // Store the current focused/active element in the editor BEFORE modal opens
    this.editor.editor.focus();

    const selection = window.getSelection();
    let targetElement = null;

    if (selection.rangeCount > 0) {
      // Get the element at cursor position
      let node = selection.anchorNode;

      // If it's a text node, get its parent
      if (node && node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }

      // Traverse up to find the closest block element
      while (node && node !== this.editor.editor) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName;
          if (tagName === 'P' || tagName === 'DIV' || tagName === 'LI' ||
            tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE') {
            targetElement = node;
            break;
          }
        }
        node = node.parentElement;
      }
    }

    // Store element reference for use after modal
    const storedElement = targetElement;

    try {
      const result = await this.editor.modal.prompt({
        title: 'Custom Line Height',
        fields: [
          {
            id: 'lineHeight',
            label: 'Line Height Value',
            type: 'text',
            placeholder: 'Enter value (e.g., 1.5, 2.0, 24px)',
            value: '1.5',
            required: true
          }
        ]
      });

      if (result && result.lineHeight) {
        if (storedElement) {
          // Apply to stored element
          storedElement.style.lineHeight = result.lineHeight;
        } else {
          // If no element found, create a new paragraph with line height
          const para = document.createElement('p');
          para.style.lineHeight = result.lineHeight;
          para.innerHTML = '<br>';
          this.editor.editor.appendChild(para);

          // Move cursor to new paragraph
          const range = document.createRange();
          range.setStart(para, 0);
          range.collapse(true);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        this.editor.editor.focus();
      }
    } catch (e) {
      console.log('Custom line height cancelled');
      this.editor.editor.focus();
    }
  }

  async _save() {
    try {
      const name = await this.editor.modal.prompt({
        title: 'Save Version',
        fields: [
          { id: 'name', label: 'Version Name', type: 'text', placeholder: 'e.g. Draft 1', required: true }
        ]
      });

      if (name) {
        this.editor._saveSnapshot(name, 'named');
        this.editor.modal.alert('Success', 'Version saved successfully!');
      }
    } catch (e) {
      // Cancelled
    }
  }

  async _showVersionHistory() {
    const snapshots = this.editor._getSnapshots();
    if (snapshots.length === 0) {
      await this.editor.modal.alert('Version History', 'No versions found.');
      return;
    }

    try {
      const selectedSnapshot = await this.editor.modal.versionHistory(snapshots);
      if (selectedSnapshot) {
        this.editor.setContent(selectedSnapshot.content);
        this.editor.modal.alert('Success', 'Content restored to version: ' + selectedSnapshot.label);
      }
    } catch (e) {
      // User cancelled
    }
  }

  async _insertLink() {
    try {
      const data = await this.editor.modal.prompt({
        title: 'Insert Link',
        className: 'rte__modal--link',
        fields: [
          { id: 'url', label: 'Web Address', type: 'url', value: 'https://', required: true },
          { id: 'text', label: 'Display Text', type: 'text', value: window.getSelection().toString() || 'Link', required: true },
          { id: 'title', label: 'Title', type: 'text', value: '' },
          { id: 'target', label: 'Open Link in New Window', type: 'checkbox', checked: true }
        ]
      });

      if (data && data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.textContent = data.text || data.url;

        if (data.title) {
          link.title = data.title;
        }

        if (data.target) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(link);
        }
      }
    } catch (e) {
      console.log('Link insertion cancelled', e);
    }
  }

  async _insertImage() {
    try {
      const data = await this.editor.modal.uploadMedia({
        title: 'Insert Image',
        accept: 'image/*',
        label: 'Drop image here or browse to upload'
      });

      if (data && data.url) {
        const container = document.createElement('div');
        container.style.margin = '1rem 0';
        container.style.textAlign = 'center';

        // Create a wrapper for resizing
        const resizer = document.createElement('div');
        resizer.style.display = 'inline-block';
        resizer.style.resize = 'both';
        resizer.style.overflow = 'hidden';
        resizer.style.verticalAlign = 'bottom';
        resizer.style.maxWidth = '100%';
        resizer.contentEditable = 'false';
        resizer.style.border = '1px solid transparent'; // visual cue

        const img = document.createElement('img');
        img.src = data.url;
        img.alt = data.alt || 'Image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';

        resizer.appendChild(img);
        container.appendChild(resizer);

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(container);

          // Create a new paragraph after the image for text to continue
          const newPara = document.createElement('p');
          newPara.innerHTML = '<br>';
          container.parentNode.insertBefore(newPara, container.nextSibling);

          // Place cursor in the new paragraph
          const newRange = document.createRange();
          newRange.selectNodeContents(newPara);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } catch (e) {
      console.log('Image insertion cancelled', e);
    }
  }

  async _insertAudio() {
    try {
      const data = await this.editor.modal.uploadMedia({
        title: 'Insert Audio',
        accept: 'audio/*',
        label: 'Drop audio here or browse to upload',
        placeholder: 'http://example.com/audio.mp3',
        className: 'rte__modal--audio'
      });

      if (data && data.url) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';

        const audio = document.createElement('audio');
        audio.src = data.url;
        audio.controls = true;
        audio.style.maxWidth = '100%';
        audio.style.display = 'inline-block';

        wrapper.appendChild(audio);

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(wrapper);

          // Create a new paragraph after the audio for text to continue
          const newPara = document.createElement('p');
          newPara.innerHTML = '<br>';
          wrapper.parentNode.insertBefore(newPara, wrapper.nextSibling);

          // Place cursor in the new paragraph
          const newRange = document.createRange();
          newRange.selectNodeContents(newPara);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } catch (e) {
      console.log('Audio insertion cancelled');
    }
  }

  async _insertVideo() {
    try {
      const data = await this.editor.modal.uploadMedia({
        title: 'Insert Video',
        accept: 'video/*',
        label: 'Drop video here or browse to upload',
        placeholder: 'http://example.com/video.mp4',
        className: 'rte__modal--video'
      });

      if (data && data.url) {
        const wrapper = document.createElement('div');
        wrapper.className = 'rte__video-wrapper';
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';

        // Check for YouTube
        const ytMatch = data.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;

        let content;
        // Container for resizing
        const resizer = document.createElement('div');
        resizer.style.display = 'inline-block';
        resizer.style.resize = 'both';
        resizer.style.overflow = 'hidden';
        resizer.style.maxWidth = '100%';
        resizer.style.position = 'relative';
        resizer.style.border = '1px solid transparent'; // visual cue

        if (ytId) {
          content = document.createElement('iframe');
          content.src = `https://www.youtube.com/embed/${ytId}`;
          content.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          content.allowFullscreen = true;
          content.style.border = 'none';

          // Default YouTube Size
          resizer.style.width = '560px';
          resizer.style.height = '315px';
        } else {
          content = document.createElement('video');
          content.src = data.url;
          content.controls = true;

          // Default Video Size
          resizer.style.width = '480px';
          resizer.style.height = '270px';
        }

        content.style.width = '100%';
        content.style.height = '100%';

        resizer.appendChild(content);
        wrapper.appendChild(resizer);

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(wrapper);

          // Create a new paragraph after the video for text to continue
          const newPara = document.createElement('p');
          newPara.innerHTML = '<br>';
          wrapper.parentNode.insertBefore(newPara, wrapper.nextSibling);

          // Place cursor in the new paragraph
          const newRange = document.createRange();
          newRange.selectNodeContents(newPara);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } catch (e) {
      console.log('Video insertion cancelled');
    }
  }

  async _insertTable() {
    try {
      const sizes = await this.editor.modal.tableSelector();

      if (sizes && sizes.rows && sizes.cols) {
        const table = document.createElement('table');
        table.style.border = '1px solid #ccc';
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.margin = '10px 0';

        for (let i = 0; i < sizes.rows; i++) {
          const tr = document.createElement('tr');
          for (let j = 0; j < sizes.cols; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid #ccc';
            td.style.padding = '8px';
            td.innerHTML = i === 0 ? `<strong>Header ${j + 1}</strong>` : `Cell ${j + 1}`;
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(table);
        }
      }
    } catch (e) {
      console.log('Table insertion cancelled');
    }
  }

  _insertCodeBlock(language = 'javascript') {
    // Default to javascript if no language specified
    const langLabel = this._getLanguageLabel(language);

    // Map language names to Prism language identifiers
    const prismLang = this._getPrismLanguage(language);

    // Focus the editor
    this.editor.editor.focus();

    // Create elements programmatically for better control
    const pre = document.createElement('pre');
    pre.className = `language-${prismLang}`;
    pre.setAttribute('data-language', prismLang);
    // Preserve the originally chosen language so the toolbar can reflect it later
    pre.setAttribute('data-source-language', language);
    pre.contentEditable = 'false'; // Make pre non-editable
    pre.style.position = 'relative';

    // Add language label
    const label = document.createElement('div');
    label.className = 'code-language-label';
    label.textContent = langLabel;
    label.contentEditable = 'false';

    // Create code element
    const code = document.createElement('code');
    code.className = `language-${prismLang}`;
    code.contentEditable = 'true'; // Make code editable
    code.textContent = `// Enter your ${langLabel} code here...\n`;

    pre.appendChild(label);
    pre.appendChild(code);

    // Create following paragraph
    const p = document.createElement('p');
    p.innerHTML = '<br>';

    // Insert at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(p);
      range.insertNode(pre);

      // Move cursor into the code block
      const newRange = document.createRange();
      newRange.selectNodeContents(code);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    // Apply syntax highlighting immediately
    if (window.Prism) {
      // Use Prism.highlightElement for better compatibility
      Prism.highlightElement(code);
    }

    // Add input listener for live syntax highlighting on this specific code block
    code.addEventListener('input', () => {
      if (window.Prism) {
        // Store cursor position
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(code);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const caretOffset = preCaretRange.toString().length;

        // Store the plain text content before highlighting
        const text = code.textContent;

        // Re-apply the language class in case it was lost
        code.className = `language-${prismLang}`;

        // Re-highlight using Prism
        code.innerHTML = Prism.highlight(text, Prism.languages[prismLang] || Prism.languages.javascript, prismLang);

        // Restore cursor position
        setTimeout(() => {
          const textNode = this._getTextNodeAtOffset(code, caretOffset);
          if (textNode) {
            const newRange = document.createRange();
            newRange.setStart(textNode.node, textNode.offset);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        }, 0);
      }
    });
  }

  _getTextNodeAtOffset(element, offset) {
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= offset) {
        return {
          node: node,
          offset: offset - currentOffset
        };
      }
      currentOffset += nodeLength;
    }

    return null;
  }


  _getPrismLanguage(language) {
    const langMap = {
      'html': 'markup',
      'xml': 'markup',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'java': 'java',
      'python': 'python',
      'php': 'php',
      'ruby': 'ruby',
      'sql': 'sql',
      'css': 'css',
      'csharp': 'csharp',
      'cpp': 'cpp',
      'json': 'json'
    };
    return langMap[language] || language;
  }

  _getLanguageLabel(language) {
    const labels = {
      'html': 'HTML',
      'java': 'Java',
      'javascript': 'JavaScript',
      'php': 'PHP',
      'python': 'Python',
      'ruby': 'Ruby',
      'sql': 'SQL',
      'typescript': 'TypeScript',
      'xml': 'XML',
      'css': 'CSS',
      'csharp': 'C#',
      'cpp': 'C++',
      'json': 'JSON'
    };
    return labels[language] || language.toUpperCase();
  }

  async _insertSpecialChar() {
    try {
      const chars = [
        // Currency
        '€', '£', '¥', '¢', '¤', '₹', '₽', '₿',
        // Math
        '±', '×', '÷', '≈', '≠', '≤', '≥', '∞', '∑', '∏', '√', '∫', '∆', 'π', '°',
        // Punctuation & Symbols
        '©', '®', '™', '§', '¶', '†', '‡', '•', '…', '–', '—', '«', '»', '‹', '›', '¿', '¡',
        // Arrows
        '←', '↑', '→', '↓', '↔', '↕', '⇐', '⇑', '⇒', '⇓',
        // Greek
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Ω',
        // Accents
        'Á', 'á', 'À', 'à', 'Â', 'â', 'Ä', 'ä', 'Ã', 'ã', 'Å', 'å', 'Æ', 'æ', 'Ç', 'ç', 'É', 'é', 'È', 'è', 'Ê', 'ê', 'Ë', 'ë'
      ];

      const char = await this.editor.modal.grid({
        title: 'Insert Special Character',
        items: chars
      });

      if (char) {
        document.execCommand('insertText', false, char);
      }
    } catch (e) {
      console.log('Special char insertion cancelled');
    }
  }

  _insertChecklist(type = 'checkbox') {
    const ul = document.createElement('ul');
    ul.className = 'rte-checklist';
    ul.dataset.checkboxType = type;
    ul.style.listStyleType = 'none';
    ul.style.paddingLeft = '0';

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'flex-start';
    li.style.marginBottom = '0.5rem';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = `rte-checkbox rte-checkbox--${type}`;
    checkbox.style.marginTop = '4px';
    checkbox.style.marginRight = '8px';
    checkbox.onclick = (e) => {
      if (e.target.checked) {
        e.target.setAttribute('checked', 'checked');
      } else {
        e.target.removeAttribute('checked');
      }
    };

    const textSpan = document.createElement('span');
    textSpan.innerHTML = '<br>'; // Empty, user can type immediately

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    ul.appendChild(li);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(ul);

      // Select the text span
      const newRange = document.createRange();
      newRange.selectNodeContents(textSpan);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  /**
   * Print editor content
   */
  _printContent() {
    // Get the editor content
    const content = this.editor.getContent();

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('Please allow pop-ups to print the document.');
      return;
    }

    // Write the content with basic styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Document</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      // Close the window after printing (optional)
      setTimeout(() => printWindow.close(), 100);
    };
  }
}
