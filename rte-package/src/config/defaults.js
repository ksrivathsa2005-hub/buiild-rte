/**
 * RTE Default Configuration
 * All hardcoded values extracted here for maximum configurability
 */

export const DEFAULT_TOOLBAR = [
  {
    group: 'clipboard',
    items: [
      { type: 'button', label: 'Undo', command: 'undo', icon: '⟲' },
      { type: 'button', label: 'Redo', command: 'redo', icon: '⟳' },
      { type: 'button', label: 'Cut', command: 'cut', icon: '✂' },
      { type: 'button', label: 'Copy', command: 'copy', icon: '📋' },
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
      {
        type: 'select',
        label: 'Bullets',
        command: 'bulletStyle',
        options: [
          { label: '•', value: 'disc' },
          { label: '◦', value: 'circle' },
          { label: '▪', value: 'square' },
          { label: 'None', value: 'none' }
        ]
      },
      {
        type: 'select',
        label: 'Numbers',
        command: 'numberStyle',
        options: [
          { label: '1.', value: 'decimal' },
          { label: 'a.', value: 'lower-alpha' },
          { label: 'A.', value: 'upper-alpha' },
          { label: 'i.', value: 'lower-roman' },
          { label: 'I.', value: 'upper-roman' }
        ]
      },
      { type: 'button', label: 'Blockquote', command: 'insertBlockquote', icon: '❝' },
      { type: 'button', label: 'HR', command: 'insertHorizontalRule', icon: '─' }
    ]
  },
  {
    group: 'alignment',
    items: [
      {
        type: 'select',
        label: 'Align',
        command: 'align',
        options: [
          { label: '← Left', value: 'left' },
          { label: '↔ Center', value: 'center' },
          { label: '→ Right', value: 'right' },
          { label: '⇌ Justify', value: 'justify' }
        ]
      }
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
      { type: 'button', label: 'Fullscreen', command: 'toggleFullscreen', icon: '⛶' },
      { type: 'button', label: 'Print', command: 'print', icon: '🖨️' }
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
