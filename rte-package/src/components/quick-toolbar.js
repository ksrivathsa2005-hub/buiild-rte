/**
 * QuickToolbar - Context-sensitive floating toolbar for images
 */
export class QuickToolbar {
    constructor(editor) {
        this.editor = editor;
        this.element = null;
        this.currentTarget = null;
        this.parent = null;
        this.settings = null;
        this._init();
    }

    _init() {
        this.element = document.createElement('div');
        this.element.className = 'rte__quick-toolbar';
        this.element.style.display = 'none';

        // Wait for editor to be ready
        if (this.editor.editor && this.editor.editor.parentElement) {
            this.parent = this.editor.editor.parentElement;
            this.parent.appendChild(this.element);
        }

        // Handle clicks outside to hide toolbar
        document.addEventListener('mousedown', (e) => {
            if (this.element.style.display !== 'none' &&
                !this.element.contains(e.target) &&
                !this.editor.editor.contains(e.target)) {
                this.hide();
            }
        });

        // Get settings from editor config
        this.settings = this.editor.config.quickToolbarSettings || this._getDefaultSettings();
    }

    _getDefaultSettings() {
        return {
            image: [
                {
                    tooltip: 'Align Left',
                    icon: '<i class="fas fa-align-left"></i>',
                    action: (editor, el) => {
                        // Find the actual image element
                        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                        if (img) {
                            // Remove any existing alignment classes/styles
                            img.style.float = 'left';
                            img.style.margin = '0 15px 10px 0';
                            img.style.display = '';

                            // If wrapped in a span, update wrapper too
                            const wrapper = img.closest('span');
                            if (wrapper) {
                                wrapper.style.float = 'left';
                                wrapper.style.margin = '0 15px 10px 0';
                                wrapper.style.display = 'inline-block';
                            }
                        }
                    }
                },
                {
                    tooltip: 'Align Center',
                    icon: '<i class="fas fa-align-center"></i>',
                    action: (editor, el) => {
                        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                        if (img) {
                            img.style.float = 'none';
                            img.style.margin = '10px auto';
                            img.style.display = 'block';

                            const wrapper = img.closest('span');
                            if (wrapper) {
                                wrapper.style.float = 'none';
                                wrapper.style.margin = '10px auto';
                                wrapper.style.display = 'block';
                            }
                        }
                    }
                },
                {
                    tooltip: 'Align Right',
                    icon: '<i class="fas fa-align-right"></i>',
                    action: (editor, el) => {
                        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                        if (img) {
                            img.style.float = 'right';
                            img.style.margin = '0 0 10px 15px';
                            img.style.display = '';

                            const wrapper = img.closest('span');
                            if (wrapper) {
                                wrapper.style.float = 'right';
                                wrapper.style.margin = '0 0 10px 15px';
                                wrapper.style.display = 'inline-block';
                            }
                        }
                    }
                },
                {
                    tooltip: 'Delete',
                    icon: '<i class="fas fa-trash"></i>',
                    action: (editor, el) => {
                        // Remove the wrapper or the image itself
                        const wrapper = el.closest('span');
                        if (wrapper && wrapper.querySelector('img')) {
                            wrapper.remove();
                        } else {
                            el.remove();
                        }
                    }
                }
            ],
            video: [
                {
                    tooltip: 'Align Left',
                    icon: '<i class="fas fa-align-left"></i>',
                    action: (editor, el) => {
                        // Find the wrapper div (outermost container)
                        let wrapper = el.closest('.rte__video-wrapper');
                        if (!wrapper) {
                            // Fallback: find parent div that contains video/iframe
                            wrapper = el.closest('div');
                            while (wrapper && !wrapper.querySelector('video') && !wrapper.querySelector('iframe')) {
                                wrapper = wrapper.parentElement?.closest('div');
                            }
                        }
                        if (wrapper) {
                            wrapper.style.textAlign = 'left';
                            wrapper.style.marginLeft = '0';
                            wrapper.style.marginRight = 'auto';
                            wrapper.style.display = 'block';
                        }
                    }
                },
                {
                    tooltip: 'Align Center',
                    icon: '<i class="fas fa-align-center"></i>',
                    action: (editor, el) => {
                        let wrapper = el.closest('.rte__video-wrapper');
                        if (!wrapper) {
                            wrapper = el.closest('div');
                            while (wrapper && !wrapper.querySelector('video') && !wrapper.querySelector('iframe')) {
                                wrapper = wrapper.parentElement?.closest('div');
                            }
                        }
                        if (wrapper) {
                            wrapper.style.textAlign = 'center';
                            wrapper.style.marginLeft = 'auto';
                            wrapper.style.marginRight = 'auto';
                            wrapper.style.display = 'block';
                        }
                    }
                },
                {
                    tooltip: 'Align Right',
                    icon: '<i class="fas fa-align-right"></i>',
                    action: (editor, el) => {
                        let wrapper = el.closest('.rte__video-wrapper');
                        if (!wrapper) {
                            wrapper = el.closest('div');
                            while (wrapper && !wrapper.querySelector('video') && !wrapper.querySelector('iframe')) {
                                wrapper = wrapper.parentElement?.closest('div');
                            }
                        }
                        if (wrapper) {
                            wrapper.style.textAlign = 'right';
                            wrapper.style.marginLeft = 'auto';
                            wrapper.style.marginRight = '0';
                            wrapper.style.display = 'block';
                        }
                    }
                },
                {
                    tooltip: 'Delete',
                    icon: '<i class="fas fa-trash"></i>',
                    action: (editor, el) => {
                        let wrapper = el.closest('.rte__video-wrapper');
                        if (!wrapper) {
                            wrapper = el.closest('div');
                            while (wrapper && !wrapper.querySelector('video') && !wrapper.querySelector('iframe')) {
                                wrapper = wrapper.parentElement?.closest('div');
                            }
                        }
                        if (wrapper && (wrapper.querySelector('video') || wrapper.querySelector('iframe'))) {
                            wrapper.remove();
                        } else {
                            el.remove();
                        }
                    }
                }
            ],
            audio: [
                {
                    tooltip: 'Align Left',
                    icon: '<i class="fas fa-align-left"></i>',
                    action: (editor, el) => {
                        const container = el.closest('div');
                        if (container) {
                            container.style.textAlign = 'left';
                            container.style.margin = '10px 0';
                        }
                    }
                },
                {
                    tooltip: 'Align Center',
                    icon: '<i class="fas fa-align-center"></i>',
                    action: (editor, el) => {
                        const container = el.closest('div');
                        if (container) {
                            container.style.textAlign = 'center';
                            container.style.margin = '10px auto';
                        }
                    }
                },
                {
                    tooltip: 'Align Right',
                    icon: '<i class="fas fa-align-right"></i>',
                    action: (editor, el) => {
                        const container = el.closest('div');
                        if (container) {
                            container.style.textAlign = 'right';
                            container.style.margin = '10px 0';
                        }
                    }
                },
                {
                    tooltip: 'Delete',
                    icon: '<i class="fas fa-trash"></i>',
                    action: (editor, el) => {
                        const container = el.closest('div');
                        if (container && container.querySelector('audio')) {
                            container.remove();
                        } else {
                            el.remove();
                        }
                    }
                }
            ]
        };
    }

    show(target, type, rect) {
        if (!target || !rect || !['image', 'video', 'audio'].includes(type)) {
            this.hide();
            return;
        }

        this.currentTarget = target;

        // Clear previous buttons
        this.element.innerHTML = '';

        // Get buttons for this type
        const buttons = this.settings[type] || [];

        // Create buttons
        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.className = 'rte__quick-btn';
            btn.innerHTML = btnConfig.icon;
            btn.title = btnConfig.tooltip;
            btn.setAttribute('aria-label', btnConfig.tooltip);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (btnConfig.action) {
                    btnConfig.action(this.editor, this.currentTarget);
                } else if (btnConfig.command) {
                    this.editor.commandHandler.execute(btnConfig.command);
                }

                // Keep toolbar visible after action (except delete)
                if (btnConfig.tooltip !== 'Delete') {
                    // Re-position in case alignment changed dimensions
                    setTimeout(() => {
                        if (this.currentTarget && this.currentTarget.parentElement) {
                            const newRect = this.currentTarget.getBoundingClientRect();
                            this._position(newRect);
                        }
                    }, 50);
                } else {
                    this.hide();
                }
            });

            this.element.appendChild(btn);
        });

        // Position and show
        this._position(rect);
        this.element.style.display = 'flex';
    }

    hide() {
        this.element.style.display = 'none';
        this.currentTarget = null;
    }

    _position(rect) {
        if (!this.parent) return;

        const parentRect = this.parent.getBoundingClientRect();
        const toolbarHeight = 40; // Approximate height
        const toolbarWidth = this.element.offsetWidth || 200; // Approximate or actual width

        // Calculate position relative to parent
        let top = rect.top - parentRect.top - toolbarHeight - 10;
        let left = rect.left - parentRect.left + (rect.width / 2) - (toolbarWidth / 2);

        // Flip to bottom if not enough space above
        if (top < 0) {
            top = rect.bottom - parentRect.top + 10;
        }

        // Keep within horizontal bounds
        if (left < 0) {
            left = 10;
        } else if (left + toolbarWidth > parentRect.width) {
            left = parentRect.width - toolbarWidth - 10;
        }

        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;
    }
}
