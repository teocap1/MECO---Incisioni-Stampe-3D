import { ProductsManager } from './modules/products.js';
import { PromotionsManager } from './modules/promotions.js';
import { FavoritesManager } from './modules/favorites.js';
import { ModalManager } from './modules/modal.js';
import { NavigationManager } from './modules/navigation.js';
import { UIManager } from './modules/ui.js';
import { AuthManager } from './modules/auth.js';
import { CartManager } from './modules/cart.js';  
import { CheckoutManager } from './modules/checkout.js';
import { AdminManager } from './modules/admin.js';
import { AnalyticsManager } from './modules/analytics.js';
import { NotificationManager } from './utils/helpers.js';
import { supabaseClient } from './services/supabase-service.js';


import { debugModals, forceCloseAllModals } from './debug.js';


class MECOWebsite {
    constructor() {
        console.log('🚀 Inizializzazione MECO Website');

        // ESPONI SUPABASE ALL'APP
        this.supabase = supabaseClient;
        
        // INIZIALIZZA PRIMA I MODULI BASE
        this.products = new ProductsManager(this);
        this.promotions = new PromotionsManager(this);
        this.favorites = new FavoritesManager(this);
        this.modal = new ModalManager(this);
        this.navigation = new NavigationManager(this);
        this.ui = new UIManager(this);
        
        // POI I MODULI E-COMMERCE
        this.auth = new AuthManager(this);
        this.cart = new CartManager(this);
        this.checkout = new CheckoutManager(this);

        this.admin = new AdminManager(this);
        this.analytics = new AnalyticsManager(this);
        
        // Esponi globalmente
        window.app = this;
        window.NotificationManager = NotificationManager;
        
        console.log('✅ Tutti i moduli inizializzati');
        console.log('Moduli:', {
            auth: !!this.auth,
            cart: !!this.cart,
            checkout: !!this.checkout,
            products: !!this.products
        });
    }

    async init() {
        console.log('🔧 Setup iniziale...');
        
        // Setup base
        this.navigation.setupNavigation();
        this.navigation.setupMobileMenu();
        await this.products.loadProducts();
        this.ui.setupFilters();
        this.ui.setupModal();
        this.ui.setupContactForm();

        // Setup modali auth PRIMA di caricare prodotti
        if (this.auth && this.auth.setupModalListeners) {
            this.auth.setupModalListeners();
        }
        
        // Setup favoriti
        this.favorites.updateFavoritesCount();
        
        // Setup promozioni
        this.promotions.startPromotions();
        this.promotions.updatePromoBannerVisibility();
        this.promotions.updatePromoBanners();

        // Setup notifiche
        this.setupNotifications();
        
        // Verifica connessione database
        await this.testDatabaseConnection();
        
        // Setup Auth e Carrello (ASPETTA che auth sia pronto)
        try {
            await this.auth.init();
            console.log('✅ Auth inizializzato');
            
            // Carica carrello dal server
            await this.cart.loadCartFromServer();
            
            // Sincronizza quando l'utente cambia stato
            this.auth.onAuthStateChange = (user) => {
                if (user) {
                    this.cart.loadCartFromServer();
                } else {
                    this.cart.loadFromLocalStorage();
                }
            };
            
        } catch (error) {
            console.error('Errore inizializzazione auth/cart:', error);
        }

        // Test database (non bloccante)
        setTimeout(() => {
            this.testDatabaseConnection().then(success => {
                if (success) {
                    console.log('🎉 Database connesso!');
                } else {
                    console.log('⚠️ Database potrebbe non essere raggiungibile - funzionalità limitate');
                }
            });
        }, 2000);
        
        console.log('✅ Inizializzazione completata');
        
        // DEBUG: Verifica che tutto funzioni
        console.log('App disponibile globalmente:', {
            auth: typeof window.app?.auth !== 'undefined',
            cart: typeof window.app?.cart !== 'undefined',
            cartFunctions: window.app?.cart ? Object.keys(window.app.cart) : []
        });

        window.debugModals = debugModals;
        window.forceCloseAllModals = forceCloseAllModals;
    }

    setupNotifications() {
        // Inietta stili per le notifiche
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
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // In app.js, aggiorna il metodo testDatabaseConnection
    async testDatabaseConnection() {
        try {
            console.log('🔍 Test connessione database...');
            
            if (!this.supabase) {
                console.error('❌ Supabase non definito');
                return false;
            }
            
            // Test semplice
            const { data, error } = await this.supabase
                .from('products')
                .select('id')
                .limit(1);
            
            if (error) {
                console.log('⚠️ Errore database:', error.message);
                return false;
            }
            
            console.log('✅ Database connesso correttamente');
            return true;
            
        } catch (error) {
            console.error('❌ Errore test database:', error);
            return false;
        }
    }

    async testSupabaseDirect() {
        try {
            const response = await fetch('https://lakohmwnieglenrqvbaz.supabase.co/rest/v1/products?select=id&limit=1', {
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha29obXduaWVnbGVucnF2YmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDYzODQsImV4cCI6MjA4MzE4MjM4NH0.0iSPz0WS8XPBBFd4pNMayLNPDq-fg9GSp8JIyCxSCWc',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('✅ Supabase raggiungibile via fetch');
            } else {
                console.log('❌ Supabase non raggiungibile');
            }
        } catch (error) {
            console.log('❌ Errore fetch Supabase:', error.message);
        }
    }
    
    async testSupabaseProducts() {
        setTimeout(async () => {
            try {
                const { data: products, error } = await supabase
                    .from('products')
                    .select('*')
                    .limit(5);
                
                if (error) {
                    console.log('ℹ️ Database vuoto o in configurazione');
                    return;
                }
                
                console.log(`📦 ${products?.length || 0} prodotti disponibili in Supabase`);
                
                if (products.length > 0) {
                    console.log('Elenco prodotti:');
                    products.forEach(p => console.log(`- ${p.name}: €${p.base_price}`));
                }
            } catch (error) {
                console.log('⚠️ Test prodotti non riuscito:', error.message);
            }
        }, 1500);
    }
}


// Inizializza l'app
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM caricato, inizializzo app...');
    window.app = new MECOWebsite();
    
    // Attendi che il DOM sia completamente pronto
    setTimeout(async () => {
        try {
            await window.app.init();
            console.log('🎉 App pronta!');
            
            // Debug info
            console.log('App disponibile globalmente:', !!window.app);
            console.log('Supabase disponibile:', !!window.app.supabase);
            
        } catch (error) {
            console.error('❌ Errore inizializzazione app:', error);
        }
    }, 100);
});

function optimizeVideosForMobile() {
    if (window.innerWidth < 768) {
        console.log('📱 Ottimizzazione video per mobile');
        
        const videos = document.querySelectorAll('.machinery-video video');
        videos.forEach(video => {
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.removeAttribute('autoplay');
            
            // Gestione caricamento
            video.addEventListener('loadstart', function() {
                const loading = this.parentElement.querySelector('.video-loading');
                if (loading) loading.style.display = 'block';
            });
            
            video.addEventListener('canplay', function() {
                const loading = this.parentElement.querySelector('.video-loading');
                if (loading) loading.style.display = 'none';
            });
            
            video.addEventListener('error', function() {
                const loading = this.parentElement.querySelector('.video-loading');
                if (loading) {
                    loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore caricamento';
                    loading.style.color = '#ff4757';
                }
            });
        });
        
        // Gestisci un video alla volta
        let currentlyPlaying = null;
        
        videos.forEach(video => {
            video.addEventListener('play', function() {
                if (currentlyPlaying && currentlyPlaying !== this) {
                    currentlyPlaying.pause();
                }
                currentlyPlaying = this;
            });
            
            video.addEventListener('pause', function() {
                if (currentlyPlaying === this) {
                    currentlyPlaying = null;
                }
            });
        });
    }
}

function forceVideoDisplay() {
    const videos = document.querySelectorAll('.machinery-video video');
    
    videos.forEach(video => {
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
        
        const rect = video.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        if (!isVisible) {
            console.warn('Video non visibile:', video);
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';
        }
    });
    
    const videoContainer = document.querySelector('.video-section');
    if (videoContainer) {
        const containerRect = videoContainer.getBoundingClientRect();
        console.log('Container video:', {
            width: containerRect.width,
            height: containerRect.height,
            visible: containerRect.width > 0
        });
    }
}

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', function() {
    optimizeVideosForMobile();
    window.addEventListener('resize', optimizeVideosForMobile);
});

// Test Supabase - versione corretta
setTimeout(async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(1);
        
        if (!error) {
            console.log('🎉 Supabase connesso! Prodotti disponibili.');
        }
    } catch (error) {
        console.log('ℹ️ Supabase OK ma prodotti non ancora inseriti');
    }
}, 2000);