# RTE Component Library Index

## Overview

This directory contains all professional, reusable HTML and CSS components for the Rich Text Editor. Each component is self-contained with separate HTML templates and CSS stylesheets, following a modular architecture.

---

## Component Structure

```
rte-package/src/components/
├── button.html                 # Button component HTML
├── button.css                  # Button component styles
├── dropdown.html               # Dropdown/Select component HTML
├── dropdown.css                # Dropdown/Select component styles
├── color-picker.html           # Color picker component HTML
├── color-picker.css            # Color picker component styles
├── toolbar-group.html          # Toolbar group & separator HTML
├── toolbar-group.css           # Toolbar group & separator styles
├── modal.html                  # Modal/Dialog component HTML
├── modal.css                   # Modal/Dialog component styles
└── builder.js                  # Component builder functions (JS)
```

---

## Components List

### 1. Button Component

**Files:** `button.html`, `button.css`

**Purpose:** Primary interactive element for toolbar actions

**Features:**
- Icon support (Font Awesome)
- Multiple states (inactive, hover, focus, active, disabled)
- Accessible ARIA labels
- Touch-friendly sizing (36×36px minimum)
- Keyboard navigation support

**Usage:**
```html
<button class="rte__btn" data-command="bold" aria-label="Bold">
  <i class="fas fa-bold"></i>
</button>
```

**CSS Classes:**
- `.rte__btn` - Base button
- `.rte__btn--active` - Active/pressed state
- `.rte__btn--toggle` - Toggle button variant
- `.rte__btn-group` - Grouped buttons
- `[aria-pressed="true"]` - Active state selector

**States:**
- `:hover` - Light gray background
- `:focus-visible` - Blue outline
- `[aria-pressed="true"]` - Blue gradient background
- `:disabled` - Reduced opacity

---

### 2. Dropdown Component

**Files:** `dropdown.html`, `dropdown.css`

**Purpose:** Selection control for paragraph format, font, size, etc.

**Features:**
- Smooth gradient background
- Custom arrow icon (Font Awesome)
- Option grouping support
- Hover and focus states
- Form validation ready

**Usage:**
```html
<div class="rte__select-wrapper">
  <select class="rte__select" data-command="formatBlock">
    <option value="">Paragraph</option>
    <option value="h1">Heading 1</option>
    <option value="h2">Heading 2</option>
  </select>
  <span class="rte__select-arrow">
    <i class="fas fa-chevron-down"></i>
  </span>
</div>
```

**CSS Classes:**
- `.rte__select` - Base select element
- `.rte__select-wrapper` - Container with arrow
- `.rte__select-arrow` - Arrow icon
- `.rte__select--minimal` - Minimal variant
- `.rte__select--large` - Large variant
- `.rte__select--small` - Small variant

**Options:**
- Standard font families
- Font sizes (8pt - 48pt)
- Paragraph formats (p, h1-h6)
- Line heights (1, 1.5, 2, etc.)
- Code languages (HTML, CSS, JS, etc.)

---

### 3. Color Picker Component

**Files:** `color-picker.html`, `color-picker.css`

**Purpose:** Color selection for text and background colors

**Features:**
- Quick color input
- Color palette with presets
- Advanced color picker with hex input
- Color swatches
- Drag-and-drop support
- Recent colors tracking

**Usage:**
```html
<!-- Simple Color Picker -->
<div class="rte__color-picker-wrapper">
  <button class="rte__color-picker-button" aria-label="Text Color">
    <i class="fas fa-palette"></i>
  </button>
  <input type="color" class="rte__color-picker-input" data-command="foreColor">
</div>

<!-- Advanced Color Picker with Dropdown -->
<div class="rte__color-picker-advanced">
  <button class="rte__color-picker-toggle" aria-label="Color Options">
    <i class="fas fa-palette"></i>
    <i class="fas fa-chevron-down"></i>
  </button>
  <div class="rte__color-picker-menu">
    <!-- Color selection content -->
  </div>
</div>
```

**CSS Classes:**
- `.rte__color-picker-wrapper` - Container
- `.rte__color-picker-button` - Quick access button
- `.rte__color-picker-input` - Hidden color input
- `.rte__color-picker-advanced` - Advanced picker
- `.rte__color-picker-menu` - Dropdown menu
- `.rte__palette-grid` - Color swatch grid
- `.rte__palette-swatch` - Individual color button

**Preset Colors:**
- Standard colors (black, white, red, green, blue, yellow)
- Accent colors (blue, green, red, orange, purple, teal)
- Recent colors (user selected)

---

### 4. Toolbar Group Component

**Files:** `toolbar-group.html`, `toolbar-group.css`

**Purpose:** Organize toolbar into logical groups with separators

**Features:**
- 8 predefined groups (clipboard, formatting, paragraph, alignment, insert, typography, transform, view)
- Visual separators between groups
- Flexible responsive design
- Accessibility focused
- Group focus management

**Usage:**
```html
<div class="rte__toolbar" role="toolbar">
  <!-- Clipboard Group -->
  <div class="rte__toolbar-group" data-group="clipboard">
    <button class="rte__btn" data-command="undo">
      <i class="fas fa-undo"></i>
    </button>
    <!-- More buttons -->
  </div>
  
  <!-- Separator -->
  <div class="rte__toolbar-separator" role="separator"></div>
  
  <!-- Text Formatting Group -->
  <div class="rte__toolbar-group" data-group="formatting">
    <!-- Buttons -->
  </div>
</div>
```

**CSS Classes:**
- `.rte__toolbar` - Main toolbar container
- `.rte__toolbar-group` - Group container
- `.rte__toolbar-separator` - Divider between groups
- `.rte__toolbar-group--buttons` - Button group variant
- `.rte__toolbar-group--selects` - Select group variant
- `.rte__toolbar--scrollable` - Horizontal scroll variant
- `.rte__toolbar--single-row` - Single row layout
- `.rte__toolbar--multi-row` - Multi-row layout

**Groups:**
1. **Clipboard** - Undo, Redo, Cut, Copy, Paste
2. **Formatting** - Bold, Italic, Underline, Strikethrough, Superscript, Subscript, Code, Clear
3. **Paragraph** - Format block, Lists, Block quote
4. **Alignment** - Left, Center, Right, Justify, Indent, Outdent
5. **Insert** - Link, Image, Audio, Video, Table, HR
6. **Typography** - Font, Size, Color, Highlight
7. **Transform** - Uppercase, Lowercase, Code block
8. **View** - Source code, Fullscreen

---

### 5. Modal Component

**Files:** `modal.html`, `modal.css`

**Purpose:** Dialog for user input (links, images, tables, etc.)

**Features:**
- Professional design with gradient header/footer
- Backdrop with blur effect
- Smooth animations
- Form validation ready
- Upload zone for file handling
- Accessibility compliant (ARIA)
- Mobile responsive

**Usage:**
```html
<div class="rte__modal" role="dialog" aria-modal="true">
  <div class="rte__modal-backdrop"></div>
  <div class="rte__modal-content">
    <div class="rte__modal-header">
      <h3 class="rte__modal-title">Insert Link</h3>
      <button class="rte__modal-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="rte__modal-body">
      <!-- Form content -->
    </div>
    
    <div class="rte__modal-footer">
      <button class="rte__btn">Cancel</button>
      <button class="rte__btn rte__btn--primary">OK</button>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.rte__modal` - Modal container
- `.rte__modal-backdrop` - Overlay background
- `.rte__modal-content` - Dialog box
- `.rte__modal-header` - Title bar
- `.rte__modal-title` - Title text
- `.rte__modal-close` - Close button
- `.rte__modal-body` - Content area
- `.rte__modal-footer` - Action buttons
- `.rte__form-group` - Form field group
- `.rte__form-input` - Text input
- `.rte__form-label` - Field label
- `.rte__form-checkbox` - Checkbox input
- `.rte__upload-zone` - File upload area

**Form Elements:**
- Text inputs
- Number inputs
- URL inputs
- Checkboxes
- File uploads
- Text areas

**Modal Types:**
- Link insertion modal
- Image upload modal
- Table creation modal
- Code block modal
- Special characters modal

---

## Styling Architecture

### Color Scheme

```css
--color-primary: #3498db;           /* Blue - active/hover */
--color-primary-dark: #2980b9;      /* Dark blue - pressed */
--color-text: #2c3e50;              /* Dark gray - text */
--color-border: #ddd;               /* Light gray - borders */
--color-hover: #f0f1f3;             /* Very light gray - hover */
```

### Typography

- **Font Family:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Button Font Size:** 14px
- **Label Font Size:** 13px
- **Helper Text:** 12px

### Spacing

- **Button Padding:** 7px 12px
- **Toolbar Padding:** 12px
- **Modal Padding:** 20px
- **Group Gap:** 4-8px

### Animations

- **Duration:** 0.15s (buttons), 0.3s (modals)
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1)
- **Properties:** All (color, shadow, transform)

---

## Accessibility Features

### WCAG AA Compliance

- **Focus Indicators:** 2px solid blue outline
- **Color Contrast:** 4.5:1 minimum ratio
- **Keyboard Navigation:** Full support
- **Screen Reader:** ARIA labels, semantic HTML
- **Reduced Motion:** Respects prefers-reduced-motion
- **High Contrast:** Supports prefers-contrast
- **Dark Mode:** Automatic dark mode support

### ARIA Attributes

- `role="button"` - Buttons
- `role="toolbar"` - Toolbar container
- `role="separator"` - Visual dividers
- `role="dialog"` - Modal dialogs
- `aria-label` - Descriptive labels
- `aria-pressed` - Button state
- `aria-expanded` - Dropdown state
- `aria-modal` - Modal indication

---

## Component States

### Button States

| State | Background | Border | Shadow |
|-------|-----------|--------|--------|
| Default | Transparent | None | None |
| Hover | #f0f1f3 | #e0e3e7 | Small shadow |
| Focus | #f0f1f3 | Blue outline | Blue glow |
| Active | Blue gradient | #2980b9 | Inset + drop |
| Disabled | #f8f9fa | #e9ecef | None |

### Dropdown States

| State | Appearance |
|-------|-----------|
| Default | White background, light gray border |
| Hover | Slightly darker, blue border |
| Focus | Blue outline, blue border |
| Open | Light gradient background |
| Disabled | Grayed out, opacity 0.5 |

### Modal States

| State | Animation |
|-------|-----------|
| Opening | Slide up + fade in (0.3s) |
| Open | Fully visible |
| Closing | Fade out (0.2s) |
| Backdrop | Blur + dim (0.2s) |

---

## Responsive Breakpoints

```css
/* Desktop */
Default styling applied

/* Tablet (max-width: 1024px) */
Reduced spacing, gap adjustments

/* Mobile (max-width: 768px) */
Toolbar wraps, separators hidden, selects hide labels

/* Small Mobile (max-width: 480px) */
Minimal gaps, stacked buttons, centered modals
```

---

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Android Chrome)

**Features:**
- CSS Grid/Flexbox
- CSS Variables
- Gradient backgrounds
- Backdrop Filter
- Transitions/Animations

---

## Performance Optimization

### CSS Optimization
- Efficient selectors
- Shared transitions (0.15s easing)
- No duplicated rules
- Minimal repaints/reflows

### HTML Optimization
- Semantic structure
- Minimal DOM nesting
- Accessible without JavaScript

### JavaScript Integration (builder.js)
- Lazy component creation
- Event delegation
- Efficient DOM updates
- Memory management

---

## Customization Guide

### Changing Colors

Edit CSS variables in each component's CSS file:

```css
/* button.css */
.rte__btn {
  color: #495057;  /* Change default text color */
}

.rte__btn:hover:not(:disabled) {
  background-color: #custom-color;  /* Change hover color */
}
```

### Changing Sizing

Adjust button/component dimensions:

```css
.rte__btn {
  padding: 10px 14px;  /* Increase padding */
  min-width: 40px;     /* Increase min-width */
  min-height: 40px;    /* Increase min-height */
}
```

### Custom Themes

Create a theme override file:

```css
/* Custom theme */
:root {
  --color-primary: #custom-blue;
  --color-hover: #custom-gray;
}
```

---

## Usage Example

Complete toolbar implementation:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Component Styles -->
  <link rel="stylesheet" href="button.css">
  <link rel="stylesheet" href="dropdown.css">
  <link rel="stylesheet" href="color-picker.css">
  <link rel="stylesheet" href="toolbar-group.css">
  <link rel="stylesheet" href="modal.css">
</head>
<body>
  <!-- Toolbar -->
  <div class="rte__toolbar" role="toolbar">
    <!-- Include component HTML here -->
  </div>
  
  <!-- Modals -->
  <div id="link-modal"></div>
  <div id="image-modal"></div>
  
  <!-- Scripts -->
  <script type="module" src="builder.js"></script>
</body>
</html>
```

---

## File Sizes

| Component | HTML | CSS | Combined |
|-----------|------|-----|----------|
| Button | 8 KB | 12 KB | 20 KB |
| Dropdown | 6 KB | 10 KB | 16 KB |
| Color Picker | 7 KB | 14 KB | 21 KB |
| Toolbar Group | 9 KB | 12 KB | 21 KB |
| Modal | 8 KB | 16 KB | 24 KB |
| **Total** | **38 KB** | **64 KB** | **102 KB** |

---

## Next Steps

1. **Import Components:** Include HTML templates in your markup
2. **Load Stylesheets:** Link all CSS files in `<head>`
3. **Load Font Awesome:** CDN for icons
4. **Initialize JavaScript:** Use builder.js to create components
5. **Customize:** Override CSS variables for theming
6. **Test:** Verify across browsers and devices

---

## Support & Issues

For issues or questions:
- Check component HTML/CSS files for structure
- Review ARIA attributes for accessibility
- Test keyboard navigation
- Verify Font Awesome CDN is loaded
- Check browser console for errors

All components are production-ready, accessible, and fully customizable.
