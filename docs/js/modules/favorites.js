import { Storage, STORAGE_KEYS } from '../utils/storage.js';
import { getCategoryLabel } from '../utils/helpers.js';

export class FavoritesManager {
    constructor(app) {
        this.app = app;
        this.favorites = Storage.get(STORAGE_KEYS.FAVORITES, []);
    }

    toggleFavorite(productId, event) {
        if (event) event.stopPropagation();
        
        const index = this.favorites.indexOf(productId);
        
        if (index === -1) {
            this.favorites.push(productId);
            if (event) {
                const btn = event.target.closest('.favorite-btn');
                if (btn) btn.classList.add('active');
            }
        } else {
            this.favorites.splice(index, 1);
            if (event) {
                const btn = event.target.closest('.favorite-btn');
                if (btn) btn.classList.remove('active');
            }
        }
        
        Storage.set(STORAGE_KEYS.FAVORITES, this.favorites);
        this.updateFavoritesCount();
        
        if (document.getElementById('favorites')) {
            this.displayFavorites();
        }
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    getFavoritesCount() {
        return this.favorites.length;
    }

    updateFavoritesCount() {
        const count = this.favorites.length;
        const counter = document.querySelector('.favorites-count');
        if (counter) {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    getFavoriteProducts() {
        const allProducts = this.app.products.getAllProducts();
        return allProducts.filter(product => this.favorites.includes(product.id));
    }

    displayFavorites() {
        console.log('❤️ Caricamento preferiti...');
        
        const container = document.getElementById('favorites-container');
        const emptyMsg = document.getElementById('favorites-empty');
        const countText = document.getElementById('favorites-count-text');
        
        if (!container) {
            console.error('❌ Container preferiti non trovato!');
            return;
        }
        
        const favoriteProducts = this.getFavoriteProducts();
        console.log('Prodotti preferiti trovati:', favoriteProducts.length);
        
        if (countText) {
            const count = favoriteProducts.length;
            countText.textContent = `Hai ${count} prodotto${count !== 1 ? 'i' : ''} nei preferiti`;
        }
        
        if (favoriteProducts.length === 0) {
            container.innerHTML = '';
            if (emptyMsg) {
                emptyMsg.style.display = 'block';
                console.log('Mostro messaggio "nessun preferito"');
            }
            return;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        container.innerHTML = '';
        
        favoriteProducts.forEach(product => {
            const isFavorite = this.isFavorite(product.id);
            const hasPromo = product.promotion && 
                            product.promotion.active && 
                            this.app.promotions.isPromotionValid(product.promotion);
            const finalPrice = this.app.products.getDiscountedPrice(product);
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-product-id', product.id);
            
            card.innerHTML = `
                <div class="product-image" style="position: relative;">
                    <img src="${product.image}" alt="${product.name}" 
                        loading="lazy" 
                        style="width: 100%; height: 100%; object-fit: cover;"
                        onerror="this.src='https://via.placeholder.com/400x300/1e2a4a/00c6ff?text=Product+Image'">
                    
                    ${hasPromo ? `
                    <div class="product-promo-badge">
                        <i class="fas fa-gift"></i> 
                        ${product.promotion.label || `${product.promotion.discount}% OFF`}
                    </div>
                    ` : ''}
                    
                    <button class="favorite-btn active" 
                            data-product-id="${product.id}"
                            onclick="window.app.favorites.toggleFavorite('${product.id}', event)"
                            style="position: absolute; top: 15px; right: 15px; z-index: 10;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoryLabel(product.category)}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-price">
                        ${hasPromo ? `
                            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                <span class="original-price">€${product.basePrice.toFixed(2)}</span>
                                <span class="promo-price">€${finalPrice.toFixed(2)}</span>
                                <span style="color: #ff4757; font-size: 14px; font-weight: 600; 
                                        background: rgba(255, 71, 87, 0.1); padding: 4px 8px; 
                                        border-radius: 12px;">
                                    -${product.promotion.discount}%
                                </span>
                            </div>
                        ` : `
                            <span style="font-size: 24px; font-weight: 700; color: var(--accent-color);">
                                €${product.basePrice.toFixed(2)}
                            </span>
                        `}
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="glass-btn view-details-btn" 
                                data-product-id="${product.id}"
                                style="flex: 1;">
                            <span>Dettagli</span>
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
        
        this.attachFavoritesEventListeners();
        
        console.log('✅ Preferiti caricati e event listener attaccati');
    }

    attachFavoritesEventListeners() {
        const container = document.getElementById('favorites-container');
        if (!container) return;
        
        console.log('🔗 Attacco event listener per preferiti...');
        
        container.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product-id');
                console.log('🔍 Apertura dettagli prodotto:', productId);
                
                if (productId) {
                    this.app.modal.openProductModal(productId);
                } else {
                    console.error('❌ Product ID non trovato');
                }
            });
        });
        
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const productId = card.getAttribute('data-product-id');
                    if (productId) {
                        this.app.modal.openProductModal(productId);
                    }
                }
            });
        });
        
        console.log('✅ Event listener per preferiti attaccati');
    }
}