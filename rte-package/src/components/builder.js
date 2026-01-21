/**
 * Component Builder - Creates UI elements with proper accessibility and state management
 * Supports Font Awesome icons and professional styling
 */

export const createButton = (config) => {
  const button = document.createElement('button');
  button.className = `rte__btn ${config.className || ''}`;
  button.type = 'button';
  
  // Support for both icon HTML (e.g., <i class="fas fa-bold"></i>) and text
  if (config.icon) {
    if (config.icon.includes('<i') || config.icon.includes('<svg')) {
      button.innerHTML = config.icon;
    } else {
      button.textContent = config.icon;
    }
  } else {
    button.textContent = config.label;
  }
  
  button.setAttribute('aria-label', config.label);
  button.setAttribute('aria-pressed', 'false');
  button.title = config.label;
  button.dataset.command = config.command;
  button.dataset.value = config.value || '';
  
  if (config.onclick) {
    button.onclick = config.onclick;
  }
  
  return button;
};

export const createSelect = (config) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'rte__select-wrapper';
  
  const select = document.createElement('select');
  select.className = `rte__select ${config.className || ''}`;
  select.setAttribute('aria-label', config.label);
  select.dataset.command = config.command;
  
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = config.label;
  select.appendChild(defaultOption);

  config.options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  if (config.onchange) {
    select.onchange = config.onchange;
  }
  
  wrapper.appendChild(select);
  return wrapper;
};

export const createColorPicker = (config) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'rte__color-wrapper';
  
  const input = document.createElement('input');
  input.type = 'color';
  input.className = 'rte__color-picker';
  input.setAttribute('aria-label', config.label);
  input.title = config.label;
  input.value = config.value || '#000000';
  input.dataset.command = config.command;
  
  if (config.oninput) {
    input.oninput = config.oninput;
  }

  wrapper.appendChild(input);
  return wrapper;
};

export const createRangeSlider = (config) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'rte__range-wrapper';

  const input = document.createElement('input');
  input.type = 'range';
  input.className = 'rte__range-slider';
  input.min = config.min || '0.8';
  input.max = config.max || '1.5';
  input.step = config.step || '0.1';
  input.value = config.value || '1';
  input.setAttribute('aria-label', config.label);
  input.dataset.command = config.command;
  
  if (config.oninput) {
    input.oninput = config.oninput;
  }

  wrapper.appendChild(input);
  return wrapper;
};

export const createModal = (config) => {
  const modal = document.createElement('div');
  modal.className = 'rte__modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', config.title);

  const backdrop = document.createElement('div');
  backdrop.className = 'rte__modal-backdrop';

  const content = document.createElement('div');
  content.className = 'rte__modal-content';

  const header = document.createElement('div');
  header.className = 'rte__modal-header';
  header.innerHTML = `
    <h3>${config.title}</h3>
    <button type="button" class="rte__modal-close" aria-label="Close">&times;</button>
  `;

  const body = document.createElement('div');
  body.className = 'rte__modal-body';
  if (config.content) {
    body.innerHTML = config.content;
  }

  const footer = document.createElement('div');
  footer.className = 'rte__modal-footer';
  if (config.buttons) {
    config.buttons.forEach(btn => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `rte__btn ${btn.className || ''}`;
      button.textContent = btn.label;
      button.onclick = btn.onclick;
      footer.appendChild(button);
    });
  }

  content.appendChild(header);
  content.appendChild(body);
  if (config.buttons) content.appendChild(footer);

  modal.appendChild(backdrop);
  modal.appendChild(content);

  const closeBtn = header.querySelector('.rte__modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      if (config.onClose) config.onClose();
    };
  }

  backdrop.onclick = () => {
    modal.style.display = 'none';
    if (config.onClose) config.onClose();
  };

  return modal;
};

export const createTooltip = (text) => {
  const tooltip = document.createElement('span');
  tooltip.className = 'rte__tooltip';
  tooltip.textContent = text;
  return tooltip;
};

export const createButtonGroup = (config) => {
  const group = document.createElement('div');
  group.className = 'rte__btn-group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', config.label || 'Button group');

  config.buttons.forEach(btnConfig => {
    const btn = createButton(btnConfig);
    group.appendChild(btn);
  });

  return group;
};

export const createToggleButton = (config) => {
  const button = createButton(config);
  button.classList.add('rte__btn--toggle');
  button.dataset.toggled = 'false';
  
  const originalOnClick = button.onclick;
  button.onclick = (e) => {
    const toggled = button.dataset.toggled === 'false';
    button.dataset.toggled = String(toggled);
    button.classList.toggle('rte__btn--active', toggled);
    button.setAttribute('aria-pressed', String(toggled));
    if (originalOnClick) originalOnClick(e);
  };
  
  return button;
};
