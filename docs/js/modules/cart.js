import { supabaseClient, getUserCart, addToCart, clearUserCart } from '../services/supabase-service.js';
import { showNotification } from '../utils/helpers.js';

export class CartManager {
    constructor(app) {
        console.log('🛒 CartManager inizializzato');
        this.app = app;
        this.items = [];
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('meco_cart');
            if (saved) {
                this.items = JSON.parse(saved);
                console.log('📦 Carrello caricato da localStorage:', this.items.length, 'prodotti');
            }
        } catch (error) {
            console.error('Errore caricamento carrello:', error);
            this.items = [];
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('meco_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Errore salvataggio carrello:', error);
        }
    }

    addItem(productId, quantity = 1, customizations = {}) {
        console.log('➕ Aggiungo al carrello:', productId, quantity);
        
        const existingItemIndex = this.items.findIndex(item => 
            item.productId === productId && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );
        
        if (existingItemIndex !== -1) {
            // Aggiorna quantità prodotto esistente
            this.items[existingItemIndex].quantity += quantity;
        } else {
            // Aggiungi nuovo prodotto
            const product = this.app.products.getProductById(productId);
            this.items.push({
                productId,
                product: product || { name: 'Prodotto ' + productId },
                quantity,
                customizations,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveToLocalStorage();
        // Sincronizza con supabaseClient se loggato
        if (this.app.auth.isLoggedIn()) {
            this.syncCartToServer();
        }

        this.updateCartUI();
        showNotification('Prodotto aggiunto al carrello!', 'success');
        
        showNotification('Prodotto aggiunto al carrello!', 'success');
        console.log('✅ Carrello aggiornato:', this.items);
    }

    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removed = this.items.splice(index, 1);
            this.saveToLocalStorage();
            this.updateCartUI();
            console.log('🗑️ Prodotto rimosso:', removed[0].productId);
            showNotification('Prodotto rimosso dal carrello', 'info');
        }
    }

    updateQuantity(index, quantity) {
        if (index >= 0 && index < this.items.length) {
            if (quantity < 1) {
                this.removeItem(index);
                return;
            }
            
            this.items[index].quantity = quantity;
            this.saveToLocalStorage();
            this.updateCartUI();
            console.log('✏️ Quantità aggiornata:', this.items[index].productId, '→', quantity);
        }
    }

    clear() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartUI();
        console.log('🧹 Carrello svuotato');
        showNotification('Carrello svuotato', 'info');
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => {
            const product = this.app.products.getProductById(item.productId);
            if (product) {
                const price = this.app.products.getDiscountedPrice(product);
                return total + (price * item.quantity);
            }
            return total;
        }, 0);
    }

    updateCartUI() {
        console.log('🎨 Aggiorno UI carrello');
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
        
        // Aggiorna modal se aperto
        const cartModal = document.getElementById('cart-modal');
        if (cartModal && cartModal.style.display === 'flex') {
            this.renderCartModal();
        }
    }

    renderCartModal() {
        const modalContent = document.getElementById('cart-modal-content');
        if (!modalContent) return;
        
        if (this.items.length === 0) {
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: var(--text-secondary); opacity: 0.5;"></i>
                    <h3 style="margin-top: 20px; color: var(--text-secondary);">Carrello vuoto</h3>
                    <p style="color: var(--text-secondary);">Aggiungi prodotti dal catalogo!</p>
                    <button onclick="window.app.cart.closeCartModal(); window.app.navigation.switchSection('catalogo')" 
                            class="glass-btn" style="margin-top: 20px;">
                        <span>Vai al catalogo</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            return;
        }
        
        let html = `
            <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--glass-border);">
                            <th style="text-align: left; padding: 10px; font-weight: 600;">Prodotto</th>
                            <th style="text-align: center; padding: 10px; font-weight: 600;">Quantità</th>
                            <th style="text-align: right; padding: 10px; font-weight: 600;">Prezzo</th>
                            <th style="width: 40px;"></th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.items.forEach((item, index) => {
            const product = this.app.products.getProductById(item.productId) || item.product;
            const price = product ? this.app.products.getDiscountedPrice(product) : 0;
            const total = price * item.quantity;
            
            html += `
                <tr style="border-bottom: 1px solid var(--glass-border);">
                    <td style="padding: 15px 10px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <img src="${product.image || 'https://via.placeholder.com/60x60/1e2a4a/00c6ff?text=Prod'}" 
                                 alt="${product.name}" 
                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
                                ${Object.keys(item.customizations).length > 0 ? `
                                <div style="font-size: 12px; color: var(--text-secondary);">
                                    ${Object.entries(item.customizations).map(([key, value]) => 
                                        `<span style="display: inline-block; margin-right: 8px; margin-bottom: 3px; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">${key}: ${value}</span>`
                                    ).join('')}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </td>
                    <td style="text-align: center; padding: 15px 10px;">
                        <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 8px;">
                            <button onclick="window.app.cart.updateQuantity(${index}, ${item.quantity - 1})" 
                                    style="background: none; border: none; color: var(--text-color); cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;"
                                    onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
                                    onmouseout="this.style.background='none'">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                            <button onclick="window.app.cart.updateQuantity(${index}, ${item.quantity + 1})" 
                                    style="background: none; border: none; color: var(--text-color); cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;"
                                    onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
                                    onmouseout="this.style.background='none'">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td style="text-align: right; padding: 15px 10px; font-weight: 600; color: var(--accent-color);">
                        €${total.toFixed(2)}
                    </td>
                    <td style="padding: 15px 10px;">
                        <button onclick="window.app.cart.removeItem(${index})" 
                                style="background: none; border: none; color: #ff4757; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s;"
                                onmouseover="this.style.background='rgba(255,71,87,0.1)'" 
                                onmouseout="this.style.background='none'"
                                title="Rimuovi">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        const subtotal = this.getSubtotal();
        const shipping = 5.90; // Spedizione fissa per ora
        const total = subtotal + shipping;
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid var(--glass-border);">
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">Subtotale:</span>
                        <span style="font-weight: 600;">€${subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">Spedizione:</span>
                        <span style="font-weight: 600;">€${shipping.toFixed(2)}</span>
                    </div>
                    <div style="height: 1px; background: var(--glass-border); margin: 12px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 18px;">
                        <span style="font-weight: 700;">Totale:</span>
                        <span style="font-weight: 700; color: var(--accent-color);">€${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                    <button onclick="window.app.cart.clear()" 
                            class="glass-btn" 
                            style="background: rgba(255, 71, 87, 0.1); border-color: #ff4757; color: #ff4757;"
                            title="Svuota carrello">
                        <span>Svuota</span>
                        <i class="fas fa-trash"></i>
                    </button>
                    
                    <button onclick="window.app.checkout.openCheckout()" 
                            class="glass-btn" 
                            style="background: var(--accent-gradient);"
                            title="Procedi al checkout">
                        <span>Checkout</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        modalContent.innerHTML = html;
    }

    openCartModal() {
        console.log('🛒 Apro modal carrello');
        const modal = document.getElementById('cart-modal');
        if (!modal) {
            console.error('❌ Modal carrello non trovato');
            return;
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
            this.renderCartModal();
        }, 10);
    }

    setupCartModalListeners() {
        const modal = document.getElementById('cart-modal');
        if (!modal) return;
        
        // Bottone chiudi (X)
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCartModal();
            });
        }
        
        // Chiudi cliccando fuori
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCartModal();
            }
        });
        
        // Chiudi con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeCartModal();
            }
        });
        
        console.log('✅ Listener modal carrello configurati');
    }

    closeCartModal() {
        const modal = document.getElementById('cart-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Aggiungi alla classe CartManager in cart.js
    async syncCartToServer() {
        if (!this.app.auth.isLoggedIn()) {
            console.log('🔄 Utente non loggato - carrello salvato solo localmente');
            return;
        }
        
        try {
            const userId = this.app.auth.user.id;
            
            // Pulisci carrello server per questo utente
            const { error: clearError } = await this.app.supabaseClient
                .from('cart_items')
                .delete()
                .eq('user_id', userId);
            
            if (clearError) throw clearError;
            
            // Inserisci tutti gli items del carrello
            for (const item of this.items) {
                const { error: insertError } = await this.app.supabaseClient
                    .from('cart_items')
                    .insert({
                        user_id: userId,
                        product_id: item.productId,
                        quantity: item.quantity,
                        customizations: item.customizations
                    });
                
                if (insertError) throw insertError;
            }
            
            console.log('✅ Carrello sincronizzato con supabaseClient');
            
        } catch (error) {
            console.error('❌ Errore sincronizzazione carrello:', error);
        }
    }

    async loadCartFromServer() {
        if (!this.app.auth.isLoggedIn()) {
            console.log('👤 Utente non loggato - carico da localStorage');
            this.loadFromLocalStorage();
            return;
        }
        
        try {
            const userId = this.app.auth.user.id;
            
            const { data, error } = await this.app.supabaseClient
                .from('cart_items')
                .select('*')
                .eq('user_id', userId)
                .eq('active', true);
            
            if (error) throw error;
            
            // Converti dati supabaseClient in formato locale
            this.items = (data || []).map(item => ({
                productId: item.product_id,
                quantity: item.quantity,
                customizations: item.customizations || {},
                addedAt: item.added_at
            }));
            
            // Aggiorna dati prodotto per ogni item
            for (const item of this.items) {
                item.product = this.app.products.getProductById(item.productId) || 
                            { name: 'Prodotto ' + item.productId };
            }
            
            this.saveToLocalStorage();
            this.updateCartUI();
            
            console.log('✅ Carrello caricato da supabaseClient:', this.items.length, 'prodotti');
            
        } catch (error) {
            console.error('❌ Errore caricamento carrello da supabaseClient:', error);
            this.loadFromLocalStorage();
        }
    }

    // Metodo per test
    test() {
        console.log('🧪 Test CartManager...');
        console.log('Items:', this.items);
        console.log('Total items:', this.getTotalItems());
        console.log('Subtotal:', this.getSubtotal());
        console.log('openCartModal is function:', typeof this.openCartModal === 'function');
        return true;
    }
}

// Debug export
console.log('✅ CartManager esportato correttamente:', typeof CartManager);