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
        document.execCommand('fontSize', false, value);
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
        this._insertCodeBlock();
        break;
      case 'insertEmoji':
        await this._insertEmoji();
        break;
      case 'insertSpecialChar':
        await this._insertSpecialChar();
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
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.lineHeight = value;
    span.textContent = selection.toString();
    range.deleteContents();
    range.insertNode(span);
  }

  async _insertLink() {
    try {
      const data = await this.editor.modal.prompt({
        title: 'Insert Link',
        fields: [
          { id: 'url', label: 'URL', type: 'url', value: 'https://', required: true },
          { id: 'text', label: 'Link Text', type: 'text', value: window.getSelection().toString() || 'Link', required: true }
        ]
      });

      if (data && data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.textContent = data.text || data.url;
        link.target = '_blank';

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(link);
        }
      }
    } catch (e) {
      console.log('Link insertion cancelled');
    }
  }

  async _insertImage() {
    try {
      const data = await this.editor.modal.prompt({
        title: 'Insert Image',
        fields: [
          { id: 'url', label: 'Image URL', type: 'url', required: true },
          { id: 'alt', label: 'Alt Text', type: 'text', value: 'Image' }
        ]
      });

      if (data && data.url) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';
        
        const img = document.createElement('img');
        img.src = data.url;
        img.alt = data.alt || 'Image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'inline-block';
        img.style.borderRadius = '4px';
        
        wrapper.appendChild(img);

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(wrapper);
          
          // Create a new paragraph after the image for text to continue
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
      console.log('Image insertion cancelled');
    }
  }

  async _insertAudio() {
    try {
      const url = await this.editor.modal.prompt({
        title: 'Insert Audio',
        fields: [{ id: 'url', label: 'Audio URL', type: 'url', required: true }]
      });

      if (url) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';
        
        const audio = document.createElement('audio');
        audio.src = url;
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
      const url = await this.editor.modal.prompt({
        title: 'Insert Video',
        fields: [{ id: 'url', label: 'Video URL', type: 'url', required: true }]
      });

      if (url) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '1rem 0';
        wrapper.style.textAlign = 'center';
        
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.display = 'inline-block';
        
        wrapper.appendChild(video);

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
      const data = await this.editor.modal.prompt({
        title: 'Insert Table',
        fields: [
          { id: 'rows', label: 'Rows', type: 'number', value: '2', required: true },
          { id: 'cols', label: 'Columns', type: 'number', value: '2', required: true }
        ]
      });

      if (data && data.rows && data.cols) {
        const table = document.createElement('table');
        table.style.border = '1px solid #ccc';
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        for (let i = 0; i < parseInt(data.rows); i++) {
          const tr = document.createElement('tr');
          for (let j = 0; j < parseInt(data.cols); j++) {
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

  _insertCodeBlock() {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = 'Enter your code here...';
    code.style.fontFamily = 'monospace';
    pre.appendChild(code);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(pre);
    }
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
      const char = await this.editor.modal.prompt({
        title: 'Insert Special Character',
        fields: [{ id: 'char', label: 'Character', type: 'text', value: '©', required: true }]
      });
      if (char) {
        document.execCommand('insertText', false, char);
      }
    } catch (e) {
      console.log('Special char insertion cancelled');
    }
  }
}
