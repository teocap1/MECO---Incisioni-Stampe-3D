import { supabaseClient } from '../services/supabase-service.js';
import { showNotification } from '../utils/helpers.js';

export class CheckoutManager {
    constructor(app) {
        console.log('💳 CheckoutManager inizializzato');
        this.app = app;
    }

    openCheckout() {
        console.log('💳 Apri checkout');
        
        if (!this.app.auth.isLoggedIn()) {
            showNotification('Devi essere loggato per procedere al checkout', 'error');
            this.app.auth.showLoginModal();
            return;
        }
        
        const modal = document.getElementById('checkout-modal');
        if (!modal) {
            console.error('❌ Modal checkout non trovato');
            return;
        }
        
        this.renderCheckoutForm();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    renderCheckoutForm() {
        const content = document.getElementById('checkout-content');
        if (!content) return;
        
        const subtotal = this.app.cart.getSubtotal();
        const shipping = 5.90;
        const total = subtotal + shipping;
        
        content.innerHTML = `
            <div style="max-width: 500px; margin: 0 auto;">
                <h3 style="margin-bottom: 25px; color: var(--accent-color);">
                    <i class="fas fa-shipping-fast"></i> Dati di spedizione
                </h3>
                
                <form id="checkout-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                Nome *
                            </label>
                            <input type="text" id="checkout-name" required
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                        border: 1px solid var(--glass-border); border-radius: 10px; 
                                        color: var(--text-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                Cognome *
                            </label>
                            <input type="text" id="checkout-surname" required
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                        border: 1px solid var(--glass-border); border-radius: 10px; 
                                        color: var(--text-color);">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                            Email *
                        </label>
                        <input type="email" id="checkout-email" required
                            style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                    border: 1px solid var(--glass-border); border-radius: 10px; 
                                    color: var(--text-color);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                            Indirizzo *
                        </label>
                        <input type="text" id="checkout-address" required
                            style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                    border: 1px solid var(--glass-border); border-radius: 10px; 
                                    color: var(--text-color);">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                CAP *
                            </label>
                            <input type="text" id="checkout-cap" required
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                        border: 1px solid var(--glass-border); border-radius: 10px; 
                                        color: var(--text-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                Città *
                            </label>
                            <input type="text" id="checkout-city" required
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                        border: 1px solid var(--glass-border); border-radius: 10px; 
                                        color: var(--text-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                Provincia *
                            </label>
                            <input type="text" id="checkout-province" required maxlength="2"
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                        border: 1px solid var(--glass-border); border-radius: 10px; 
                                        color: var(--text-color);">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                            Telefono *
                        </label>
                        <input type="tel" id="checkout-phone" required
                            style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); 
                                    border: 1px solid var(--glass-border); border-radius: 10px; 
                                    color: var(--text-color);">
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <h4 style="margin-bottom: 15px; color: var(--text-color);">Riepilogo ordine</h4>
                        
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
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <button type="button" onclick="window.app.ui.closeCheckoutModal()" 
                                class="glass-btn" style="background: rgba(255, 71, 87, 0.1); 
                                border-color: #ff4757; color: #ff4757;">
                            <span>Annulla</span>
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <button type="submit" class="glass-btn" style="background: var(--accent-gradient);">
                            <span>Completa ordine</span>
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 193, 7, 0.1); 
                                border-radius: 10px; border-left: 4px solid #FFC107;">
                        <p style="color: var(--text-secondary); font-size: 13px; margin: 0;">
                            <i class="fas fa-info-circle" style="color: #FFC107; margin-right: 8px;"></i>
                            Al completamento, riceverai una email di conferma con i dettagli del pagamento.
                        </p>
                    </div>
                </form>
            </div>
        `;
        
        // Popola i campi con i dati dell'utente se disponibili
        if (this.app.auth.user) {
            const emailInput = document.getElementById('checkout-email');
            if (emailInput) emailInput.value = this.app.auth.user.email || '';
        }
        
        // Setup form submission
        const form = document.getElementById('checkout-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                await this.processOrder();
            };
        }
    }

    async processOrder() {
        try {
            const orderData = {
                name: document.getElementById('checkout-name')?.value.trim(),
                surname: document.getElementById('checkout-surname')?.value.trim(),
                email: document.getElementById('checkout-email')?.value.trim(),
                address: document.getElementById('checkout-address')?.value.trim(),
                cap: document.getElementById('checkout-cap')?.value.trim(),
                city: document.getElementById('checkout-city')?.value.trim(),
                province: document.getElementById('checkout-province')?.value.trim(),
                phone: document.getElementById('checkout-phone')?.value.trim(),
                items: this.app.cart.items,
                subtotal: this.app.cart.getSubtotal(),
                shipping: 5.90,
                total: this.app.cart.getSubtotal() + 5.90,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            
            // Validazione
            if (!this.validateOrderData(orderData)) {
                showNotification('Compila tutti i campi obbligatori', 'error');
                return;
            }
            
            showNotification('Sto elaborando il tuo ordine...', 'info');
            
            // Salva ordine in supabaseClient
            const { data: order, error } = await supabaseClient
                .from('orders')
                .insert([{
                    user_id: this.app.auth.user.id,
                    ...orderData
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            // Svuota carrello
            this.app.cart.clear();
            await this.app.cart.syncCartToServer();
            
            // Mostra conferma
            this.showOrderConfirmation(order.id);
            
        } catch (error) {
            console.error('❌ Errore processamento ordine:', error);
            showNotification('Errore durante il processamento dell\'ordine', 'error');
        }
    }

    validateOrderData(data) {
        return data.name && data.surname && data.email && data.address && 
               data.cap && data.city && data.province && data.phone;
    }

    showOrderConfirmation(orderId) {
        const modal = document.getElementById('checkout-modal');
        if (!modal) return;
        
        const content = document.getElementById('checkout-content');
        content.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="width: 80px; height: 80px; background: var(--accent-gradient); 
                            border-radius: 50%; display: flex; align-items: center; 
                            justify-content: center; margin: 0 auto 25px;">
                    <i class="fas fa-check" style="font-size: 36px; color: white;"></i>
                </div>
                
                <h3 style="margin-bottom: 15px; color: var(--accent-color);">Ordine Confermato!</h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">
                    Grazie per il tuo ordine! Codice ordine:
                </p>
                <div style="background: rgba(0, 198, 255, 0.1); padding: 10px 20px; 
                            border-radius: 10px; display: inline-block; margin-bottom: 20px;">
                    <code style="color: var(--accent-color); font-weight: bold; font-size: 18px;">
                        MECO-${orderId.slice(0, 8).toUpperCase()}
                    </code>
                </div>
                
                <p style="color: var(--text-secondary); margin-bottom: 25px;">
                    Riceverai una email di conferma con tutti i dettagli.<br>
                    Il nostro team ti contatterà al più presto per definire le personalizzazioni.
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto;">
                    <button onclick="window.app.ui.closeCheckoutModal()" 
                            class="glass-btn" style="width: 100%;">
                        <span>Torna allo shopping</span>
                        <i class="fas fa-store"></i>
                    </button>
                    
                    <a href="#" onclick="window.print()" 
                       style="display: flex; align-items: center; justify-content: center; 
                              gap: 10px; color: var(--accent-color); text-decoration: none;">
                        <i class="fas fa-print"></i>
                        Stampa conferma ordine
                    </a>
                </div>
            </div>
        `;
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

console.log('✅ CheckoutManager esportato correttamente:', typeof CheckoutManager);