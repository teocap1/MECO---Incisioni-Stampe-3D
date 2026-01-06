export class NavigationManager {
    constructor(app) {
        this.app = app;
    }

    setupNavigation() {
        console.log('🔧 Setup navigazione...');
        
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
            });
        });
    }

    setupMobileMenu() {
        console.log('📱 Setup menu mobile...');
        
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuBtn || !navMenu) {
            console.error('❌ Elementi menu non trovati');
            return;
        }
        
        // Rimuovi overlay esistente
        const existingOverlay = document.querySelector('.mobile-menu-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Crea overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        
        let isOpen = false;
        
        const openMenu = () => {
            console.log('👉 Apro menu');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            menuBtn.classList.add('active');
            menuBtn.querySelector('i').className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
            isOpen = true;
        };
        
        const closeMenu = () => {
            console.log('👈 Chiudo menu');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
            isOpen = false;
        };
        
        const toggleMenu = () => {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        };
        
        // Event listeners
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
        
        // Chiudi cliccando sui link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const sectionId = this.getAttribute('data-section');
                console.log('🔗 Click su link:', sectionId);
                
                closeMenu();
                
                setTimeout(() => {
                    if (sectionId && window.app) {
                        window.app.navigation.switchSection(sectionId);
                    }
                }, 300);
            });
        });
        
        // Chiudi con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });
        
        // Chiudi su resize a desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isOpen) {
                closeMenu();
            }
        });
        
        console.log('✅ Menu mobile configurato');
    }

    switchSection(sectionId) {
        console.log('🎯 Cambio sezione:', sectionId);
        
        // Nascondi tutte le sezioni
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostra sezione richiesta
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll in alto
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Aggiorna link attivo
            this.updateActiveNavLink(sectionId);
            
            // Carica contenuti specifici
            setTimeout(() => {
                switch(sectionId) {
                    case 'catalogo':
                        console.log('🛒 Carico catalogo');
                        this.app.products.filterProducts();
                        break;
                        
                    case 'favorites':
                        console.log('❤️ Carico preferiti');
                        this.app.favorites.displayFavorites();
                        break;
                        
                    case 'home':
                        console.log('🏠 Carico home');
                        // Aggiorna UI elementi
                        if (this.app.cart) {
                            this.app.cart.updateCartUI();
                        }
                        if (this.app.auth) {
                            this.app.auth.updateUI();
                        }
                        break;
                        
                    default:
                        console.log('📄 Carico sezione:', sectionId);
                }
            }, 100);
            
            console.log('✅ Sezione attivata:', sectionId);
        } else {
            console.error('❌ Sezione non trovata:', sectionId);
        }
    }

    updateActiveNavLink(sectionId) {
        console.log('🔘 Aggiorno link attivo per:', sectionId);
        
        // Rimuovi active da tutti
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Trova e attiva il link corrispondente
        const selector = `.nav-link[data-section="${sectionId}"]`;
        const activeLink = document.querySelector(selector);
        
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('✅ Link attivato:', selector);
        } else {
            console.warn('⚠️ Link non trovato:', selector);
        }
    }
}