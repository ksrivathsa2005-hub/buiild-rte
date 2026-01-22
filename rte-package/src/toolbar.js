import {
  createButton,
  createSelect,
  createColorPicker,
  createRangeSlider
} from './components/builder.js';

export const createToolbar = (config, actions) => {
  const toolbar = document.createElement('header');
  toolbar.className = 'rte__toolbar';
  toolbar.setAttribute('role', 'toolbar');

  config.toolbar.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'rte__toolbar-group';
    if (group.group) {
      groupEl.setAttribute('data-group', group.group);
    }

    group.items.forEach(item => {
      if (item.type === 'button') {
        const btn = createButton({
          label: item.label,
          icon: item.icon || item.label,
          command: item.command,
          value: item.value || '',
          className: item.className || '',
          onclick: (e) => {
            e.preventDefault();
            actions.execute(item.command, item.value);
          }
        });
        groupEl.appendChild(btn);
      } else if (item.type === 'select') {
        const select = createSelect({
          label: item.label,
          command: item.command,
          options: item.options || [],
          className: item.className || '',
          onchange: (e) => {
            if (e.target.value) {
              actions.execute(item.command, e.target.value);
              // Only reset for certain commands (like insertCodeBlock)
              // Keep the selection for font, size, and lineHeight
              const keepSelectionCommands = ['fontName', 'fontSize', 'lineHeight'];
              if (!keepSelectionCommands.includes(item.command)) {
                e.target.selectedIndex = 0;
              }
            }
          }
        });
        groupEl.appendChild(select);
      } else if (item.type === 'color') {
        const colorPicker = createColorPicker({
          label: item.label,
          command: item.command,
          value: item.value || '#000000',
          oninput: (e) => {
            actions.execute(item.command, e.target.value);
          }
        });
        groupEl.appendChild(colorPicker);
      } else if (item.type === 'range') {
        const rangeSlider = createRangeSlider({
          label: item.label,
          command: item.command,
          min: item.min,
          max: item.max,
          step: item.step,
          value: item.value,
          oninput: (e) => {
            actions.execute(item.command, e.target.value);
          }
        });
        groupEl.appendChild(rangeSlider);
      }
    });

    toolbar.appendChild(groupEl);
  });

  return toolbar;
};
