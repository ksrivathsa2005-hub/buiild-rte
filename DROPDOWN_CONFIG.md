# RTE Dropdown Configuration Guide

## Overview
All dropdowns are now enhanced with professional Word-like styling and better user experience.

---

## 1. Font Name Dropdown
```javascript
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
}
```

**Current Status:** ✅ Configured
**Options:** 9 fonts available

---

## 2. Font Size Dropdown (with pt measurements)
```javascript
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
}
```

**Current Status:** ✅ Configured
**Options:** 7 sizes (8pt - 36pt)
**Display:** Shows pt measurements like Word

---

## 3. Heading/Paragraph Dropdown
```javascript
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
}
```

**Current Status:** ✅ Configured
**Options:** Paragraph + 6 Heading levels

---

## 4. Line Height Dropdown
```javascript
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
}
```

**Current Status:** ✅ Configured
**Options:** 7 line heights (1.0 - 3.0)

---

## 5. Code Language Dropdown
```javascript
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
```

**Current Status:** ✅ Configured
**Options:** 13 programming languages

---

## Dropdown Styling Features

### Visual States
- **Default:** Clean white background with subtle border
- **Hover:** Light gray background, darker border, subtle shadow
- **Focus:** Blue border with blue glow effect
- **Active:** Slightly darker gray background
- **Disabled:** Faded appearance with not-allowed cursor

### SVG Arrow Icon
All dropdowns now use a custom SVG arrow (chevron down) instead of browser default.

### CSS Classes
```css
.rte__select {
  min-height: 32px;
  padding: 6px 28px 6px 10px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.rte__select:hover {
  background-color: #f5f5f5;
  border-color: #999999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.rte__select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
}
```

---

## Adding Custom Dropdowns

### Example: Custom Color Dropdown
```javascript
{
  type: 'select',
  label: 'Highlight Color',
  command: 'highlightColor',
  options: [
    { label: 'Yellow', value: '#FFFF00' },
    { label: 'Green', value: '#00FF00' },
    { label: 'Blue', value: '#0000FF' },
    { label: 'Pink', value: '#FF69B4' },
    { label: 'Orange', value: '#FFA500' }
  ]
}
```

### Example: Custom Spacing Dropdown
```javascript
{
  type: 'select',
  label: 'Spacing',
  command: 'paragraphSpacing',
  options: [
    { label: 'Tight (0.8x)', value: '0.8' },
    { label: 'Normal (1x)', value: '1' },
    { label: 'Relaxed (1.5x)', value: '1.5' },
    { label: 'Open (2x)', value: '2' }
  ]
}
```

---

## Keyboard Navigation

### Shortcuts for Dropdowns
- **Tab:** Move to next dropdown
- **Shift+Tab:** Move to previous dropdown
- **Enter/Space:** Open dropdown
- **Arrow Keys:** Navigate options
- **Escape:** Close dropdown

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Dropdowns | ✅ | ✅ | ✅ | ✅ |
| SVG Arrow | ✅ | ✅ | ✅ | ✅ |
| Styling | ✅ | ✅ | ✅ | ✅ |
| Focus States | ✅ | ✅ | ✅ | ✅ |

---

## Responsive Behavior

### Desktop (1024px+)
- Full width dropdowns visible
- All options displayed
- Normal font sizes

### Tablet (768px - 1023px)
- Dropdowns scale down
- Padding reduced
- Font size: 12px

### Mobile (< 768px)
- Stacked layout
- Full-width dropdowns
- Larger touch targets (28px minimum height)

---

## Performance Tips

1. **Limit Options:** Keep dropdown options under 20 items
2. **Group Related Options:** Use visual separators for groups
3. **Lazy Load:** Load options on demand for large lists
4. **Searchable:** Consider adding search for 10+ options

---

## Troubleshooting

### Dropdown Not Opening
- Ensure `.rte__select` class is applied
- Check z-index conflicts
- Verify event listeners are attached

### Options Not Displaying
- Confirm options array has `label` and `value` properties
- Check that `value` is a valid command

### Styling Not Applied
- Verify `dropdown.css` is imported
- Check for CSS conflicts with other styles
- Ensure media queries are not hiding elements

---

## Future Enhancements

- [ ] Searchable dropdowns for large option lists
- [ ] Custom color picker with swatches
- [ ] Font preview in dropdown
- [ ] Recent fonts tracking
- [ ] Keyboard shortcuts for quick access
- [ ] Dropdown grouping/categorization

