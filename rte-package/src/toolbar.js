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

  // Define which groups should be in the primary (always visible) toolbar
  const primaryGroups = ['clipboard', 'formatting'];
  
  // Create primary toolbar container
  const primaryContainer = document.createElement('div');
  primaryContainer.className = 'rte__toolbar-primary';
  
  // Create overflow toolbar container (hidden by default)
  const overflowContainer = document.createElement('div');
  overflowContainer.className = 'rte__toolbar-overflow';
  overflowContainer.style.display = 'none';

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
              const keepSelectionCommands = ['fontName', 'fontSize', 'lineHeight', 'insertCodeBlock'];
              if (!keepSelectionCommands.includes(item.command)) {
                // show the label (default option) after action
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

    // Determine if this group goes in primary or overflow toolbar
    if (primaryGroups.includes(group.group)) {
      primaryContainer.appendChild(groupEl);
    } else {
      overflowContainer.appendChild(groupEl);
    }
  });

  // Create the toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'rte__toolbar-toggle';
  toggleButton.setAttribute('aria-label', 'Expand toolbar');
  toggleButton.setAttribute('data-tooltip', 'More options');
  toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
  toggleButton.type = 'button';
  
  // Add toggle functionality
  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = overflowContainer.style.display !== 'none';
    
    if (isExpanded) {
      overflowContainer.style.display = 'none';
      toggleButton.classList.remove('rte__toolbar-toggle--expanded');
      toggleButton.setAttribute('aria-label', 'Expand toolbar');
    } else {
      overflowContainer.style.display = 'flex';
      toggleButton.classList.add('rte__toolbar-toggle--expanded');
      toggleButton.setAttribute('aria-label', 'Collapse toolbar');
    }
  });

  // Append everything to the toolbar
  primaryContainer.appendChild(toggleButton);
  toolbar.appendChild(primaryContainer);
  toolbar.appendChild(overflowContainer);

  return toolbar;
};
