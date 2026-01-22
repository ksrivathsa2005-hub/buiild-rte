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

    // Keep the code language dropdown in sync with the currently focused code block
    this._syncCodeLanguageDropdown();
  }

  _syncCodeLanguageDropdown() {
    const select = document.querySelector('select[data-command="insertCodeBlock"]');
    if (!select) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      select.value = '';
      return;
    }

    const anchorNode = selection.anchorNode;
    const pre = this._closestPre(anchorNode);

    if (!pre) {
      select.value = '';
      return;
    }

    const sourceLang = pre.getAttribute('data-source-language');
    const prismLang = pre.getAttribute('data-language');
    const resolvedLang = sourceLang || this._mapPrismToLanguage(prismLang);

    if (resolvedLang && this._hasOption(select, resolvedLang)) {
      select.value = resolvedLang;
    } else {
      select.value = '';
    }
  }

  _closestPre(node) {
    let current = node;
    while (current) {
      if (current.nodeType === 1 && current.tagName === 'PRE') {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  }

  _mapPrismToLanguage(prismLang) {
    const map = {
      'markup': 'html',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'java': 'java',
      'python': 'python',
      'php': 'php',
      'ruby': 'ruby',
      'sql': 'sql',
      'css': 'css',
      'csharp': 'csharp',
      'cpp': 'cpp',
      'json': 'json'
    };
    return map[prismLang] || prismLang || '';
  }

  _hasOption(select, value) {
    return Array.from(select.options).some(opt => opt.value === value);
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
