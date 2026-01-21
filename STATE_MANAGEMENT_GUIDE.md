/**
 * STATE MANAGEMENT & BUTTON STATES GUIDE
 * 
 * This document explains how button states work in RTE and how
 * they respond to formatting changes.
 */

// ============================================
// BUTTON STATE MATRIX
// ============================================

/*
STATE         | CSS CLASS            | ARIA ATTRIBUTES        | VISUAL
-----------   | -------------------- | ---------------------- | ---------
Inactive      | (none)               | aria-pressed="false"   | Gray, transparent
Hover         | (pseudo :hover)      | (same)                 | Light gray bg
Focus         | :focus-visible       | (same)                 | Blue outline
Active        | .rte__btn--active    | aria-pressed="true"    | Blue bg, white text
Disabled      | [disabled]           | disabled, aria-pressed | Grayed out

*/

// ============================================
// STATE TRANSITIONS - BOLD BUTTON EXAMPLE
// ============================================

/*
USER ACTION              | STATE CHANGE        | CLASS CHANGE
-----------------        | ------------------- | --------------------
Click bold button        | inactive → active   | add .rte__btn--active
Select unbold text       | active → inactive   | remove .rte__btn--active
Blur editor              | (no change)         | (no change)
Ctrl+B while selected    | toggle              | toggle class
Mouse over active button | active → active     | (maintain state)
Tab to button            | (visual)            | show focus ring
Press Escape             | (no change)         | (no change)

*/

// ============================================
// CSS STATE CLASSES
// ============================================

const CSS_STATES = {
  INACTIVE: '',                     // No class
  ACTIVE: 'rte__btn--active',       // Active formatting
  DISABLED: '[disabled]',           // Button disabled
  FOCUS: ':focus-visible',          // Keyboard focus
  HOVER: ':hover',                  // Mouse over
  TOGGLE: 'rte__btn--toggle'        // Toggle state
};

// ============================================
// STATE MANAGER IMPLEMENTATION
// ============================================

export class StateManager {
  constructor(editor) {
    this.editor = editor;
    this.activeStates = {
      bold: false,
      italic: false,
      underline: false,
      strikeThrough: false,
      superscript: false,
      subscript: false
    };
    this.buttonElements = new Map();
  }

  // Update all button states based on current selection
  updateButtonStates() {
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'];
    
    commands.forEach(cmd => {
      // Check if this command is currently applied
      const isActive = document.queryCommandState(cmd);
      this.activeStates[cmd] = isActive;

      // Find all buttons for this command
      const buttons = document.querySelectorAll(`[data-command="${cmd}"]`);
      buttons.forEach(btn => {
        this._updateButtonVisuals(btn, isActive);
      });
    });
  }

  // Update visual state of a button
  _updateButtonVisuals(button, isActive) {
    if (isActive) {
      // ACTIVE STATE
      button.classList.add('rte__btn--active');
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-current', 'true');
    } else {
      // INACTIVE STATE
      button.classList.remove('rte__btn--active');
      button.setAttribute('aria-pressed', 'false');
      button.removeAttribute('aria-current');
    }
  }

  // Manual state setting
  setButtonState(command, state) {
    const buttons = document.querySelectorAll(`[data-command="${command}"]`);
    buttons.forEach(btn => {
      this._updateButtonVisuals(btn, state);
    });
    this.activeStates[command] = state;
  }

  // Enable/disable button
  disableButton(command, disabled = true) {
    const buttons = document.querySelectorAll(`[data-command="${command}"]`);
    buttons.forEach(btn => {
      btn.disabled = disabled;
      if (disabled) {
        btn.setAttribute('aria-disabled', 'true');
      } else {
        btn.removeAttribute('aria-disabled');
      }
    });
  }

  // Check if command is active
  isActive(command) {
    return this.activeStates[command] || false;
  }

  // Get all active commands
  getActiveCommands() {
    return Object.keys(this.activeStates).filter(cmd => this.activeStates[cmd]);
  }

  // Reset all states
  reset() {
    Object.keys(this.activeStates).forEach(cmd => {
      this.setButtonState(cmd, false);
    });
  }
}

// ============================================
// BUTTON STATE EXAMPLES
// ============================================

/*

EXAMPLE 1: User selects bold text
──────────────────────────────────
1. User selects some text
2. Text is already bold
3. updateButtonStates() is called
4. document.queryCommandState('bold') returns true
5. Bold button gets:
   - Class: 'rte__btn--active'
   - aria-pressed: 'true'
   - Visual: Blue background, white text
6. User clicks bold button again
7. Selected text becomes non-bold
8. updateButtonStates() is called
9. Bold button loses active state
10. Bold button gets:
    - Class removed: 'rte__btn--active'
    - aria-pressed: 'false'
    - Visual: Returns to gray/transparent


EXAMPLE 2: Multiple formats active
──────────────────────────────────
Selected text is: Bold AND Italic AND Underlined

Visual Result:
┌─────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌───────────┐│
│ │ Bold ✓  │ │ Italic✓ │ │ Underline ││
│ │ (active)│ │ (active)│ │ (active)  ││
│ └─────────┘ └─────────┘ └───────────┘│
└─────────────────────────────────────┘

Active State Values:
{
  bold: true,
  italic: true,
  underline: true,
  strikeThrough: false,
  superscript: false,
  subscript: false
}


EXAMPLE 3: Selection changes
──────────────────────────────
User drags selection across text:
- Start: Bold text (bold button active)
- Middle: Mixed formatting (button becomes inactive)
- End: Non-bold text (bold button inactive)

Behavior: Buttons update dynamically as selection changes


EXAMPLE 4: Keyboard navigation focus
─────────────────────────────────────
User presses Tab to navigate toolbar:

Visual:
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ ┌────────┐                       │ │
│ │ │ Bold ← │ (focus ring visible)  │ │
│ │ └────────┘                       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Browser shows:
- Blue outline around button
- Button remains functional

*/

// ============================================
// ARIA ATTRIBUTES FOR STATE
// ============================================

const ARIA_ATTRIBUTES = {
  // Button pressed state (toggle buttons)
  'aria-pressed': {
    true: 'Button is currently pressed/active',
    false: 'Button is not pressed/inactive'
  },

  // Disabled state
  'aria-disabled': {
    true: 'Button is disabled and cannot be activated',
    false: 'Button is enabled'
  },

  // Current item (for navigation/headings)
  'aria-current': {
    true: 'This is the current/active section',
    page: 'This is current page',
    step: 'This is current step',
    location: 'This is current location',
    date: 'This is current date',
    time: 'This is current time'
  },

  // Button label
  'aria-label': 'Button tooltip/name',

  // For icon buttons
  'title': 'Hover tooltip'
};

// ============================================
// REAL-TIME STATE UPDATES
// ============================================

/*
LISTENING FOR CHANGES:

editor.addEventListener('mouseup', () => {
  // Selection changed, update button states
  stateManager.updateButtonStates();
});

editor.addEventListener('keyup', () => {
  // Content changed via keyboard, update states
  stateManager.updateButtonStates();
});

// These events fire whenever user changes selection or content
*/

// ============================================
// CSS STATE SELECTORS
// ============================================

const CSS_SELECTORS = `
/* Buttons with command attribute (data-command) */
[data-command="bold"] { ... }

/* Active button state */
[data-command="bold"][aria-pressed="true"] { 
  background-color: #007bff;
  color: white;
}

/* Inactive button state */
[data-command="bold"][aria-pressed="false"] {
  background-color: transparent;
  color: #333;
}

/* Disabled button */
[data-command="bold"][disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus state (keyboard navigation) */
[data-command]:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

/* Hover state */
[data-command]:hover:not([disabled]) {
  background-color: #e9ecef;
}

/* Combination: active AND hover */
[data-command][aria-pressed="true"]:hover {
  background-color: #0056b3;
}
`;

// ============================================
// STATE FLOW DIAGRAM
// ============================================

/*
STATE FLOW FOR A FORMATTING BUTTON:

    ┌─────────────┐
    │   INACTIVE  │ ← Default state
    └──────┬──────┘
           │
           │ User applies format (click or Ctrl+key)
           ↓
    ┌─────────────┐
    │   ACTIVE    │ ← Format is applied to selection
    │ (show blue) │
    └──────┬──────┘
           │
           │ User selects different text or removes format
           ↓
    ┌─────────────┐
    │   INACTIVE  │ ← Format not on selection
    └─────────────┘

For disabled state:

    ┌─────────────┐
    │  ENABLED    │ ← Button can be clicked
    └──────┬──────┘
           │
           │ Editor becomes read-only or no content
           ↓
    ┌─────────────┐
    │  DISABLED   │ ← Cursor not-allowed, no action
    │ (opacity 50%)
    └──────┬──────┘
           │
           │ Editor becomes editable again
           ↓
    ┌─────────────┐
    │  ENABLED    │ ← Button re-enabled
    └─────────────┘

*/

// ============================================
// TESTING STATE MANAGEMENT
// ============================================

export const testStateManagement = () => {
  const editor = document.getElementById('editor');
  const stateManager = new StateManager(editor);

  // Test 1: Set bold text
  console.log('Test 1: Setting bold');
  stateManager.setButtonState('bold', true);
  console.log('Bold is active:', stateManager.isActive('bold'));
  // Output: true

  // Test 2: Get all active commands
  console.log('\nTest 2: Multiple active');
  stateManager.setButtonState('italic', true);
  console.log('Active commands:', stateManager.getActiveCommands());
  // Output: ['bold', 'italic']

  // Test 3: Disable button
  console.log('\nTest 3: Disable button');
  stateManager.disableButton('underline', true);
  console.log('Underline button disabled');

  // Test 4: Reset all
  console.log('\nTest 4: Reset all');
  stateManager.reset();
  console.log('Active commands:', stateManager.getActiveCommands());
  // Output: []
};
