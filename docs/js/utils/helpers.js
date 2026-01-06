// Formatta il prezzo in euro
export function formatPrice(price, includeSymbol = true) {
    if (price === undefined || price === null) return '0,00€';
    
    const formatted = new Intl.NumberFormat('it-IT', {
        style: includeSymbol ? 'currency' : 'decimal',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(parseFloat(price));
    
    return formatted;
}

// Formatta la data italiana
export function formatDate(dateString, includeTime = false) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }
    
    return date.toLocaleDateString('it-IT', options);
}

// Etichette per le categorie
export function getCategoryLabel(category) {
    const labels = {
        'bambini': 'Bambini',
        'arredamento': 'Arredamento',
        'decorazioni': 'Decorazioni',
        'pasqua': 'Pasqua',
        'gadget': 'Gadget',
        'giochi': 'Giochi',
        'incisioni': 'Incisioni Laser',
        'stampe3d': 'Stampe 3D',
        'promozioni': 'Promozioni',
        'nuovo': 'Novità',
        'regali': 'Idee Regalo'
    };
    return labels[category] || category;
}

// Sistema di notifiche migliorato
export function showNotification(message, type = 'info', duration = 4000) {
    // Rimuovi notifiche precedenti
    const existingNotifications = document.querySelectorAll('.meco-notification');
    existingNotifications.forEach(n => {
        n.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => n.remove(), 300);
    });
    
    const colors = {
        success: { 
            bg: 'rgba(76, 175, 80, 0.95)', 
            border: 'rgba(56, 142, 60, 0.5)',
            icon: 'check-circle',
            title: 'Successo'
        },
        error: { 
            bg: 'rgba(255, 71, 87, 0.95)', 
            border: 'rgba(211, 47, 47, 0.5)',
            icon: 'exclamation-circle',
            title: 'Errore'
        },
        info: { 
            bg: 'rgba(0, 198, 255, 0.95)', 
            border: 'rgba(2, 136, 209, 0.5)',
            icon: 'info-circle',
            title: 'Informazione'
        },
        warning: { 
            bg: 'rgba(255, 193, 7, 0.95)', 
            border: 'rgba(245, 124, 0, 0.5)',
            icon: 'exclamation-triangle',
            title: 'Attenzione'
        }
    };
    
    const config = colors[type] || colors.info;
    
    // Aggiungi stili CSS se non esistono
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .meco-notification {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                padding: 15px 20px !important;
                border-radius: 12px !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                z-index: 10001 !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                animation: slideInRight 0.3s ease !important;
                max-width: 350px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                border: 1px solid !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    const notification = document.createElement('div');
    notification.className = 'meco-notification';
    notification.style.cssText = `
        background: ${config.bg};
        border-color: ${config.border};
        color: white;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
            <div style="
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">
                <i class="fas fa-${config.icon}" style="font-size: 18px;"></i>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 3px;">${config.title}</div>
                <div style="font-size: 13px; opacity: 0.9; word-break: break-word;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                        background: rgba(255,255,255,0.2); 
                        border: none; 
                        width: 30px; 
                        height: 30px; 
                        border-radius: 50%; 
                        color: white; 
                        cursor: pointer; 
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        transition: background 0.2s;
                    "
                    onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Rimuovi dopo il tempo specificato
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }
    
    return notification;
}

// Calcola prezzo scontato
export function calculateDiscountedPrice(basePrice, discountPercent) {
    if (!basePrice || basePrice <= 0) return 0;
    if (!discountPercent || discountPercent <= 0) return parseFloat(basePrice);
    
    const discountAmount = parseFloat(basePrice) * (parseFloat(discountPercent) / 100);
    const discounted = parseFloat(basePrice) - discountAmount;
    
    // Arrotonda a 2 decimali
    return Math.round(discounted * 100) / 100;
}

// Validazione email
export function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Validazione telefono italiano
export function isValidItalianPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+39)?[0-9]{9,13}$/;
    return phoneRegex.test(cleanPhone);
}

// Validazione CAP italiano
export function isValidItalianCAP(cap) {
    if (!cap) return false;
    const capRegex = /^[0-9]{5}$/;
    return capRegex.test(cap.trim());
}

// Validazione provincia italiana
export function isValidItalianProvince(province) {
    if (!province || province.length !== 2) return false;
    const provinceRegex = /^[A-Z]{2}$/;
    return provinceRegex.test(province.toUpperCase().trim());
}

// Debounce per ottimizzare performance
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle per ottimizzare performance
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Salva dati nel localStorage con validazione
export function saveToStorage(key, data) {
    try {
        if (typeof data === 'undefined') {
            console.warn(`Tentativo di salvare undefined per la chiave: ${key}`);
            return false;
        }
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('❌ Errore salvataggio localStorage:', error);
        showNotification('Errore nel salvataggio dati locali', 'error');
        return false;
    }
}

// Carica dati dal localStorage con validazione
export function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return defaultValue;
        
        const parsed = JSON.parse(data);
        
        // Validazione base
        if (parsed === null || typeof parsed === 'undefined') {
            return defaultValue;
        }
        
        return parsed;
    } catch (error) {
        console.error('❌ Errore caricamento localStorage:', error);
        // Pulisci dato corrotto
        localStorage.removeItem(key);
        return defaultValue;
    }
}

// Genera ID univoco
export function generateUniqueId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}${random}`;
}

// Calcola totale carrello
export function calculateCartTotal(items, getProductPrice) {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
        const price = getProductPrice ? getProductPrice(item.productId) : (item.product?.base_price || 0);
        return total + (price * (item.quantity || 1));
    }, 0);
}

// Formatta quantità (singolare/plurale)
export function formatQuantity(quantity, singular, plural) {
    return quantity === 1 ? singular : plural;
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
}

// Sanitizza input utente (basic)
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
}

// Delay per animazioni
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Copia testo negli appunti
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copiato negli appunti!', 'success', 2000);
        return true;
    } catch (err) {
        console.error('Errore copia:', err);
        showNotification('Errore nella copia', 'error');
        return false;
    }
}

// Controlla se è mobile
export function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Calcola differenza giorni
export function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Aggiungi questa funzione per formattare i nomi delle categorie nell'URL
export function formatCategoryForUrl(category) {
    return category
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

// Sistema notifiche avanzato
export class NotificationManager {
    static notifications = [];
    
    static show(message, type = 'info', duration = 3000) {
        const id = Date.now();
        const notification = {
            id,
            message,
            type,
            duration
        };
        
        this.notifications.push(notification);
        this.render();
        
        // Auto-rimuovi dopo duration
        setTimeout(() => {
            this.remove(id);
        }, duration);
        
        return id;
    }
    
    static remove(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.render();
    }
    
    static render() {
        let container = document.getElementById('notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-toast ${notification.type}" 
                 style="animation: slideIn 0.3s ease;">
                <i class="fas fa-${getIcon(notification.type)}"></i>
                <span>${notification.message}</span>
                <button onclick="NotificationManager.remove(${notification.id})" 
                        style="background: none; border: none; color: inherit; 
                               cursor: pointer; margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
}

// Aggiungi stili
const style = document.createElement('style');
style.textContent = `
    .notification-toast {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        padding: 15px 20px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    
    .notification-toast.success {
        border-left: 4px solid #4CAF50;
    }
    
    .notification-toast.error {
        border-left: 4px solid #ff4757;
    }
    
    .notification-toast.warning {
        border-left: 4px solid #FFC107;
    }
    
    .notification-toast.info {
        border-left: 4px solid #00c6ff;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
