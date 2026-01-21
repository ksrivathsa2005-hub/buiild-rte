/**
 * Modal Manager - Handles dynamic modal creation and interaction
 * Provides a Promise-based API to replace prompt() and alert()
 */

export class ModalManager {
  constructor(editor) {
    this.editor = editor;
    this.activeModal = null;
  }

  /**
   * Shows a generic prompt modal
   * @param {Object} config - Title, fields, okLabel, cancelLabel
   * @returns {Promise} Resolves with field values or rejects
   */
  prompt(config) {
    return new Promise((resolve, reject) => {
      const modal = this._createModal(config);
      const form = this._createForm(modal, config.fields);
      
      const handleOk = () => {
        const results = {};
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        let isValid = true;
        
        inputs.forEach(input => {
          if (input.required && !input.value) {
            input.classList.add('rte__form-input--error');
            isValid = false;
          } else {
            input.classList.remove('rte__form-input--error');
            results[input.name || input.id] = input.value;
          }
        });

        if (isValid) {
          this._close(modal);
          resolve(config.fields.length === 1 ? Object.values(results)[0] : results);
        }
      };

      const handleCancel = () => {
        this._close(modal);
        reject('User cancelled');
      };

      modal.querySelector('.rte__btn--primary').onclick = (e) => {
        e.preventDefault();
        handleOk();
      };
      
      modal.querySelector('.rte__btn--secondary').onclick = (e) => {
        e.preventDefault();
        handleCancel();
      };
      
      modal.querySelector('.rte__modal-close').onclick = (e) => {
        e.preventDefault();
        handleCancel();
      };
      
      // Handle Enter key in form
      form.onsubmit = (e) => {
        e.preventDefault();
        handleOk();
      };

      this._show(modal);
    });
  }

  /**
   * Shows a confirm modal
   */
  confirm(title, message) {
    return new Promise((resolve) => {
      const modal = this._createModal({
        title,
        message,
        okLabel: 'Yes',
        cancelLabel: 'No'
      });

      modal.querySelector('.rte__btn--primary').onclick = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve(true);
      };

      modal.querySelector('.rte__btn--secondary').onclick = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve(false);
      };

      modal.querySelector('.rte__modal-close').onclick = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve(false);
      };

      this._show(modal);
    });
  }

  /**
   * Shows a simple alert/message modal
   */
  alert(title, message) {
    return new Promise((resolve) => {
      const modal = this._createModal({
        title,
        message,
        okLabel: 'OK',
        hideCancel: true
      });

      modal.querySelector('.rte__btn--primary').onclick = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve();
      };

      modal.querySelector('.rte__modal-close').onclick = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve();
      };

      this._show(modal);
    });
  }

  _createModal(config) {
    const modal = document.createElement('div');
    modal.className = 'rte__modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="rte__modal-backdrop"></div>
      <div class="rte__modal-content">
        <div class="rte__modal-header">
          <h3 class="rte__modal-title">${config.title}</h3>
          <button class="rte__modal-close" aria-label="Close" type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="rte__modal-body">
          ${config.message ? `<p class="rte__modal-message">${config.message}</p>` : ''}
        </div>
        <div class="rte__modal-footer">
          <button class="rte__btn rte__btn--secondary">${config.cancelLabel || 'Cancel'}</button>
          <button class="rte__btn rte__btn--primary">${config.okLabel || 'OK'}</button>
        </div>
      </div>
    `;

    if (config.hideCancel) {
      modal.querySelector('.rte__btn--secondary').style.display = 'none';
    }

    document.body.appendChild(modal);
    return modal;
  }

  _createForm(modal, fields = []) {
    const body = modal.querySelector('.rte__modal-body');
    const form = document.createElement('form');
    form.className = 'rte__modal-form';

    fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'rte__form-group';

      const label = document.createElement('label');
      label.className = 'rte__form-label';
      label.textContent = field.label;

      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }
      
      input.id = field.id;
      input.name = field.id;
      input.className = 'rte__form-input';
      input.placeholder = field.placeholder || '';
      input.value = field.value || '';
      input.required = field.required || false;

      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    body.appendChild(form);
    return form;
  }

  _show(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    this.activeModal = modal;
    
    // Auto-focus first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  _close(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
    this.activeModal = null;
    this.editor.focus();
  }
}
