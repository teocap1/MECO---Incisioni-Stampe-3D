export class PromotionsManager {
    constructor(app) {
        this.app = app;
        this.promoCountdownIntervals = new Map();
        this.countdownInterval = null;
        this.promotionCheckInterval = null;
    }

    isPromotionValid(promotion) {
        if (!promotion) return false;
        
        if (promotion.schedule) {
            try {
                const now = new Date();
                const startDate = new Date(promotion.schedule.startDate);
                const endDate = new Date(promotion.schedule.endDate);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return false;
                }
                
                return (now >= startDate) && (now <= endDate);
                
            } catch (error) {
                console.error('Errore nel controllo promozione:', error);
                return false;
            }
        }
        
        return promotion.active === true;
    }

    isPromotionScheduled(promotion) {
        if (!promotion || !promotion.schedule) {
            return false;
        }
        
        const now = new Date();
        
        try {
            const startDate = new Date(promotion.schedule.startDate);
            const endDate = new Date(promotion.schedule.endDate);
            
            const isActive = (now >= startDate) && (now <= endDate);
            
            return isActive;
            
        } catch (error) {
            console.error('Errore nel controllo:', error);
            return false;
        }
    }

    getActivePromotions() {
        const allProducts = this.app.products.getAllProducts();
        const promotionsMap = new Map();
        
        console.log('🔍 Ricerca promozioni attive...');
        
        allProducts.forEach(product => {
            if (product.promotion && 
                product.promotion.active && 
                this.isPromotionValid(product.promotion)) {
                
                const promoKey = product.promotion.promoId || 
                                product.promotion.label?.replace(/\s+/g, '_').toLowerCase() || 
                                'generic_promo';
                
                console.log(`✓ ${product.name}: ${promoKey} (${product.promotion.discount}%)`);
                
                if (!promotionsMap.has(promoKey)) {
                    promotionsMap.set(promoKey, {
                        id: promoKey,
                        label: product.promotion.label || 'Offerta Speciale',
                        endDate: product.promotion.schedule ? 
                                new Date(product.promotion.schedule.endDate) : 
                                new Date('2025-12-31T23:59:59'),
                        discount: product.promotion.discount || 10,
                        products: []
                    });
                }
                
                promotionsMap.get(promoKey).products.push(product.name);
            }
        });
        
        const result = Array.from(promotionsMap.values());
        console.log(`Trovate ${result.length} promozioni attive`);
        return result;
    }

    updatePromotionsStatus() {
        console.log('⏰ Aggiornamento stato promozioni...');
        
        const allProducts = this.app.products.getAllProducts();
        const now = new Date();
        let changed = false;
        
        allProducts.forEach(product => {
            if (product.promotion && product.promotion.schedule) {
                try {
                    const startDate = new Date(product.promotion.schedule.startDate);
                    const endDate = new Date(product.promotion.schedule.endDate);
                    
                    const shouldBeActive = (now >= startDate) && (now <= endDate);
                    
                    if (product.promotion.active !== shouldBeActive) {
                        product.promotion.active = shouldBeActive;
                        changed = true;
                        
                        console.log(`🔄 ${product.name}: ${shouldBeActive ? 'ATTIVATA' : 'DISATTIVATA'}`);
                        
                        if (!shouldBeActive && product.promotion.promoId) {
                            this.stopPromoCountdown(product.promotion.promoId);
                        }
                    }
                    
                } catch (error) {
                    console.error(`Errore in ${product.name}:`, error);
                }
            }
        });
        
        if (changed) {
            console.log('✅ Stati promozioni aggiornati');
            this.updatePromoBanners();
            this.app.products.filterProducts();
        }
        
        return changed;
    }

    startPromotions() {
        console.log('🎯 Avvio sistema promozioni');
        
        this.updatePromotionsStatus();
        
        this.promotionCheckInterval = setInterval(() => {
            console.log('⏱️ Controllo periodico promozioni...');
            this.updatePromotionsStatus();
        }, 30000);
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.countdownInterval = setInterval(() => {
            this.updatePromoCountdown();
        }, 1000);
    }

    updatePromoCountdown() {
        // I countdown sono gestiti individualmente
    }

    startPromoCountdown(promoId, endDate) {
        console.log(`⏱️ Avvio countdown per ${promoId}`);
        
        const updateCountdown = () => {
            const now = new Date();
            const timeLeft = endDate - now;
            
            if (timeLeft <= 0) {
                console.log(`⏰ Countdown scaduto per ${promoId}`);
                if (this.promoCountdownIntervals.has(promoId)) {
                    clearInterval(this.promoCountdownIntervals.get(promoId));
                    this.promoCountdownIntervals.delete(promoId);
                }
                this.removePromoBanner(promoId);
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const banner = document.querySelector(`[data-promo-id="${promoId}"]`);
            if (banner) {
                const daysEl = banner.querySelector('[data-type="days"]');
                const hoursEl = banner.querySelector('[data-type="hours"]');
                const minutesEl = banner.querySelector('[data-type="minutes"]');
                const secondsEl = banner.querySelector('[data-type="seconds"]');
                
                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            }
        };
        
        updateCountdown();
        
        const intervalId = setInterval(updateCountdown, 1000);
        
        if (!this.promoCountdownIntervals) {
            this.promoCountdownIntervals = new Map();
        }
        this.promoCountdownIntervals.set(promoId, intervalId);
    }

    updatePromoBanners() {
        console.log('🎪 Aggiornamento banner promozionali...');
        
        const container = document.getElementById('promo-banners-container');
        const template = document.getElementById('promo-banner-template');
        
        if (!container) {
            console.error('❌ Container banner non trovato!');
            return;
        }
        
        if (!template) {
            console.error('❌ Template banner non trovato!');
            return;
        }
        
        const activePromotions = this.getActivePromotions();
        
        console.log('Promozioni attive trovate:', activePromotions.length);
        
        if (activePromotions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nessuna offerta attiva al momento</p>';
            console.log('Nessuna promozione attiva per mostrare banner');
            return;
        }
        
        container.innerHTML = '';
        
        activePromotions.forEach(promo => {
            console.log('Creando banner per:', promo.label);
            
            const banner = template.content.cloneNode(true);
            const bannerElement = banner.querySelector('.promo-banner');
            
            bannerElement.setAttribute('data-promo-id', promo.id);
            
            bannerElement.querySelector('.promo-label').textContent = promo.label;
            bannerElement.querySelector('.promo-title').textContent = 
                `Sconto del ${promo.discount}%!`;
            bannerElement.querySelector('.promo-description').textContent = 
                `Su ${promo.products.length} prodotti • Valido fino al ${promo.endDate.toLocaleDateString('it-IT')}`;
            
            const promoBtn = bannerElement.querySelector('.promo-btn');
            promoBtn.onclick = (e) => {
                e.preventDefault();
                this.app.navigation.switchSection('catalogo');
            };
            
            const closeBtn = bannerElement.querySelector('.promo-close');
            closeBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hidePromoBanner(promo.id);
            };
            
            container.appendChild(banner);
            
            this.startPromoCountdown(promo.id, promo.endDate);
            
            console.log(`✅ Banner creato per: ${promo.label}`);
        });
        
        console.log(`Creati ${activePromotions.length} banner promozionali`);
    }

    hidePromoBanner(promoId) {
        const banner = document.querySelector(`[data-promo-id="${promoId}"]`);
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                banner.style.display = 'none';
                
                const closedBanners = JSON.parse(localStorage.getItem('meco_closed_banners') || '[]');
                if (!closedBanners.includes(promoId)) {
                    closedBanners.push(promoId);
                    localStorage.setItem('meco_closed_banners', JSON.stringify(closedBanners));
                }
                
                this.stopPromoCountdown(promoId);
                
            }, 300);
        }
    }

    removePromoBanner(promoId) {
        const banner = document.querySelector(`[data-promo-id="${promoId}"]`);
        if (banner) {
            banner.remove();
            this.stopPromoCountdown(promoId);
        }
    }

    stopPromoCountdown(promoId) {
        if (this.promoCountdownIntervals && this.promoCountdownIntervals.has(promoId)) {
            clearInterval(this.promoCountdownIntervals.get(promoId));
            this.promoCountdownIntervals.delete(promoId);
        }
    }

    isBannerClosed(promoId) {
        const closedBanners = JSON.parse(localStorage.getItem('meco_closed_banners') || '[]');
        return closedBanners.includes(promoId);
    }

    updatePromoBannerVisibility() {
        const promoBanner = document.getElementById('promo-banner');
        const reopenBtn = document.getElementById('reopen-promo-btn');
        
        if (!promoBanner) return;
        
        const hasActivePromotions = this.hasActivePromotions();
        
        if (!hasActivePromotions) {
            promoBanner.style.display = 'none';
            if (reopenBtn) {
                reopenBtn.style.display = 'none';
            }
            localStorage.removeItem('meco_promo_closed_date');
        } else {
            this.checkPromoBanner();
        }
    }

    hasActivePromotions() {
        const allProducts = this.app.products.getAllProducts();
        
        for (const product of allProducts) {
            if (product.promotion && 
                product.promotion.active && 
                this.isPromotionValid(product.promotion)) {
                console.log('Trovata promozione attiva:', product.name);
                return true;
            }
        }
        
        console.log('Nessuna promozione attiva trovata');
        return false;
    }

    checkPromoBanner() {
        const banner = document.getElementById('promo-banner');
        const reopenBtn = document.getElementById('reopen-promo-btn');
        
        if (!banner) return;
        
        const closeDate = localStorage.getItem('meco_promo_closed_date');
        
        if (closeDate) {
            const now = new Date().getTime();
            const hoursPassed = (now - parseInt(closeDate)) / (1000 * 60 * 60);
            
            if (hoursPassed >= 24) {
                localStorage.removeItem('meco_promo_closed_date');
                banner.style.display = 'block';
                if (reopenBtn) reopenBtn.style.display = 'none';
            } else {
                banner.style.display = 'none';
                this.showReopenButton();
            }
        } else {
            banner.style.display = 'block';
            if (reopenBtn) reopenBtn.style.display = 'none';
        }
    }

    showReopenButton() {
        const reopenBtn = document.getElementById('reopen-promo-btn');
        if (reopenBtn) {
            reopenBtn.style.display = 'flex';
            
            reopenBtn.addEventListener('click', () => {
                this.reopenPromoBanner();
            });
        }
    }

    reopenPromoBanner() {
        if (!this.hasActivePromotions()) {
            console.log('Non ci sono promozioni attive da mostrare');
            return;
        }
        
        const banner = document.getElementById('promo-banner');
        const reopenBtn = document.getElementById('reopen-promo-btn');
        
        if (banner) {
            localStorage.removeItem('meco_promo_closed_date');
            
            banner.style.display = 'block';
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                banner.style.transition = 'all 0.5s ease';
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            }, 10);
            
            if (reopenBtn) {
                reopenBtn.style.display = 'none';
            }
        }
    }

    updatePromoPrices() {
        const allProducts = this.app.products.getAllProducts();
        
        allProducts.forEach(product => {
            if (product.promotion && 
                product.promotion.active && 
                product.promotion.discount && 
                product.promotion.discount > 0 &&
                (!product.promotion.promoPrice || product.promotion.promoPrice === 0)) {
                
                product.promotion.promoPrice = this.app.products.getDiscountedPrice(product);
            }
        });
        
        console.log('Prezzi promozionali aggiornati automaticamente');
    }
}