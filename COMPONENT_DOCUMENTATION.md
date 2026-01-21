# Rich Text Editor (RTE) - Advanced Component Documentation

## Project Structure

```
RTE-Component/main/
├── rte-package/              # Standalone NPM Package
│   ├── src/
│   │   ├── index.js          # Main entry point (exports RTE class)
│   │   ├── editor.js         # Core RTE class with full configuration
│   │   ├── toolbar.js        # Toolbar builder with component integration
│   │   ├── components/
│   │   │   └── builder.js    # Component builders (buttons, selects, etc.)
│   │   ├── commands/
│   │   │   └── handler.js    # Command execution and history management
│   │   ├── state/
│   │   │   └── manager.js    # Button state and formatting state tracking
│   │   ├── utils/
│   │   │   └── sanitizer.js  # HTML sanitization utility
│   │   └── styles/
│   │       ├── main.css      # Core editor and content styling
│   │       └── components.css # Advanced component states
│   └── package.json
│
└── rte-demo/                 # Implementation/Demo Project
    ├── index.html            # Demo application HTML
    ├── main.js               # Demo configuration and setup
    └── package.json
```

## Component Architecture

### 1. **Button Component** (`components/builder.js`)
```javascript
createButton({
  label: 'Bold',
  icon: '<b>B</b>',
  command: 'bold',
  onclick: handler
})
```

**States:**
- `inactive` - Default transparent state
- `hover` - Light gray background with subtle shadow
- `focus` - Blue outline for keyboard navigation (WCAG AA compliant)
- `active` - Primary color background (aria-pressed="true")
- `disabled` - Reduced opacity, disabled cursor

### 2. **Select/Dropdown Component**
```javascript
createSelect({
  label: 'Heading',
  command: 'formatBlock',
  options: [
    { label: 'Paragraph', value: 'p' },
    { label: 'H1', value: 'h1' }
  ]
})
```

**States:**
- Default: Transparent border
- Hover: Light background, darker border
- Focus: Primary color outline + shadow
- Disabled: Grayed out, cursor not-allowed

### 3. **Color Picker Component**
```javascript
createColorPicker({
  label: 'Text Color',
  command: 'foreColor',
  value: '#000000'
})
```

**Features:**
- Native HTML5 color input
- 32x32px size for toolbar consistency
- Hover effect with border highlight
- Focus ring for accessibility

### 4. **Range Slider Component**
```javascript
createRangeSlider({
  label: 'Line Height',
  command: 'lineHeight',
  min: '0.8',
  max: '1.5',
  step: '0.1'
})
```

**Features:**
- Custom styled thumb (circular, primary color)
- Hover/focus states
- Smooth value transitions

### 5. **Modal Component**
```javascript
createModal({
  title: 'Insert Link',
  content: '<input type="text" placeholder="URL">',
  buttons: [
    { label: 'Insert', onclick: handler }
  ]
})
```

**Features:**
- Backdrop click to close
- Accessibility attributes (role="dialog", aria-modal)
- Slide-up animation
- Focus trap (keyboard navigation)

## CSS State Management (BEM Methodology)

### Button States
```css
/* Inactive (default) */
.rte__btn {
  background: transparent;
  border: 1px solid transparent;
}

/* Hover */
.rte__btn:hover:not(:disabled) {
  background-color: #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Focus (keyboard navigation) */
.rte__btn:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

/* Active (pressed) */
.rte__btn--active,
.rte__btn[aria-pressed="true"] {
  background-color: #007bff;
  color: white;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Disabled */
.rte__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Command Handler Features

### Clipboard Actions
- **undo** - Reverts to previous state (up to 50 history entries)
- **redo** - Restores next state
- **cut** - Native cut operation
- **copy** - Native copy operation
- **paste** - Smart paste with sanitization
- **pasteAsPlainText** - Removes all formatting

### Text Formatting
- **bold** - Ctrl+B
- **italic** - Ctrl+I
- **underline** - Ctrl+U
- **strikeThrough** - Strike through text
- **superscript** - Raise text above line
- **subscript** - Lower text below line
- **code** - Inline code styling
- **clearFormatting** - Remove all applied styles

### Text Case Transformation
- **uppercase** - Convert to UPPERCASE
- **lowercase** - Convert to lowercase
- **sentenceCase** - Capitalize first letter

### Paragraph & Layout
- **formatBlock** - Change paragraph type (p, h1-h6, blockquote)
- **insertUnorderedList** - Bullet list
- **insertOrderedList** - Numbered list
- **alignLeft** - Justify left
- **alignCenter** - Center align
- **alignRight** - Right align
- **alignJustify** - Full justify
- **indent** - Increase indentation
- **outdent** - Decrease indentation
- **insertBlockquote** - Block quote
- **insertHorizontalRule** - Horizontal line (hr)

### Advanced Inserts
- **createLink** - Insert hyperlink with URL/text
- **insertImage** - Insert image with alt text
- **insertAudio** - Embed audio file with controls
- **insertVideo** - Embed video with controls
- **insertTable** - Create table with rows/cols
- **insertCodeBlock** - Pre-formatted code block
- **insertEmoji** - Insert emoji character
- **insertSpecialChar** - Insert special characters (©®™€)

### Typography
- **fontName** - Change font family
- **fontSize** - Change font size (1-7)
- **lineHeight** - Adjust line height spacing
- **foreColor** - Text color picker
- **backColor** - Highlight/background color

### View Modes
- **toggleSource** - Switch between WYSIWYG and source code editing
- **toggleFullscreen** - Expand editor to full screen

## State Manager

The `StateManager` class tracks real-time formatting state:

```javascript
// Update button states based on current selection
stateManager.updateButtonStates()

// Check if a format is active
const isBold = stateManager.isActive('bold')

// Manually set button state
stateManager.setButtonState('bold', true)

// Disable buttons
stateManager.disableButton('undo', true)
```

## Configuration-Driven Architecture

### Full Toolbar Configuration Example

```javascript
const editor = new RTE('editor-container', {
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
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' }
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
            { label: 'Georgia', value: 'Georgia' }
          ]
        },
        { type: 'color', label: 'Text Color', command: 'foreColor' }
      ]
    }
  ]
});
```

## Accessibility Features (WCAG AA)

✅ **Semantic HTML**
- `<header>` for toolbar
- `<main>` for content editor
- Role attributes for groups and dialogs

✅ **ARIA Support**
- `aria-label` on all buttons and controls
- `aria-pressed` for toggle state
- `aria-multiline="true"` on editor
- `aria-modal` on dialogs

✅ **Keyboard Navigation**
- Tab through toolbar controls
- Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y shortcuts
- Focus-visible states for all interactive elements
- Escape to close dialogs

✅ **Color Contrast**
- Minimum 4.5:1 contrast ratio for text
- Clear distinction between states

✅ **Screen Reader Support**
- Descriptive labels on all controls
- Status updates via aria-live regions
- Form inputs with proper labels

## CSS Variables for Theming

```css
:root {
  --color-primary: #007bff;
  --color-bg: #ffffff;
  --color-border: #ced4da;
  --color-text: #212529;
  --color-light: #f8f9fa;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --font-size-base: 1rem;
  --font-family-base: -apple-system, BlinkMacSystemFont, ...;
}
```

Override these variables to customize the editor theme globally.

## Usage in Demo

```javascript
import RTE from '../rte-package/src/index.js';

// Create editor instance
const editor = new RTE('editor-container', { toolbar: [...] });

// Get sanitized content
const html = editor.getContent();

// Set content programmatically
editor.setContent('<h1>Hello</h1>');

// Clear content
editor.clearContent();

// Toggle source view
editor.toggleSource();

// Toggle fullscreen
editor.toggleFullscreen();

// Focus editor
editor.focus();

// Destroy instance
editor.destroy();
```

## Performance Optimizations

✅ **Minimal Dependencies** - Pure vanilla JavaScript, no frameworks
✅ **Event Delegation** - Efficient toolbar event handling
✅ **History Management** - Limited to 50 entries to prevent memory bloat
✅ **Smart Sanitization** - Real-time HTML cleaning without frameworks
✅ **CSS Performance** - BEM methodology for specificity and efficiency
✅ **Load Time** - <2 seconds on modern browsers

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Security

- HTML sanitization removes `<script>` tags and `on*` attributes
- XSS protection via sanitized output
- Content validation before insertion
- Safe iframe/media handling

---

**Built with vanilla JavaScript, no frameworks, 100% configuration-driven, fully accessible & secure.**
