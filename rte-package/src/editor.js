import { createToolbar } from './toolbar.js';
import { sanitizeHTML } from './utils/sanitizer.js';
import { CommandHandler } from './commands/handler.js';
import { StateManager } from './state/manager.js';
import { ModalManager } from './components/modal-manager.js';
import { DraggableImage } from './components/draggable-image.js';
import { QuickToolbar } from './components/quick-toolbar.js';
import {
  DEFAULT_TOOLBAR,
  DEFAULT_BUBBLE_TOOLBAR,
  DEFAULT_EDITOR_OPTIONS,
  DEFAULT_PASTE_CLEANUP,
  mergeConfig
} from './config/defaults.js';

export class RTE {
  constructor(containerId, config = {}, modules = []) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.modules = modules; // Store enabled modules
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
      ...DEFAULT_EDITOR_OPTIONS,
      autosave: {
        enabled: true,
        delay: 5000,
        key: `rte_autosave_${this.container.id || 'default'}`
      },
      versionHistory: {
        enabled: true,
        maxVersions: 20,
        key: `rte_history_${this.container.id || 'default'}`
      },
      toolbar: DEFAULT_TOOLBAR
    };

    // special handling for toolbar merging
    if (userConfig.toolbar && Array.isArray(userConfig.toolbar)) {
      const defaultToolbar = defaultConfig.toolbar || [];
      const userToolbar = userConfig.toolbar;

      // Create a map of default groups for easy lookup
      const groupMap = new Map(defaultToolbar.map(g => [g.group, g]));

      userToolbar.forEach(userGroup => {
        if (groupMap.has(userGroup.group)) {
          // If group exists, decide how to merge. 
          // For simplicity in this specific request context (user expects merging), 
          // let's override the default group with the user's group completely,
          // effectively allowing them to customize specific groups while keeping others?
          // OR, do they want to KEEP other default groups and just REPLACE this one?
          // The standard mergeConfig overwrites the WHOLE array. 
          // Smart merging: Update existing group, keep others.
          groupMap.set(userGroup.group, userGroup);
        } else {
          // New group, append it (or should we respect order?)
          // For now, let's just add it to the map.
          groupMap.set(userGroup.group, userGroup);
        }
      });

      // Convert back to array. Note: This loses original order of user's new groups relative to defaults if we just use values(), 
      // but typically customized groups replace default ones in place.
      // However, if user provided a toolbar, they might want ONLY what they provided?
      // The user asked "why it not merging with the default". This implies they expected their custom 'clipboard' formatting to be APPLIED, but presumably other defaults to disappear? 
      // No, "merging with default" usually means "keep defaults, but update this part".
      // So if they provided ONE group, they probably want the OTHER default groups to stay.

      // Reconstruct toolbar: Start with defaults, replace matches, append new.
      const mergedToolbar = defaultToolbar.map(g => {
        const userGroup = userToolbar.find(ug => ug.group === g.group);
        return userGroup ? userGroup : g;
      });

      // Add completely new groups from user
      userToolbar.forEach(ug => {
        if (!defaultToolbar.find(dg => dg.group === ug.group)) {
          mergedToolbar.push(ug);
        }
      });

      userConfig.toolbar = mergedToolbar;
    }

    const merged = mergeConfig(userConfig, defaultConfig);

    // Ensure pasteCleanup defaults exist only if PasteCleanup module is enabled
    if (this.modules && this.modules.includes('PasteCleanup')) {
      merged.pasteCleanup = mergeConfig(userConfig.pasteCleanup || {}, DEFAULT_PASTE_CLEANUP);
    }

    return merged;
  }

  _init() {
    this.container.classList.add('rte');

    // Create Toolbar
    this.toolbar = createToolbar(this.config, {
      execute: (cmd, val) => this.commandHandler.execute(cmd, val)
    });
    this.container.appendChild(this.toolbar);

    // Initialize custom theme structure
    this._initCustomTheme();

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

    // Create Selection Bubble Toolbar
    this._createBubbleToolbar(wrapper);

    this.container.appendChild(wrapper);

    // Initialize DraggableImage
    this.draggableImage = new DraggableImage(this);

    // Initialize QuickToolbar after DOM is ready
    this.quickToolbar = new QuickToolbar(this);

    // Initialize dirty flag for autosave
    this.isDirty = false;

    // Recover content from autosave if enabled
    if (this.config.autosave.enabled) {
      this._recoverContent();
      this._startAutosaveInterval();
    }

    // Save initial state to history
    this.commandHandler.saveState();

    this._bindEvents();
  }

  _initCustomTheme() {
    // Create a style element for custom themes if it doesn't exist
    if (!document.getElementById('rte-custom-theme')) {
      const style = document.createElement('style');
      style.id = 'rte-custom-theme';
      document.head.appendChild(style);
      this.customThemeStyle = style;
    } else {
      this.customThemeStyle = document.getElementById('rte-custom-theme');
    }
  }

  _recoverContent() {
    const saved = localStorage.getItem(this.config.autosave.key);
    if (saved) {
      this.editor.innerHTML = this.sanitizer(saved);
    }
  }

  _startAutosaveInterval() {
    // Clear any existing interval
    if (this._autosaveInterval) clearInterval(this._autosaveInterval);

    // Set up new interval
    this._autosaveInterval = setInterval(() => {
      this._handleAutosave();
    }, this.config.autosave.delay);
  }

  _handleAutosave() {
    if (!this.config.autosave.enabled || !this.isDirty) return;

    const content = this.editor.innerHTML;
    localStorage.setItem(this.config.autosave.key, content);
    this.isDirty = false;

    // Also potentially save a version snapshot if enough time has passed
    this._autoSnapshot();
  }

  _autoSnapshot() {
    if (!this.config.versionHistory.enabled) return;

    const now = Date.now();
    const lastSnapshot = parseInt(localStorage.getItem(this.config.versionHistory.key + '_last') || '0');

    // Auto-snapshot every 5 minutes if there are changes
    if (now - lastSnapshot > 5 * 60 * 1000) {
      this._saveSnapshot('Auto-save');
    }
  }

  _saveSnapshot(label = 'Manual Save', type = 'auto') {
    if (!this.config.versionHistory.enabled) return;

    const content = this.editor.innerHTML;
    const snapshots = JSON.parse(localStorage.getItem(this.config.versionHistory.key) || '[]');

    const newSnapshot = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      label: label,
      type: type,
      content: content
    };

    snapshots.unshift(newSnapshot);

    // Limit snapshots
    const limitedSnapshots = snapshots.slice(0, this.config.versionHistory.maxVersions);

    localStorage.setItem(this.config.versionHistory.key, JSON.stringify(limitedSnapshots));
    localStorage.setItem(this.config.versionHistory.key + '_last', Date.now().toString());
  }

  _getSnapshots() {
    return JSON.parse(localStorage.getItem(this.config.versionHistory.key) || '[]');
  }

  getContent() {
    if (this.isSourceMode) {
      return this.sourceView.value;
    }
    return this.editor.innerHTML;
  }

  setContent(content, preventSave = false) {
    const sanitized = this.sanitizer(content);
    if (this.isSourceMode) {
      this.sourceView.value = sanitized;
    }
    this.editor.innerHTML = sanitized;

    // Save snapshot on manual setContent
    if (this.config.versionHistory.enabled && !preventSave) {
      this._saveSnapshot('Loaded Content');
    }

    // Also update history if not triggered by undo/redo
    if (!preventSave) {
      this.commandHandler.saveState();
    }
  }

  _createBubbleToolbar(wrapper) {
    const bubble = document.createElement('div');
    bubble.className = 'rte__bubble-toolbar';
    bubble.style.cssText = `
      position: absolute;
      display: none;
      background: #1a1a1a;
      border-radius: 6px;
      padding: 6px 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      gap: 2px;
      align-items: center;
      transform: translateX(-50%);
    `;

    // Bubble toolbar items - minimal formatting tools
    const bubbleItems = DEFAULT_BUBBLE_TOOLBAR;

    bubbleItems.forEach(item => {
      if (item.type === 'separator') {
        const sep = document.createElement('span');
        sep.style.cssText = 'width: 1px; height: 20px; background: #444; margin: 0 4px;';
        bubble.appendChild(sep);
        return;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = item.icon;
      btn.title = item.label;
      btn.dataset.command = item.command;
      btn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 6px 10px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 4px;
        transition: background 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
      `;
      btn.onmouseenter = () => btn.style.background = '#333';
      btn.onmouseleave = () => btn.style.background = 'transparent';
      btn.onmousedown = (e) => {
        e.preventDefault(); // Prevent losing selection
        this.commandHandler.execute(item.command);
        this._hideBubbleToolbar();
      };
      bubble.appendChild(btn);
    });

    // Arrow pointer
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #1a1a1a;
    `;
    bubble.appendChild(arrow);

    this.bubbleToolbar = bubble;
    wrapper.appendChild(bubble);
  }

  _showBubbleToolbar() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
      this._hideBubbleToolbar();
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const wrapperRect = this.editor.parentElement.getBoundingClientRect();

    // Position bubble above the selection
    const left = rect.left + rect.width / 2 - wrapperRect.left;
    const top = rect.top - wrapperRect.top - 50; // 50px above selection

    this.bubbleToolbar.style.left = `${left}px`;
    this.bubbleToolbar.style.top = `${Math.max(10, top)}px`;
    this.bubbleToolbar.style.display = 'flex';
  }

  _hideBubbleToolbar() {
    if (this.bubbleToolbar) {
      this.bubbleToolbar.style.display = 'none';
    }
  }

  _bindEvents() {
    let debounceTimer;

    this.editor.addEventListener('input', () => {
      this.isDirty = true;

      // Debounce history save
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (this.commandHandler && typeof this.commandHandler.saveState === 'function') {
          this.commandHandler.saveState();
        }
      }, 500); // 500ms debounce for typing
    });

    // Ensure autosave happens on page unload/refresh
    window.addEventListener('beforeunload', () => {
      this._handleAutosave();
    });

    this.editor.addEventListener('keydown', (e) => {
      // Hide quick toolbar when typing (except for modifier keys)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        this.quickToolbar.hide();
      }

      // Check if we're inside a checklist
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;

        // Find if we're inside a checklist item
        let checklistItem = null;
        let checklist = null;
        while (node && node !== this.editor) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'LI' && node.closest('.rte-checklist')) {
              checklistItem = node;
              checklist = node.closest('.rte-checklist');
              break;
            }
          }
          node = node.parentNode;
        }

        // Handle checklist-specific keys
        if (checklistItem && checklist) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._addChecklistItem(checklistItem, checklist);
            return;
          }

          if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
              this._outdentChecklistItem(checklistItem);
            } else {
              this._indentChecklistItem(checklistItem);
            }
            return;
          }

          if (e.key === 'Backspace') {
            const textContent = checklistItem.textContent.trim();
            const checkbox = checklistItem.querySelector('input[type="checkbox"]');
            const textOnly = textContent.replace(checkbox ? '' : '', '').trim();

            if (textOnly === '' || textOnly === 'List item') {
              const prevItem = checklistItem.previousElementSibling;
              if (prevItem) {
                e.preventDefault();
                checklistItem.remove();

                // Focus previous item
                const prevSpan = prevItem.querySelector('span');
                if (prevSpan) {
                  const newRange = document.createRange();
                  newRange.selectNodeContents(prevSpan);
                  newRange.collapse(false);
                  selection.removeAllRanges();
                  selection.addRange(newRange);
                }
              }
            }
          }
        }
      }

      // Standard keyboard shortcuts
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
      // Show bubble toolbar if text is selected
      setTimeout(() => this._showBubbleToolbar(), 10);
    });

    this.editor.addEventListener('keyup', (e) => {
      this.stateManager.updateButtonStates();
      // Show bubble toolbar on shift+arrow selection
      if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        setTimeout(() => this._showBubbleToolbar(), 10);
      } else if (!e.shiftKey) {
        this._hideBubbleToolbar();
      }
    });

    // Hide bubble toolbar when clicking outside editor
    document.addEventListener('mousedown', (e) => {
      if (!this.container.contains(e.target)) {
        this._hideBubbleToolbar();
      }
    });

    // Hide bubble toolbar when selection is cleared
    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (selection.isCollapsed || !this.editor.contains(selection.anchorNode)) {
        this._hideBubbleToolbar();
      }
    });

    this.editor.addEventListener('paste', (e) => {
      // Only handle paste cleanup if PasteCleanup module is enabled
      if (this.modules && this.modules.includes('PasteCleanup')) {
        try {
          e.preventDefault();
        } catch (err) { }
        this.commandHandler.handlePasteEvent(e);
      }
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

  _addChecklistItem(currentItem, checklist) {
    const checkboxType = checklist.dataset.checkboxType || 'checkbox';
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'flex-start';
    li.style.marginBottom = '0.5rem';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = `rte-checkbox rte-checkbox--${checkboxType}`;
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
    textSpan.innerHTML = '<br>';

    li.appendChild(checkbox);
    li.appendChild(textSpan);

    // Insert after current item
    if (currentItem.nextSibling) {
      currentItem.parentNode.insertBefore(li, currentItem.nextSibling);
    } else {
      currentItem.parentNode.appendChild(li);
    }

    // Focus the new item
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(textSpan);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  _indentChecklistItem(item) {
    const prevSibling = item.previousElementSibling;
    if (!prevSibling) return;

    // Check if previous sibling already has a nested list
    let nestedList = prevSibling.querySelector('ul.rte-checklist');
    if (!nestedList) {
      nestedList = document.createElement('ul');
      nestedList.className = 'rte-checklist rte-checklist--nested';
      nestedList.style.listStyleType = 'none';
      nestedList.style.paddingLeft = '1.5rem';
      nestedList.style.marginTop = '0.5rem';
      prevSibling.appendChild(nestedList);
    }

    nestedList.appendChild(item);
  }

  _outdentChecklistItem(item) {
    const parentList = item.parentNode;
    if (!parentList.classList.contains('rte-checklist--nested')) return;

    const grandparentItem = parentList.parentNode;
    const grandparentList = grandparentItem.parentNode;

    // Move item after grandparent item
    grandparentList.insertBefore(item, grandparentItem.nextSibling);

    // Remove empty nested list
    if (parentList.children.length === 0) {
      parentList.remove();
    }
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
    } else if (command === 'uploadTheme') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.css';
      input.style.display = 'none';

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const cssContent = event.target.result;
            if (this.customThemeStyle) {
              this.customThemeStyle.textContent = cssContent;
              // Optional: Provide feedback or notification
              console.log('Custom theme applied');
            }
          };
          reader.readAsText(file);
        }
      };

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
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

  // getContent() and setContent() are already defined above

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
