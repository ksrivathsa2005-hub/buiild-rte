/**
 * RTE Configuration Examples
 * Shows various toolbar configurations for different use cases
 */

// ============================================
// MINIMAL EDITOR - Blog Comments
// ============================================
export const minimalConfig = {
  toolbar: [
    {
      group: 'formatting',
      items: [
        { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' },
        { type: 'button', label: 'Underline', command: 'underline', icon: '<u>U</u>' }
      ]
    },
    {
      group: 'paragraph',
      items: [
        { type: 'button', label: 'Bullet List', command: 'insertUnorderedList', icon: '•' },
        { type: 'button', label: 'Link', command: 'createLink', icon: '🔗' }
      ]
    }
  ]
};

// ============================================
// CONTENT CREATOR - Blog Posts & Articles
// ============================================
export const contentCreatorConfig = {
  toolbar: [
    {
      group: 'clipboard',
      items: [
        { type: 'button', label: 'Undo', command: 'undo', icon: '⟲' },
        { type: 'button', label: 'Redo', command: 'redo', icon: '⟳' }
      ]
    },
    {
      group: 'formatting',
      items: [
        { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' },
        { type: 'button', label: 'Underline', command: 'underline', icon: '<u>U</u>' },
        { type: 'button', label: 'Clear', command: 'clearFormatting', icon: '⊘' }
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
            { label: 'H3', value: 'h3' }
          ]
        },
        { type: 'button', label: 'Bullet List', command: 'insertUnorderedList', icon: '•' },
        { type: 'button', label: 'Numbered List', command: 'insertOrderedList', icon: '1.' },
        { type: 'button', label: 'Blockquote', command: 'insertBlockquote', icon: '❝' }
      ]
    },
    {
      group: 'insert',
      items: [
        { type: 'button', label: 'Link', command: 'createLink', icon: '🔗' },
        { type: 'button', label: 'Image', command: 'insertImage', icon: '🖼' }
      ]
    },
    {
      group: 'view',
      items: [
        { type: 'button', label: 'Source', command: 'toggleSource', icon: 'Source' }
      ]
    }
  ]
};

// ============================================
// PROFESSIONAL - Marketing & Documentation
// ============================================
export const professionalConfig = {
  toolbar: [
    {
      group: 'clipboard',
      items: [
        { type: 'button', label: 'Undo', command: 'undo', icon: '⟲' },
        { type: 'button', label: 'Redo', command: 'redo', icon: '⟳' },
        { type: 'button', label: 'Cut', command: 'cut', icon: '✂' },
        { type: 'button', label: 'Copy', command: 'copy', icon: '📋' },
        { type: 'button', label: 'Paste', command: 'paste', icon: '📌' }
      ]
    },
    {
      group: 'formatting',
      items: [
        { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' },
        { type: 'button', label: 'Underline', command: 'underline', icon: '<u>U</u>' },
        { type: 'button', label: 'Strikethrough', command: 'strikeThrough', icon: '<s>S</s>' },
        { type: 'button', label: 'Clear', command: 'clearFormatting', icon: '⊘' }
      ]
    },
    {
      group: 'textCase',
      items: [
        { type: 'button', label: 'UPPERCASE', command: 'uppercase', icon: 'A' },
        { type: 'button', label: 'lowercase', command: 'lowercase', icon: 'a' }
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
        { type: 'button', label: 'Blockquote', command: 'insertBlockquote', icon: '❝' }
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
      group: 'insert',
      items: [
        { type: 'button', label: 'Link', command: 'createLink', icon: '🔗' },
        { type: 'button', label: 'Image', command: 'insertImage', icon: '🖼' },
        { type: 'button', label: 'Table', command: 'insertTable', icon: '▦' }
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
            { label: 'Arial', value: 'Arial' },
            { label: 'Georgia', value: 'Georgia' },
            { label: 'Verdana', value: 'Verdana' }
          ]
        },
        {
          type: 'select',
          label: 'Size',
          command: 'fontSize',
          options: [
            { label: 'Small', value: '2' },
            { label: 'Normal', value: '3' },
            { label: 'Large', value: '5' },
            { label: 'Extra Large', value: '7' }
          ]
        },
        { type: 'color', label: 'Text Color', command: 'foreColor' },
        { type: 'color', label: 'Highlight', command: 'backColor' }
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

// ============================================
// FULL-FEATURED - Complete Content Platform
// ============================================
export const fullFeatureConfig = {
  toolbar: [
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
        { type: 'button', label: 'Clear', command: 'clearFormatting', icon: '⊘' }
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
            { label: 'Arial', value: 'Arial' },
            { label: 'Verdana', value: 'Verdana' },
            { label: 'Times New Roman', value: 'Times New Roman' },
            { label: 'Courier New', value: 'Courier New' },
            { label: 'Georgia', value: 'Georgia' }
          ]
        },
        {
          type: 'select',
          label: 'Size',
          command: 'fontSize',
          options: [
            { label: 'Small', value: '2' },
            { label: 'Normal', value: '3' },
            { label: 'Large', value: '5' },
            { label: 'Extra Large', value: '7' }
          ]
        },
        { type: 'color', label: 'Text Color', command: 'foreColor' },
        { type: 'color', label: 'Highlight', command: 'backColor' },
        {
          type: 'select',
          label: 'Line Height',
          command: 'lineHeight',
          options: [
            { label: '1.0', value: '1' },
            { label: '1.2', value: '1.2' },
            { label: '1.5', value: '1.5' },
            { label: '1.8', value: '1.8' },
            { label: '2.0', value: '2' }
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

// ============================================
// TECHNICAL - Code Documentation Editor
// ============================================
export const technicalConfig = {
  toolbar: [
    {
      group: 'clipboard',
      items: [
        { type: 'button', label: 'Undo', command: 'undo', icon: '⟲' },
        { type: 'button', label: 'Redo', command: 'redo', icon: '⟳' }
      ]
    },
    {
      group: 'formatting',
      items: [
        { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' },
        { type: 'button', label: 'Code', command: 'code', icon: '</>' }
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
            { label: 'H3', value: 'h3' }
          ]
        },
        { type: 'button', label: 'Bullet List', command: 'insertUnorderedList', icon: '•' },
        { type: 'button', label: 'Numbered List', command: 'insertOrderedList', icon: '1.' }
      ]
    },
    {
      group: 'insert',
      items: [
        { type: 'button', label: 'Link', command: 'createLink', icon: '🔗' },
        { type: 'button', label: 'Code Block', command: 'insertCodeBlock', icon: '{}' },
        { type: 'button', label: 'Table', command: 'insertTable', icon: '▦' }
      ]
    },
    {
      group: 'view',
      items: [
        { type: 'button', label: 'Source', command: 'toggleSource', icon: 'Source' }
      ]
    }
  ]
};

// ============================================
// PASTE CLEANUP - Advanced Content Processing
// ============================================
export const pasteCleanupConfig = {
  toolbar: [
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
        { type: 'button', label: 'Underline', command: 'underline', icon: '<u>U</u>' }
      ]
    },
    {
      group: 'view',
      items: [
        { type: 'button', label: 'Source', command: 'toggleSource', icon: 'Source' }
      ]
    }
  ],
  pasteCleanup: {
    formatOption: 'cleanFormat', // 'prompt', 'plainText', 'keepFormat', 'cleanFormat' (Word content automatically keeps format)
    deniedTags: ['script', 'style'], // Basic cleanup for non-Word content
    deniedAttributes: ['id', 'title', 'onclick'], // Remove problematic attributes
    allowedStyleProperties: ['color', 'margin', 'padding', 'font-size', 'text-align', 'font-weight', 'font-style'] // Allow common formatting
  }
};

// Usage with modules:
// const editor = new RTE('container', pasteCleanupConfig, ['PasteCleanup']);
