/* ============================================================
   MOYSIZ Search Logic
   Plate Number Formatting and Search Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const plateInput = document.getElementById('plate-input');
    const searchForm = document.getElementById('search-form');

    if (!plateInput) return;

    /**
     * Uzbekistan Plate Number Formatting
     * Handles formats like: 01A123BC, 90Q123AA, etc.
     */
    plateInput.addEventListener('input', (e) => {
        let cursorPosition = e.target.selectionStart;
        let originalValue = e.target.value;
        let cleaned = originalValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Formatting Logic
        let formatted = '';
        if (cleaned.length <= 2) {
            formatted = cleaned;
        } else if (cleaned.length <= 3) {
            formatted = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
        } else {
            // SEGMENT 1: Region code (01, 80, 90, etc)
            const region = cleaned.slice(0, 2);
            // SEGMENT 2: First letter(s) and numbers
            const rest = cleaned.slice(2);
            formatted = region + ' ' + rest;
        }

        // Apply formatted value
        e.target.value = formatted;
        
        // Restore cursor position (simple logic)
        if (originalValue.length < formatted.length) {
            cursorPosition++;
        }
        e.target.setSelectionRange(cursorPosition, cursorPosition);
    });

    /**
     * Search Form Feedback
     */
    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            const btn = searchForm.querySelector('button');
            const span = btn.querySelector('span');
            const icon = btn.querySelector('i');
            
            btn.disabled = true;
            if (span) span.textContent = 'Qidirilmoqda...';
            if (icon) {
                icon.setAttribute('data-lucide', 'loader-2');
                icon.classList.add('animate-spin');
                lucide.createIcons();
            }
        });
    }

    /**
     * Live Results Debounce (Future implementation)
     */
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Example: fetchResults = debounce((query) => { ... }, 300);
});
