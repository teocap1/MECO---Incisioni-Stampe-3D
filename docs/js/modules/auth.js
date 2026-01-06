import { supabaseClient } from '../services/supabase-service.js';
import { showNotification } from '../utils/helpers.js';

export class AuthManager {
    constructor(app) {
        console.log('🔐 AuthManager inizializzato');
        this.app = app;
        this.user = null;
        this.setupAuthListener();
        this.setupModalListeners();
    }

    // In AuthManager, aggiungi questi metodi
    setupModalListeners() {
        console.log('🔧 Setup listener modali');
        
        // Listener per modale login
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            // Bottone chiudi (X)
            const loginClose = loginModal.querySelector('.modal-close');
            if (loginClose) {
                loginClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeLoginModal();
                });
            }
            
            // Chiudi cliccando fuori
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    this.closeLoginModal();
                }
            });
            
            // Chiudi con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && loginModal.style.display === 'flex') {
                    this.closeLoginModal();
                }
            });
        }
        
        // Listener per modale registrazione
        const signupModal = document.getElementById('signup-modal');
        if (signupModal) {
            // Bottone chiudi (X)
            const signupClose = signupModal.querySelector('.modal-close');
            if (signupClose) {
                signupClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeSignupModal();
                });
            }
            
            // Chiudi cliccando fuori
            signupModal.addEventListener('click', (e) => {
                if (e.target === signupModal) {
                    this.closeSignupModal();
                }
            });
            
            // Chiudi con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && signupModal.style.display === 'flex') {
                    this.closeSignupModal();
                }
            });
        }
    }

    setupAuthListener() {
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth state changed:', event, session?.user?.email);
            this.user = session?.user || null;
            this.updateUI();
            
            if (event === 'SIGNED_IN') {
                showNotification('Accesso effettuato! Benvenuto!', 'success');
                
                // IMPORTANTE: Sincronizza carrello
                if (this.app.cart) {
                    // Carica carrello dal server
                    await this.app.cart.loadCartFromServer();
                }
                
            } else if (event === 'SIGNED_OUT') {
                showNotification('Logout effettuato', 'info');
                
                // IMPORTANTE: Mantieni carrello locale ma scollegato dal server
                if (this.app.cart) {
                    this.app.cart.loadFromLocalStorage();
                    this.app.cart.updateCartUI();
                }
            }
        });
    }

    async init() {
        console.log('🔐 Auth init...');
        try {

            // Verifica che supabaseClient sia disponibile
            if (!supabaseClient) {
                throw new Error('supabaseClient non configurato');
            }
            
            // Prima controlla se supabaseClient è disponibile
            if (!this.app.supabaseClient) {
                console.error('❌ supabaseClient non disponibile in auth.init');
                throw new Error('supabaseClient non configurato');
            }
            
            const { data: { user }, error } = await this.app.supabaseClient.auth.getUser();
            
            if (error) {
                console.log('🔐 Nessun utente loggato o errore:', error.message);
                
                // Se è un errore 403, potrebbe essere CORS
                if (error.message.includes('403')) {
                    console.warn('⚠️ Possibile errore CORS o URL non autorizzato');
                    console.warn('Verifica che:');
                    console.warn('1. Il dominio sia autorizzato in supabaseClient Dashboard');
                    console.warn('2. URL autorizzati: https://mecoincisioniestampe3d.netlify.app');
                    console.warn('3. E anche: http://localhost:* per sviluppo');
                }
                
                this.user = null;
            } else {
                this.user = user;
                console.log('👤 Utente loggato:', user?.email);
            }
            
            this.updateUI();
            return user;
            
        } catch (error) {
            console.error('❌ Errore init auth:', error);
            this.user = null;
            this.updateUI();
            return null;
        }
    }

    // Aggiungi metodo per controllare la configurazione
    checkConfig() {
        console.log('🔧 Verifica configurazione supabaseClient:');
        
        const config = this.app.supabaseClient?.supabaseClientUrl ? {
            url: this.app.supabaseClient.supabaseClientUrl,
            key: this.app.supabaseClient.supabaseClientKey ? '***' + this.app.supabaseClient.supabaseClientKey.slice(-4) : 'non definita'
        } : 'non configurato';
        
        console.log('Configurazione:', config);
        
        // Verifica URL corrente
        const currentUrl = window.location.origin;
        console.log('URL corrente:', currentUrl);
        
        return {
            configured: !!this.app.supabaseClient,
            currentUrl: currentUrl
        };
    }

    updateUI() {
        console.log('🎨 Aggiorno UI auth');
        
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        
        if (this.user) {
            // Utente loggato
            if (authSection) authSection.style.display = 'none';
            if (userSection) {
                userSection.style.display = 'flex';
                const userEmail = userSection.querySelector('.user-email');
                if (userEmail) userEmail.textContent = this.user.email || 'Utente';
            }
        } else {
            // Utente non loggato
            if (authSection) authSection.style.display = 'flex';
            if (userSection) userSection.style.display = 'none';
        }
    }

    async showLoginModal() {
        console.log('🔐 Mostro modal login');
        const modal = document.getElementById('login-modal');
        if (!modal) {
            console.error('❌ Modal login non trovato');
            this.showSimpleLogin();
            return;
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
            
            // Setup form
            const form = document.getElementById('login-form');
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            
            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const email = emailInput?.value.trim();
                    const password = passwordInput?.value;
                    
                    if (!email || !password) {
                        showNotification('Compila tutti i campi', 'error');
                        return;
                    }
                    
                    await this.signIn(email, password);
                };
            }
        }, 10);
    }

    async showSignupModal() {
        console.log('📝 Mostro modal registrazione');
        const modal = document.getElementById('signup-modal');
        if (!modal) {
            console.error('❌ Modal signup non trovato');
            this.showSimpleSignup();
            return;
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
            
            // Setup form
            const form = document.getElementById('signup-form');
            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    
                    const name = document.getElementById('signup-name')?.value.trim();
                    const surname = document.getElementById('signup-surname')?.value.trim();
                    const email = document.getElementById('signup-email')?.value.trim();
                    const password = document.getElementById('signup-password')?.value;
                    const confirm = document.getElementById('signup-confirm')?.value;
                    
                    if (!name || !surname || !email || !password || !confirm) {
                        showNotification('Compila tutti i campi', 'error');
                        return;
                    }
                    
                    if (password !== confirm) {
                        showNotification('Le password non corrispondono!', 'error');
                        return;
                    }
                    
                    if (password.length < 6) {
                        showNotification('La password deve essere di almeno 6 caratteri', 'error');
                        return;
                    }
                    
                    const userData = {
                        nome: name,
                        cognome: surname
                    };
                    
                    await this.signUp(email, password, userData);
                };
            }
        }, 10);
    }

    showSimpleLogin() {
        const email = prompt('Inserisci email:');
        const password = prompt('Inserisci password:');
        
        if (email && password) {
            this.signIn(email, password);
        }
    }

    setupLoginModalListeners() {
        const modal = document.getElementById('login-modal');
        if (!modal) return;
        
        // Bottone chiudi (X) - se non esiste, crealo nel HTML
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeLoginModal();
            });
        }
        
        // Chiudi cliccando fuori
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeLoginModal();
            }
        });
        
        // Chiudi con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeLoginModal();
            }
        });
    }

    setupSignupModalListeners() {
        const modal = document.getElementById('signup-modal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSignupModal();
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSignupModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeSignupModal();
            }
        });
    }

    showSimpleSignup() {
        const email = prompt('Inserisci email:');
        const password = prompt('Inserisci password:');
        const confirm = prompt('Conferma password:');
        
        if (email && password && confirm) {
            if (password !== confirm) {
                alert('Le password non corrispondono!');
                return;
            }
            
            const name = prompt('Nome:') || '';
            const surname = prompt('Cognome:') || '';
            
            this.signUp(email, password, { nome: name, cognome: surname });
        }
    }

    closeLoginModal() {
        console.log('🔒 Chiudo modal login');
        const modal = document.getElementById('login-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetLoginForm();
        }, 300);
    }

    resetLoginForm() {
        const form = document.getElementById('login-form');
        if (form) {
            form.reset();
        }
    }

    closeSignupModal() {
        console.log('📝 Chiudo modal registrazione');
        const modal = document.getElementById('signup-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetSignupForm();
        }, 300);
    }

    resetSignupForm() {
        const form = document.getElementById('signup-form');
        if (form) {
            form.reset();
        }
    }

    async signUp(email, password, userData) {
        try {
            console.log('📝 Registrazione:', email);
            
            const { data, error } = await supabaseClient.signUp(email, password, userData);
            
            if (error) {
                console.error('❌ Errore registrazione:', error);
                
                if (error.message.includes('already registered')) {
                    showNotification('Email già registrata! Prova ad accedere.', 'error');
                    this.closeSignupModal();
                    setTimeout(() => this.showLoginModal(), 300);
                } else {
                    showNotification('Errore registrazione: ' + error.message, 'error');
                }
                
                throw error;
            }
            
            showNotification('Registrazione completata! Controlla la tua email.', 'success');
            this.closeSignupModal();
            
            // Auto-login se emailConfirm è false
            if (data?.user) {
                setTimeout(() => {
                    this.signIn(email, password);
                }, 1000);
            }
            
            return data;
            
        } catch (error) {
            console.error('Exception registrazione:', error);
            throw error;
        }
    }

    async signIn(email, password) {
        try {
            console.log('🔐 Login:', email);
            
            const { data, error } = await supabaseClient.signIn(email, password);
            
            if (error) {
                console.error('❌ Errore login:', error);
                
                if (error.message.includes('Invalid login credentials')) {
                    showNotification('Email o password errati', 'error');
                } else if (error.message.includes('Email not confirmed')) {
                    showNotification('Email non confermata. Controlla la tua casella email.', 'warning');
                } else {
                    showNotification('Errore login: ' + error.message, 'error');
                }
                
                throw error;
            }
            
            console.log('✅ Login success:', data?.user?.email);
            this.closeLoginModal();
            return data;
            
        } catch (error) {
            console.error('Exception login:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            console.log('🚪 Logout...');
            
            const { error } = await supabaseClient.signOut();
            
            if (error) {
                console.error('❌ Errore logout:', error);
                showNotification('Errore durante il logout', 'error');
                throw error;
            }
            
            this.user = null;
            this.updateUI();
            
            showNotification('Logout effettuato', 'info');
            console.log('✅ Logout success');
            
        } catch (error) {
            console.error('Exception logout:', error);
            throw error;
        }
    }

    async updateProfile(updates) {
        if (!this.user) {
            showNotification('Devi essere loggato per aggiornare il profilo', 'error');
            return;
        }
        
        try {
            const { error } = await supabaseClient.updateProfile(this.user.id, updates);
            
            if (error) throw error;
            
            showNotification('Profilo aggiornato!', 'success');
            
        } catch (error) {
            showNotification('Errore aggiornamento profilo: ' + error.message, 'error');
        }
    }

    isLoggedIn() {
        return !!this.user;
    }

    getCurrentUser() {
        return this.user;
    }

    // Metodo per test
    test() {
        console.log('🧪 Test AuthManager...');
        console.log('User:', this.user);
        console.log('isLoggedIn:', this.isLoggedIn());
        console.log('signOut is function:', typeof this.signOut === 'function');
        console.log('showLoginModal is function:', typeof this.showLoginModal === 'function');
        return true;
    }
}

// Debug export
console.log('✅ AuthManager esportato correttamente:', typeof AuthManager);