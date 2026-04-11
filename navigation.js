/* ============================================================
   MOYSIZ Navigation
   Sidebar, Mobile Drawer, and Active Link State Management
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const body = document.body;

    /**
     * Mobile Sidebar Logic
     */
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
            
            // Prevent body scroll when menu is open on mobile
            if (sidebar.classList.contains('open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            body.style.overflow = '';
        });
    }

    /**
     * Active Link Highlighting
     * Automatically syncs active state based on current URL
     */
    const syncActiveLinks = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                // link.classList.remove('active'); // Keep HTML provided active state by default
            }
        });
    };

    syncActiveLinks();

    /**
     * Responsive Adjustments
     */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            body.style.overflow = '';
        }
    });

    /**
     * Ripple Effect for Buttons (Micro-interaction)
     */
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
             // Subtle hover sound or haptic feedback could go here
        });
    });
});
