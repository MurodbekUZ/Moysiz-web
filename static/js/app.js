/* ============================================================
   MOYSIZ Main Application Logic
   Global Systems: Notifications, Health Check, and UI Init
   ============================================================ */

/**
 * Global Notification System (Toast)
 */
const notify = {
    /**
     * Show a toast notification
     * @param {string} message - Text to display
     * @param {string} type - success, error, warning, info
     */
    show: (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'x-circle';
        if (type === 'warning') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <div class="toast-content">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);
        lucide.createIcons();

        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    success: (msg) => notify.show(msg, 'success'),
    error: (msg) => notify.show(msg, 'error'),
    warning: (msg) => notify.show(msg, 'warning'),
    info: (msg) => notify.show(msg, 'info')
};

// Export notify system to global scope
window.notify = notify;

/**
 * Server Health Check Ping
 */
async function checkServerHealth() {
    const statusDot = document.querySelector('.status-dot');
    if (!statusDot) return;

    try {
        const response = await fetch('/health');
        if (response.ok) {
            statusDot.className = 'status-dot online animate-status-pulse';
        } else {
            statusDot.className = 'status-dot offline';
            statusDot.style.background = 'var(--color-danger)';
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusDot.style.background = 'var(--color-danger)';
    }
}

/**
 * UI Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initial server check
    checkServerHealth();
    // Re-check every 30 seconds
    setInterval(checkServerHealth, 30000);

    /**
     * Tooltip init (Future implementation)
     */
    
    /**
     * Modal focus trap (Future implementation)
     */
});

/**
 * Error Handling for Fetch
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // notify.error("Tarmoq xatosi. Iltimos, ulanishni tekshiring.");
});
