/**
 * DraggableImage - Handles drag and drop functionality for images within the editor
 */
export class DraggableImage {
    constructor(rte) {
        this.rte = rte;
        this.editor = rte.editor;
        this.draggedElement = null;
        this._init();
    }

    _init() {
        this.editor.addEventListener('dragstart', this._handleDragStart.bind(this));
        this.editor.addEventListener('dragover', this._handleDragOver.bind(this));
        this.editor.addEventListener('drop', this._handleDrop.bind(this));
        this.editor.addEventListener('dragend', this._handleDragEnd.bind(this));
    }

    _handleDragStart(e) {
        const target = e.target;

        // We expect the image to be wrapped in a span with contenteditable="false" (from handler.js)
        // Sometimes the user clicks the img, sometimes the span.
        let wrapper = null;

        if (target.tagName === 'IMG') {
            wrapper = target.closest('span');
        } else if (target.tagName === 'SPAN' && target.querySelector('img')) {
            wrapper = target;
        }

        // fallback: if straight image without wrapper (legacy content) or wrapper check failed
        if (!wrapper && target.tagName === 'IMG') {
            // Create wrapper on the fly if needed? 
            // For now, let's treat the IMG as the draggable element if no wrapper found
            wrapper = target;
        }

        if (wrapper && this.editor.contains(wrapper)) {
            this.draggedElement = wrapper;

            // Set drag effect
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', wrapper.outerHTML);

            // Visual feedback - reduce opacity
            // Use setTimeout to ensure the drag image is generated before we fade the element
            setTimeout(() => {
                if (this.draggedElement) this.draggedElement.style.opacity = '0.4';
            }, 0);
        }
    }

    _handleDragOver(e) {
        if (this.draggedElement) {
            e.preventDefault(); // Necessary to allow dropping
            e.dataTransfer.dropEffect = 'move';
        }
    }

    _handleDrop(e) {
        if (!this.draggedElement) return;

        e.preventDefault();
        e.stopPropagation(); // Stop browser's default handling

        const range = this._getRangeFromPoint(e.clientX, e.clientY);

        if (range) {
            // Don't drop inside itself or its children
            if (this.draggedElement.contains(range.commonAncestorContainer)) {
                return;
            }

            // Check if we are still inside the editor
            if (!this.editor.contains(range.commonAncestorContainer)) {
                return;
            }

            // Remove the original element from its old position
            if (this.draggedElement.parentNode) {
                this.draggedElement.parentNode.removeChild(this.draggedElement);
            }

            // Insert at the new position
            range.insertNode(this.draggedElement);

            // Restore styles
            this.draggedElement.style.opacity = '';

            // Select the moved element
            const selection = window.getSelection();
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNode(this.draggedElement);
            selection.addRange(newRange);

            // Trigger update for QuickToolbar to appear at new location
            // Using a small timeout to let the DOM settle
            setTimeout(() => {
                // Trigger a fake mouseup or just call logic
                if (this.rte && this.rte._handleQuickToolbar) {
                    this.rte._handleQuickToolbar({ target: this.draggedElement });
                }
            }, 50);

            // Save history state
            if (this.rte && this.rte.commandHandler) {
                this.rte.commandHandler._saveToHistory();
            }
        }

        this.draggedElement = null;
    }

    _handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.style.opacity = '';
            this.draggedElement = null;
        }
    }

    _getRangeFromPoint(x, y) {
        if (document.caretRangeFromPoint) {
            return document.caretRangeFromPoint(x, y);
        } else if (document.caretPositionFromPoint) {
            // Mozilla-specific
            const pos = document.caretPositionFromPoint(x, y);
            const range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse(true);
            return range;
        }
        return null;
    }
}
