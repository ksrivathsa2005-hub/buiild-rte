/**
 * RTE Default Configuration
 * All hardcoded values extracted here for maximum configurability
 */

export const DEFAULT_TOOLBAR = [
  {
    group: 'clipboard',
    items: [
      { type: 'button', label: 'Undo', command: 'undo', icon: '<i class="fas fa-undo"></i>' },
      { type: 'button', label: 'Redo', command: 'redo', icon: '<i class="fas fa-redo"></i>' },
      { type: 'button', label: 'Cut', command: 'cut', icon: '<i class="fas fa-cut"></i>' },
      { type: 'button', label: 'Copy', command: 'copy', icon: '<i class="fas fa-copy"></i>' },
      {
        type: 'select',
        label: 'Paste',
        command: 'paste',
        options: [
          { label: 'Paste', value: 'default' },
          { label: 'Paste from Word', value: 'word' },
          { label: 'Paste as Plain Text', value: 'plain' }
        ]
      }
    ]
  }

];

export const DEFAULT_BUBBLE_TOOLBAR = [
  { label: 'Bold', command: 'bold', icon: '<b>B</b>' },
  { label: 'Italic', command: 'italic', icon: '<i>I</i>' },
  { label: 'Underline', command: 'underline', icon: '<u>U</u>' },
  { label: 'Strikethrough', command: 'strikeThrough', icon: '<s>S</s>' },
  { type: 'separator' },
  { label: 'Link', command: 'createLink', icon: '🔗' },
  { label: 'Code', command: 'code', icon: '{ }' }
];

export const DEFAULT_QUICK_TOOLBAR_OPTIONS = {
  image: {
    enabled: true,
    alignments: ['left', 'center', 'right', 'inline'],
    showDelete: true,
    showEdit: true
  },
  table: {
    enabled: true,
    showInsertRow: true,
    showInsertColumn: true,
    showDelete: true
  }
};

export const DEFAULT_THEME = {
  colors: {
    primary: '#007bff',
    primaryLight: '#e3f2fd',
    text: '#2c3e50',
    textLight: '#495057',
    border: '#ddd',
    borderLight: '#e0e3e7',
    background: '#ffffff',
    backgroundLight: '#f5f5f5',
    hover: '#000000',
    active: '#ffffff',
    danger: '#dc3545',
    success: '#28a745',
    warning: '#ffc107'
  },
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px'
  },
  fonts: {
    primary: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    monospace: 'Courier New, Consolas, Monaco, monospace'
  },
  borderRadius: {
    sm: '3px',
    md: '4px',
    lg: '6px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 2px 6px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.2)'
  }
};

export const DEFAULT_I18N = {
  en: {
    // Toolbar tooltips
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    print: 'Print',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    superscript: 'Superscript',
    subscript: 'Subscript',
    code: 'Inline Code',
    clearFormatting: 'Clear Formatting',
    uppercase: 'UPPERCASE',
    lowercase: 'lowercase',
    sentenceCase: 'Sentence case',
    heading: 'Heading',
    bullets: 'Bullets',
    numbers: 'Numbers',
    blockquote: 'Blockquote',
    hr: 'Horizontal Rule',
    align: 'Align',
    indent: 'Increase Indent',
    outdent: 'Decrease Indent',
    link: 'Insert Link',
    unlink: 'Remove Link',
    image: 'Insert Image',
    audio: 'Insert Audio',
    video: 'Insert Video',
    table: 'Insert Table',
    codeBlock: 'Code Block',
    emoji: 'Insert Emoji',
    specialChar: 'Special Character',
    font: 'Font Family',
    fontSize: 'Font Size',
    textColor: 'Text Color',
    highlight: 'Highlight Color',
    lineHeight: 'Line Height',
    source: 'Source Code',
    fullscreen: 'Fullscreen',

    // Modal dialogs
    insertLink: 'Insert Link',
    linkUrl: 'URL',
    linkText: 'Link Text',
    linkTitle: 'Title (optional)',
    linkTarget: 'Open in new window',
    insert: 'Insert',
    cancel: 'Cancel',
    update: 'Update',

    insertImage: 'Insert Image',
    imageUrl: 'Image URL',
    imageAlt: 'Alt Text',
    imageWidth: 'Width',
    imageHeight: 'Height',

    insertVideo: 'Insert Video',
    videoUrl: 'Video URL or Embed Code',

    insertAudio: 'Insert Audio',
    audioUrl: 'Audio URL',

    insertTable: 'Insert Table',
    tableRows: 'Rows',
    tableColumns: 'Columns',
    tableHeader: 'Include Header Row',

    insertEmoji: 'Insert Emoji',
    selectEmoji: 'Select an emoji',

    insertSpecialChar: 'Insert Special Character',
    selectChar: 'Select a character',

    // Messages
    pleaseEnterUrl: 'Please enter a valid URL',
    pleaseSelectText: 'Please select text first',
    noTextSelected: 'No text selected',
    confirmDelete: 'Are you sure you want to delete this?',

    // Quick toolbar
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignInline: 'Inline with Text',
    edit: 'Edit',
    delete: 'Delete',
    insertRowAbove: 'Insert Row Above',
    insertRowBelow: 'Insert Row Below',
    insertColumnLeft: 'Insert Column Left',
    insertColumnRight: 'Insert Column Right',
    deleteRow: 'Delete Row',
    deleteColumn: 'Delete Column',
    deleteTable: 'Delete Table'
  }
};

export const DEFAULT_FEATURES = {
  toolbar: true,
  bubbleToolbar: true,
  quickToolbar: true,
  draggableImages: true,
  modals: true,
  sourceView: true,
  fullscreen: true,
  undoRedo: true,
  stateTracking: true,
  sanitizer: true
};

export const DEFAULT_EDITOR_OPTIONS = {
  placeholder: 'Start typing...',
  readOnly: false,
  minHeight: '200px',
  maxHeight: null,
  autoFocus: false,
  spellCheck: true,
  contentEditable: true
};

export const DEFAULT_PASTE_CLEANUP = {
  formatOption: 'cleanFormat', // 'prompt', 'plainText', 'keepFormat', 'cleanFormat'
  deniedTags: [],
  deniedAttributes: [],
  allowedStyleProperties: []
};

export const DEFAULT_CSS_CLASSES = {
  container: 'rte',
  toolbar: 'rte__toolbar',
  toolbarGroup: 'rte__toolbar-group',
  content: 'rte__content',
  wrapper: 'rte__wrapper',
  source: 'rte__source',
  button: 'rte__btn',
  buttonActive: 'rte__btn--active',
  select: 'rte__select',
  selectWrapper: 'rte__select-wrapper',
  colorPicker: 'rte__color-picker',
  colorWrapper: 'rte__color-wrapper',
  modal: 'rte__modal',
  modalOverlay: 'rte__modal-overlay',
  modalContent: 'rte__modal-content',
  bubbleToolbar: 'rte__bubble-toolbar',
  quickToolbar: 'rte__quick-toolbar'
};

/**
 * Merges user config with defaults recursively
 */
export function mergeConfig(userConfig = {}, defaults = {}) {
  const merged = { ...defaults };

  for (const key in userConfig) {
    if (userConfig[key] && typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
      merged[key] = mergeConfig(userConfig[key], defaults[key] || {});
    } else {
      merged[key] = userConfig[key];
    }
  }

  return merged;
}
