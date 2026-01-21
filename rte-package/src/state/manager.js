/**
 * State Manager - Tracks button states, active formatting, etc.
 */

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
  }

  updateButtonStates() {
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'];
    
    commands.forEach(cmd => {
      const isActive = document.queryCommandState(cmd);
      this.activeStates[cmd] = isActive;

      const buttons = document.querySelectorAll(`[data-command="${cmd}"]`);
      buttons.forEach(btn => {
        if (isActive) {
          btn.classList.add('rte__btn--active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('rte__btn--active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    });
  }

  setButtonState(command, state) {
    const buttons = document.querySelectorAll(`[data-command="${command}"]`);
    buttons.forEach(btn => {
      if (state) {
        btn.classList.add('rte__btn--active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('rte__btn--active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  disableButton(command, disabled = true) {
    const buttons = document.querySelectorAll(`[data-command="${command}"]`);
    buttons.forEach(btn => {
      btn.disabled = disabled;
    });
  }

  isActive(command) {
    return this.activeStates[command] || false;
  }
}
