/* ============================================================
   MOYSIZ Charts Configuration
   Shared Chart.js Defaults and Global Styling
   ============================================================ */

/**
 * Global Chart.js Defaults
 * Ensures character matches the design system
 */
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#94a3b8'; // text-secondary
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.elements.line.tension = 0.4;
    Chart.defaults.elements.point.radius = 4;
    Chart.defaults.elements.point.hoverRadius = 6;
    
    // Custom Chart styles can be added here
    window.moysizCharts = {
        colors: {
            primary: '#3b82f6',
            secondary: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            bg: 'rgba(59, 130, 246, 0.1)'
        }
    };
}
