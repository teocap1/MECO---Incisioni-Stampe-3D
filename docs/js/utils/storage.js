// LocalStorage utilities
export const Storage = {
    get(key, defaultValue = null) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// Chiavi specifiche
export const STORAGE_KEYS = {
    FAVORITES: 'meco_favorites',
    REVIEWS: 'meco_shared_reviews',
    CLOSED_BANNERS: 'meco_closed_banners',
    PROMO_CLOSED: 'meco_promo_closed_date'
};