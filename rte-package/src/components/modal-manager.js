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

  /**
   * Shows a generic file upload modal with drag & drop
   * @param {Object} config - Title, accept, label
   */
  uploadMedia(config) {
    return new Promise((resolve, reject) => {
      const modal = this._createModal({
        title: config.title || 'Insert Media',
        hideFooter: true,
        className: config.className
      });

      const body = modal.querySelector('.rte__modal-body');
      const accept = config.accept || 'image/*';
      const labelText = config.label || 'Drop file here or browse to upload';

      // Create Drop Zone
      const dropZone = document.createElement('div');
      dropZone.className = 'rte__upload-zone';
      dropZone.innerHTML = `
        <div class="rte__upload-content">
          <p class="rte__upload-text">${labelText}</p>
          <button type="button" class="rte__btn rte__btn--browse">Browse</button>
        </div>
        <input type="file" class="rte__file-input" accept="${accept}" style="display: none;">
      `;

      // Create URL Input Section
      const urlSection = document.createElement('div');
      urlSection.style.marginTop = '20px';
      urlSection.innerHTML = `
        <div class="rte__form-group">
          <p class="rte__form-help" style="margin-bottom: 8px;">You can also provide a link from the web</p>
          <input type="url" class="rte__form-input" placeholder="${config.placeholder || 'http://example.com/image.png'}">
        </div>
      `;

      // Create Footer Actions
      const footer = document.createElement('div');
      footer.className = 'rte__modal-footer';
      footer.style.marginTop = '20px';
      footer.innerHTML = `
        <button class="rte__btn rte__btn--primary">Insert</button>
        <button class="rte__btn rte__btn--secondary">Cancel</button>
      `;

      body.appendChild(dropZone);
      body.appendChild(urlSection);
      body.appendChild(footer);

      const fileInput = dropZone.querySelector('.rte__file-input');
      const browseBtn = dropZone.querySelector('.rte__btn--browse');
      const urlInput = urlSection.querySelector('input');
      const insertBtn = footer.querySelector('.rte__btn--primary');
      const cancelBtn = footer.querySelector('.rte__btn--secondary');

      // Drag & Drop Handlers
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('dragover');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('dragover');
        }, false);
      });

      let pendingFile = null;

      const handleFile = (file) => {
        if (file) {
          pendingFile = file;
          const text = dropZone.querySelector('.rte__upload-text');
          text.textContent = `Selected: ${file.name}`;
          text.style.color = '#007bff';
          text.style.fontWeight = '600';
        }
      };

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFile(files[0]);
      });

      browseBtn.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
      });

      // Insert Button Handler
      insertBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();

        if (pendingFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (this.editor.restoreSelection) this.editor.restoreSelection();
            this._close(modal);
            resolve({ url: e.target.result });
          };
          reader.readAsDataURL(pendingFile);
        } else if (url) {
          if (this.editor.restoreSelection) this.editor.restoreSelection();
          this._close(modal);
          resolve({ url });
        } else {
          urlInput.classList.add('rte__form-input--error');
          urlInput.focus();
        }
      });

      // Cancel Handlers
      const handleCancel = (e) => {
        e.preventDefault();
        this._close(modal);
        resolve(null);
      };

      cancelBtn.addEventListener('click', handleCancel);

      const closeIcon = modal.querySelector('.rte__modal-close');
      if (closeIcon) closeIcon.onclick = handleCancel;

      this._show(modal);
    });
  }

  /**
   * Shows a table selector grid
   * @returns {Promise} Resolves with {rows, cols}
   */
  tableSelector() {
    return new Promise((resolve) => {
      const modal = this._createModal({
        title: 'Insert Table',
        hideFooter: true,
        className: 'rte__modal--table'
      });

      const body = modal.querySelector('.rte__modal-body');

      // Container for structure
      const container = document.createElement('div');
      container.className = 'rte__table-selector';

      // Dimensions Overlay (e.g., "4x3")
      const label = document.createElement('div');
      label.className = 'rte__table-label';
      label.textContent = '1x1';

      // The Grid
      const grid = document.createElement('div');
      grid.className = 'rte__table-picker';

      const maxRows = 10;
      const maxCols = 10;
      const cells = [];

      for (let r = 0; r < maxRows; r++) {
        for (let c = 0; c < maxCols; c++) {
          const cell = document.createElement('div');
          cell.className = 'rte__picker-cell';
          cell.dataset.row = r + 1;
          cell.dataset.col = c + 1;

          // Hover Event
          cell.onmouseover = () => {
            // Highlight up to this cell
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            label.textContent = `${col}x${row}`;

            cells.forEach(c => {
              const cr = parseInt(c.dataset.row);
              const cc = parseInt(c.dataset.col);
              if (cr <= row && cc <= col) {
                c.classList.add('active');
              } else {
                c.classList.remove('active');
              }
            });
          };

          // Click Event
          cell.onclick = () => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            this._close(modal);
            resolve({ rows: row, cols: col });
          };

          grid.appendChild(cell);
          cells.push(cell);
        }
      }

      // Reset when leaving grid
      grid.onmouseleave = () => {
        label.textContent = '0x0';
        cells.forEach(c => c.classList.remove('active'));
      };

      container.appendChild(label);
      container.appendChild(grid);

      // "Insert Table" text at bottom (as per screenshot stylistic)
      const footerText = document.createElement('div');
      footerText.className = 'rte__table-footer-text';
      footerText.innerHTML = '<i class="fas fa-table"></i> Insert Table';
      container.appendChild(footerText);

      body.appendChild(container);

      // Close handler
      const closeBtn = modal.querySelector('.rte__modal-close');
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.preventDefault();
          this._close(modal);
          resolve(null);
        };
      }

      this._show(modal);
    });
  }

  /**
   * Shows a grid selection modal
   * @param {Object} config - Title, items (array of string/obj)
   * @returns {Promise} Resolves with selected item
   */
  grid(config) {
    return new Promise((resolve) => {
      const modal = this._createModal({
        title: config.title,
        hideFooter: true
      });

      const body = modal.querySelector('.rte__modal-body');
      const grid = document.createElement('div');
      grid.className = 'rte__char-grid';

      config.items.forEach(item => {
        const value = typeof item === 'object' ? item.value : item;
        const display = typeof item === 'object' ? item.display : item;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rte__char-btn';
        btn.innerHTML = display;
        btn.title = display;
        btn.setAttribute('aria-label', display);

        btn.onclick = (e) => {
          e.preventDefault();
          this._close(modal);
          resolve(value);
        };

        grid.appendChild(btn);
      });

      body.appendChild(grid);

      const closeBtn = modal.querySelector('.rte__modal-close');
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.preventDefault();
          this._close(modal);
          resolve(null);
        };
      }

      this._show(modal);
    });
  }

  /**
   * Shows a Find & Replace modal
   * @param {Object} callbacks - onFind, onReplace, onReplaceAll
   */
  findReplace(callbacks) {
    const modal = this._createModal({
      title: 'Find and Replace',
      hideFooter: true,
      className: 'rte__modal--find-replace'
    });

    const body = modal.querySelector('.rte__modal-body');
    const form = document.createElement('div');
    form.className = 'rte__form-group';
    form.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div class="rte__form-group">
          <label class="rte__form-label">Find</label>
          <input type="text" id="rte-find-input" class="rte__form-input" placeholder="Text to find">
        </div>
        <div class="rte__form-group">
          <label class="rte__form-label">Replace with</label>
          <input type="text" id="rte-replace-input" class="rte__form-input" placeholder="Replacement text">
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
          <button type="button" id="rte-btn-find" class="rte__btn rte__btn--primary" style="flex: 1;">Find Next</button>
          <button type="button" id="rte-btn-replace" class="rte__btn rte__btn--secondary" style="flex: 1;">Replace</button>
          <button type="button" id="rte-btn-replace-all" class="rte__btn rte__btn--secondary" style="flex: 1;">Replace All</button>
        </div>
      </div>
      <div id="rte-find-status" style="margin-top: 10px; font-size: 12px; color: #666; height: 16px;"></div>
    `;

    body.appendChild(form);

    const findInput = form.querySelector('#rte-find-input');
    const replaceInput = form.querySelector('#rte-replace-input');
    const findBtn = form.querySelector('#rte-btn-find');
    const replaceBtn = form.querySelector('#rte-btn-replace');
    const replaceAllBtn = form.querySelector('#rte-btn-replace-all');
    const statusDiv = form.querySelector('#rte-find-status');

    findBtn.onclick = () => {
      const query = findInput.value;
      if (!query) return;
      const result = callbacks.onFind(query);
      statusDiv.textContent = result || '';
    };

    replaceBtn.onclick = () => {
      const query = findInput.value;
      const replacement = replaceInput.value;
      if (!query) return;
      const result = callbacks.onReplace(query, replacement);
      statusDiv.textContent = result || '';
    };

    replaceAllBtn.onclick = () => {
      const query = findInput.value;
      const replacement = replaceInput.value;
      if (!query) return;
      const result = callbacks.onReplaceAll(query, replacement);
      statusDiv.textContent = result || '';
    };

    // Close handler
    const closeBtn = modal.querySelector('.rte__modal-close');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        this._close(modal);
      };
    }

    this._show(modal);
    return modal;
  }

  _createModal(config) {
    const modal = document.createElement('div');
    modal.className = 'rte__modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="rte__modal-backdrop"></div>
      <div class="rte__modal-content ${config.className || ''}">
        <div class="rte__modal-header">
          <h3 class="rte__modal-title">${config.title}</h3>
          <button class="rte__modal-close" aria-label="Close" type="button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="rte__modal-body">
          ${config.message ? `<p class="rte__modal-message">${config.message}</p>` : ''}
        </div>
        ${!config.hideFooter ? `
        <div class="rte__modal-footer">
          <button class="rte__btn rte__btn--primary">${config.okLabel || 'Insert'}</button>
          <button class="rte__btn rte__btn--secondary">${config.cancelLabel || 'Cancel'}</button>
        </div>` : ''}
      </div>
    `;

    if (config.hideCancel && !config.hideFooter) {
      const secondaryBtn = modal.querySelector('.rte__btn--secondary');
      if (secondaryBtn) secondaryBtn.style.display = 'none';
    }

    this.editor.container.appendChild(modal);
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
      if (field.placeholder) input.placeholder = field.placeholder;
      if (field.value) input.value = field.value;
      if (field.required) input.required = field.required;

      if (field.type === 'checkbox') {
        group.classList.add('rte__form-group--checkbox');
        // Layout shift for checkbox
        label.classList.add('rte__form-label--checkbox');
        input.className = 'rte__form-checkbox';
        input.checked = field.checked || false;

        group.appendChild(input);
        group.appendChild(label);
      } else {
        group.appendChild(label);
        group.appendChild(input);
      }

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
