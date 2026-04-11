/* ============================================================
   MOYSIZ Utilities & i18n
   Core Helping Functions and Translation System
   ============================================================ */

/**
 * i18n Translation Dictionary
 */
const i18n = {
    'uz': {
        'dashboard': 'Bosh panel',
        'users': 'Foydalanuvchilar',
        'services': 'STO markazlari',
        'search': 'Avto qidiruv',
        'logs': 'Xizmatlar jurnali',
        'broadcasts': 'Xabarlar',
        'export': 'Eksport',
        'status_online': 'ONLINE',
        'server_status': 'Server holati',
        'logout': 'Chiqish',
        'loading': 'Yuklanmoqda...',
        'search_placeholder': 'Qidirish...',
        'no_results': 'Ma\'lumot topilmadi',
        'confirm': 'Tasdiqlash',
        'cancel': 'Bekor qilish'
    },
    'cyr': {
        'dashboard': 'Бош панел',
        'users': 'Фойдаланувчилар',
        'services': 'СТО марказлари',
        'search': 'Авто қидирув',
        'logs': 'Хизматлар журнали',
        'broadcasts': 'Хабарлар',
        'export': 'Экспорт',
        'status_online': 'ОНЛАЙН',
        'server_status': 'Сервер ҳолати',
        'logout': 'Чиқиш',
        'loading': 'Юкланмоқда...',
        'search_placeholder': 'Қидириш...',
        'no_results': 'Маълумот топилмади',
        'confirm': 'Тасдиқлаш',
        'cancel': 'Бекор қилиш'
    },
    'ru': {
        'dashboard': 'Дашборд',
        'users': 'Пользователи',
        'services': 'СТО центры',
        'search': 'Поиск авто',
        'logs': 'Журнал услуг',
        'broadcasts': 'Рассылки',
        'export': 'Экспорт',
        'status_online': 'ОНЛАЙН',
        'server_status': 'Статус сервера',
        'logout': 'Выход',
        'loading': 'Загрузка...',
        'search_placeholder': 'Поиск...',
        'no_results': 'Данные не найдены',
        'confirm': 'Подтвердить',
        'cancel': 'Отмена'
    }
};

/**
 * Current language management
 */
let currentLang = localStorage.getItem('moysiz_lang') || 'uz';

function setLanguage(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        localStorage.setItem('moysiz_lang', lang);
        document.documentElement.lang = lang === 'uz' ? 'uz' : (lang === 'ru' ? 'ru' : 'uz');
        // In a real SPA we would trigger a UI update here
    }
}

function t(key) {
    return i18n[currentLang][key] || key;
}

/**
 * Data Formatting Helpers
 */
const formatters = {
    /**
     * Format number with thousand separators (Uzbek style: 1 234 567)
     */
    number: (num) => {
        return new Intl.NumberFormat('uz-UZ').format(num).replace(/,/g, ' ');
    },

    /**
     * Format currency (UZS)
     */
    currency: (num) => {
        return formatters.number(num) + ' so\'m';
    },

    /**
     * Format date (DD.MM.YYYY)
     */
    date: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('uz-UZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    /**
     * Format relative time (e.g. "5 min oldin")
     */
    relativeTime: (dateStr) => {
        const now = new Date();
        const past = new Date(dateStr);
        const diffMs = now - past;
        const diffMin = Math.floor(diffMs / 60000);
        
        if (diffMin < 1) return 'Hozirgina';
        if (diffMin < 60) return `${diffMin} daqiqa oldin`;
        
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} soat oldin`;
        
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 7) return `${diffDay} kun oldin`;
        
        return formatters.date(dateStr);
    },

    /**
     * Format Uzbekistan Phone Number
     */
    phone: (phone) => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
        return phone;
    },

    /**
     * Format Uzbekistan License Plate
     */
    plate: (plate) => {
        return plate.toUpperCase().replace(/\s/g, '').replace(/^(\d{2})([A-Z])(\d{3})([A-Z]{2})$/, '$1 $2$3$4');
    }
};

// Export to global scope
window.moysiz = {
    t,
    setLanguage,
    formatters
};
