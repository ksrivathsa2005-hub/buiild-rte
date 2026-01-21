# RTE Integration Guide

## Quick Start

### 1. Install the Package

```bash
npm install ../rte-package
```

### 2. Import and Initialize

```javascript
import RTE from 'rte-package';

const editor = new RTE('editor-container');
```

### 3. Add HTML Container

```html
<div id="editor-container"></div>
```

### 4. Include Styles

```html
<link rel="stylesheet" href="rte-package/src/styles/main.css">
<link rel="stylesheet" href="rte-package/src/styles/components.css">
```

---

## Configuration

### Default Configuration

The editor comes with a comprehensive default toolbar. To use default:

```javascript
const editor = new RTE('editor-container');
```

### Custom Configuration

Override specific toolbar groups:

```javascript
const editor = new RTE('editor-container', {
  toolbar: [
    {
      group: 'formatting',
      items: [
        { type: 'button', label: 'Bold', command: 'bold', icon: '<b>B</b>' },
        { type: 'button', label: 'Italic', command: 'italic', icon: '<i>I</i>' }
      ]
    }
  ]
});
```

### Configuration Presets

Use pre-built configurations from `CONFIGURATION_EXAMPLES.js`:

```javascript
import { minimalConfig } from 'rte-package/config-examples';

const editor = new RTE('editor-container', minimalConfig);
```

Available presets:
- `minimalConfig` - Basic formatting only
- `contentCreatorConfig` - Blogging focused
- `professionalConfig` - Business documents
- `fullFeatureConfig` - All features enabled
- `technicalConfig` - Documentation

---

## API Methods

### `getContent()`
Returns sanitized HTML content

```javascript
const html = editor.getContent();
console.log(html);
// Output: <h1>Hello</h1><p>World</p>
```

### `setContent(html)`
Set editor content programmatically

```javascript
editor.setContent('<h1>New Content</h1>');
```

### `clearContent()`
Clear all editor content

```javascript
editor.clearContent();
```

### `toggleSource()`
Switch between WYSIWYG and source code view

```javascript
editor.toggleSource();
```

### `toggleFullscreen()`
Expand editor to full screen

```javascript
editor.toggleFullscreen();
```

### `focus()`
Set focus to the editor

```javascript
editor.focus();
```

### `destroy()`
Clean up and remove editor instance

```javascript
editor.destroy();
```

---

## Component Types

### Button Component

```javascript
{
  type: 'button',
  label: 'Bold',           // Tooltip and aria-label
  command: 'bold',         // Command to execute
  icon: '<b>B</b>',        // HTML or emoji
  className: 'custom-btn'  // Optional CSS class
}
```

### Select/Dropdown Component

```javascript
{
  type: 'select',
  label: 'Heading',
  command: 'formatBlock',
  options: [
    { label: 'Paragraph', value: 'p' },
    { label: 'H1', value: 'h1' }
  ]
}
```

### Color Picker Component

```javascript
{
  type: 'color',
  label: 'Text Color',
  command: 'foreColor'
}
```

### Range Slider Component

```javascript
{
  type: 'range',
  label: 'Line Height',
  command: 'lineHeight',
  min: '0.8',
  max: '2.0',
  step: '0.1',
  value: '1.6'
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |

---

## Styling & Customization

### Using CSS Variables

Override editor theme:

```css
:root {
  --color-primary: #667eea;
  --color-bg: #ffffff;
  --color-border: #e0e0e0;
  --color-text: #333;
  --font-family-base: 'Inter', sans-serif;
}
```

### Custom Button Styles

```css
.rte__btn {
  /* Your custom styles */
}

.rte__btn:hover {
  /* Hover state */
}

.rte__btn--active {
  /* Active state */
}
```

---

## Events & Callbacks

### Monitor Content Changes

```javascript
const editor = new RTE('editor-container');

// The editor uses contentEditable, so listen to input events
document.getElementById('editor-container').addEventListener('input', () => {
  const content = editor.getContent();
  // Handle content change
});
```

### Save on Interval

```javascript
setInterval(() => {
  const content = editor.getContent();
  // Save to database
  saveContent(content);
}, 5000);
```

---

## Accessibility

### Screen Reader Support

All toolbar buttons have:
- `aria-label` attributes
- Semantic HTML structure
- Proper ARIA roles

### Keyboard Navigation

- Tab through toolbar controls
- Ctrl+shortcuts for formatting
- Focus-visible states on all elements
- Escape to close dialogs

### Color Contrast

- 4.5:1 minimum contrast ratio
- Clear distinction between button states

---

## Security & Sanitization

### Output is Automatically Sanitized

The editor removes:
- `<script>` tags
- `on*` event attributes
- Dangerous CSS
- Malformed HTML

```javascript
// Safe to use in DOM
const content = editor.getContent();
element.innerHTML = content; // Already sanitized
```

### Custom Sanitization

To use your own sanitizer:

```javascript
const editor = new RTE('editor-container');
const customSanitized = customSanitizer(editor.getContent());
```

---

## Performance Tips

1. **Lazy Load the Editor**
   ```javascript
   // Load only when user clicks
   document.getElementById('trigger').onclick = () => {
     const editor = new RTE('editor-container');
   };
   ```

2. **Limit History Size**
   - Default: 50 entries
   - Configure in CommandHandler

3. **Debounce Save Operations**
   ```javascript
   let saveTimeout;
   editor.addEventListener('input', () => {
     clearTimeout(saveTimeout);
     saveTimeout = setTimeout(() => {
       save(editor.getContent());
     }, 1000);
   });
   ```

4. **Use Source View for Large Content**
   - Faster for editing large documents
   - Direct HTML manipulation

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full Support |
| Firefox | Latest | ✅ Full Support |
| Safari | Latest | ✅ Full Support |
| Edge | Latest | ✅ Full Support |
| IE 11 | - | ❌ Not Supported |

---

## Troubleshooting

### Editor not showing

1. Check if `#editor-container` exists
2. Verify CSS files are loaded
3. Check browser console for errors

### Formatting not working

1. Verify command name is correct
2. Check if editor has focus
3. Ensure content is selected

### Content not saving

1. Check `getContent()` returns HTML
2. Verify sanitizer is not removing important tags
3. Test with `console.log(editor.getContent())`

---

## Examples

### Simple Blog Editor

```html
<div id="editor"></div>

<script type="module">
  import RTE from 'rte-package';
  import { contentCreatorConfig } from 'rte-package/config';
  
  const editor = new RTE('editor', contentCreatorConfig);
  
  document.getElementById('save').onclick = () => {
    const content = editor.getContent();
    fetch('/api/blog/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  };
</script>
```

### Admin Panel

```html
<div id="admin-editor"></div>

<script type="module">
  import RTE from 'rte-package';
  import { fullFeatureConfig } from 'rte-package/config';
  
  const editor = new RTE('admin-editor', fullFeatureConfig);
  
  // Load existing content
  fetch('/api/content/1')
    .then(r => r.json())
    .then(data => editor.setContent(data.html));
</script>
```

### Comments Form

```html
<div id="comment-editor"></div>

<script type="module">
  import RTE from 'rte-package';
  import { minimalConfig } from 'rte-package/config';
  
  const editor = new RTE('comment-editor', minimalConfig);
  
  document.getElementById('post-comment').onclick = () => {
    const content = editor.getContent();
    if (content.trim().length === 0) return;
    
    postComment(content);
    editor.clearContent();
  };
</script>
```

---

## Support & Documentation

- Component Documentation: `COMPONENT_DOCUMENTATION.md`
- Configuration Examples: `CONFIGURATION_EXAMPLES.js`
- Demo Application: `rte-demo/`

For issues or questions, refer to the component documentation.

---

**RTE - Professional WYSIWYG Editor for Modern Web Applications**
