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
    // Save to history before executing (for undo/redo)
    if (!['undo', 'redo', 'toggleSource', 'toggleFullscreen'].includes(command)) {
      this._saveToHistory();
    }

    switch (command) {
      // Clipboard
      case 'undo':
        this._undo();
        break;
      case 'redo':
        this._redo();
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        this._handlePaste();
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
        document.execCommand('insertUnorderedList');
        break;
      case 'insertOrderedList':
        document.execCommand('insertOrderedList');
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
      case 'insertEmoji':
        await this._insertEmoji();
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

      default:
        console.warn(`Unknown command: ${command}`);
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
        return `Replaced ${count} occurrences`;
      }
    });
  }

  _saveToHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(this.editor.getContent());
    this.historyIndex++;

    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  _undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.editor.setContent(this.history[this.historyIndex], true);
    }
  }

  _redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.editor.setContent(this.history[this.historyIndex], true);
    }
  }

  _handlePaste() {
    // Let default paste happen, but sanitize on blur/change
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.readText().then(text => {
        const sanitized = this.editor.sanitizer(text);
        document.execCommand('insertHTML', false, sanitized);
      }).catch(() => {
        // Fallback to regular paste
        document.execCommand('paste');
      });
    }
  }

  async _pasteAsPlainText() {
    try {
      const text = await this.editor.modal.prompt({
        title: 'Paste Plain Text',
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
      
      // Find the closest block-level element
      while (node && node !== this.editor.editor) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName;
          const display = window.getComputedStyle(node).display;
          
          if (display === 'block' || tagName === 'P' || tagName === 'DIV' || 
              tagName === 'LI' || tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE') {
            blockElements.add(node);
            break;
          }
        }
        node = node.parentElement;
      }
    } else {
      // Text is selected - find all block elements in selection
      const commonAncestor = range.commonAncestorContainer;
      const walker = document.createTreeWalker(
        commonAncestor.nodeType === Node.ELEMENT_NODE ? commonAncestor : commonAncestor.parentElement,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            // Check if node is within selection
            if (range.intersectsNode(node)) {
              const tagName = node.tagName;
              const display = window.getComputedStyle(node).display;
              
              if (display === 'block' || tagName === 'P' || tagName === 'DIV' || 
                  tagName === 'LI' || tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE') {
                return NodeFilter.FILTER_ACCEPT;
              }
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );
      
      let node;
      while ((node = walker.nextNode())) {
        blockElements.add(node);
      }
      
      // Also check the common ancestor itself
      if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
        const tagName = commonAncestor.tagName;
        const display = window.getComputedStyle(commonAncestor).display;
        
        if (display === 'block' || tagName === 'P' || tagName === 'DIV' || 
            tagName === 'LI' || tagName.match(/^H[1-6]$/) || tagName === 'BLOCKQUOTE') {
          blockElements.add(commonAncestor);
        }
      }
    }
    
    // Apply line height to all found block elements
    if (blockElements.size > 0) {
      blockElements.forEach(element => {
        element.style.lineHeight = value;
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
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';

        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.display = 'inline-block';

        wrapper.appendChild(video);
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

  async _insertEmoji() {
    try {
      const emoji = await this.editor.modal.prompt({
        title: 'Insert Emoji',
        fields: [{ id: 'emoji', label: 'Emoji', type: 'text', value: '😊', required: true }]
      });
      if (emoji) {
        document.execCommand('insertText', false, emoji);
      }
    } catch (e) {
      console.log('Emoji insertion cancelled');
    }
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
}
