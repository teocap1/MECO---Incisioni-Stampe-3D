export class ModalManager {
    constructor(app) {
        this.app = app;
        this.currentProduct = null;
        this.currentTotal = 0;
    }

    openProductModal(productId) {
        console.log('=== DEBUG openProductModal ===');
        console.log('Product ID:', productId);
        
        try {
            const product = this.app.products.getProductById(productId);
            
            if (!product) {
                console.error('Prodotto non trovato con ID:', productId);
                alert('Prodotto non trovato!');
                return;
            }
            
            console.log('Dati prodotto:', {
                name: product.name,
                hasGallery: !!product.gallery,
                galleryLength: product.gallery ? product.gallery.length : 0,
                hasCustomizations: !!product.customizations,
                customizationsKeys: product.customizations ? Object.keys(product.customizations) : []
            });
            
            this.currentProduct = product;
            this.currentTotal = product.basePrice;

            const modalContent = `
                <div style="max-width: 600px; margin: 0 auto;">
                    <div id="main-image-container" style="margin-bottom: 20px; position: relative;">
                        <img id="main-product-image" src="${product.image}" alt="${product.name}" 
                            style="width: 100%; height: 400px; object-fit: cover; border-radius: 15px; cursor: pointer;
                                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                        <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0, 0, 0, 0.7); 
                                    color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px;
                                    backdrop-filter: blur(5px); display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-search-plus"></i> Clicca l'immagine per zoom
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <h4 style="margin-bottom: 10px; color: var(--text-color); font-size: 16px;">
                            <i class="fas fa-images" style="margin-right: 8px;"></i>
                            Immagini prodotto
                        </h4>
                        <div id="gallery-thumbs" style="display: flex; gap: 10px; overflow-x: auto; padding: 10px 0;">
                            ${this.app.products.getGalleryHTML(product.gallery || [product.image], product)}
                        </div>
                    </div>
                    
                    <h2 style="margin-bottom: 10px; color: var(--accent-color);">
                        ${product.name}
                    </h2>
                    
                    <div style="margin-bottom: 20px;">
                        <span class="product-category" style="display: inline-block; padding: 5px 12px; 
                            background: rgba(0, 198, 255, 0.1); color: var(--accent-color); 
                            border-radius: 20px; font-size: 12px;">
                            ${(() => {
                                const labels = {
                                    'bambini': 'Bambini',
                                    'arredamento': 'Arredamento',
                                    'decorazioni': 'Decorazioni',
                                    'pasqua': 'Pasqua',
                                    'gadget': 'Gadget',
                                    'giochi': 'Giochi'
                                };
                                return labels[product.category] || product.category;
                            })()}
                        </span>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <h3 style="margin-bottom: 15px; color: var(--text-color);">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>Descrizione
                        </h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">
                            ${product.descrizioneApprofondita}
                        </p>
                    </div>
                    
                    ${(product.customizations && Object.keys(product.customizations).length > 0) ? `
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                        <h3 style="margin-bottom: 15px; color: var(--text-color);">
                            <i class="fas fa-sliders-h" style="margin-right: 8px;"></i>Personalizzazioni
                        </h3>
                        <div id="customizations-container">
                            ${this.app.products.getCustomizationsHTML(product.customizations)}
                        </div>
                    </div>
                    ` : '<div style="margin-bottom: 25px; color: var(--text-secondary); font-style: italic;">Nessuna personalizzazione disponibile per questo prodotto.</div>'}
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                        ${product.promotion && product.promotion.active && this.app.promotions.isPromotionValid(product.promotion) ? `
                        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="color: var(--text-color); font-size: 16px;">
                                    <i class="fas fa-tag" style="margin-right: 8px;"></i>Prezzo originale
                                </span>
                                <span style="color: var(--text-secondary); text-decoration: line-through; font-size: 18px;">
                                    €${product.basePrice.toFixed(2)}
                                </span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="color: var(--text-color); font-size: 16px;">
                                    <i class="fas fa-percentage" style="margin-right: 8px;"></i>Sconto applicato
                                </span>
                                <span style="color: #ff4757; font-size: 18px; font-weight: 600;">
                                    ${product.promotion.discount}% OFF
                                </span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-color); font-size: 18px; font-weight: 500;">
                                    <i class="fas fa-bolt" style="margin-right: 8px;"></i>Prezzo promozionale
                                </span>
                                <span style="color: #ff4757; font-size: 24px; font-weight: 700;">
                                    €${this.app.products.getDiscountedPrice(product).toFixed(2)}
                                </span>
                            </div>
                        </div>
                        ` : `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <span style="color: var(--text-color); font-size: 18px;">
                                <i class="fas fa-tag" style="margin-right: 8px;"></i>Prezzo base
                            </span>
                            <span style="color: var(--accent-color); font-size: 24px; font-weight: 700;">
                                €${product.basePrice.toFixed(2)}
                            </span>
                        </div>
                        `}
                        
                        ${product.customizations ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                                    padding-top: 20px; border-top: 1px solid var(--glass-border);">
                            <span style="font-size: 20px; color: var(--text-color); font-weight: 600;">
                                <i class="fas fa-calculator" style="margin-right: 8px;"></i>Totale
                            </span>
                            <span id="modal-total-price" style="font-size: 32px; font-weight: bold; color: var(--accent-color);">
                                €${this.app.products.getDiscountedPrice(product).toFixed(2)}
                            </span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 25px;">
                        <button class="glass-btn contact-modal-btn" style="width: 100%;">
                            <span>Contattaci su WhastApp</span>
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                    
                    <div style="margin-top: 25px; padding: 15px; background: rgba(0, 198, 255, 0.05); 
                                border-radius: 10px; border-left: 4px solid var(--accent-color);">
                        <p style="color: var(--text-secondary); font-size: 14px; margin: 0;">
                            <i class="fas fa-info-circle" style="margin-right: 8px; color: var(--accent-color);"></i>
                            Per ordinare o richiedere informazioni, contattaci via email o telefono.
                        </p>
                    </div>
                </div>
            `;

            document.getElementById('modal-content').innerHTML = modalContent;
            const modal = document.getElementById('product-modal');
            
            console.log('Modal prima di mostrarlo:', {
                display: modal.style.display,
                classList: modal.classList.toString(),
                exists: !!modal
            });
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
                console.log('Modal dopo show:', {
                    display: modal.style.display,
                    classList: modal.classList.toString()
                });
            }, 10);
            
            setTimeout(() => this.setupCustomizationOptions(), 100);
            this.checkModalRendering();
        
        } catch (error) {
            console.error('Errore in openProductModal:', error);
            alert('Errore nell\'apertura del prodotto: ' + error.message);
        }
    }

    checkModalRendering() {
        setTimeout(() => {
            const modal = document.getElementById('product-modal');
            const content = document.getElementById('modal-content');
            
            console.log('Check rendering modal:', {
                modalVisible: window.getComputedStyle(modal).display,
                modalOpacity: window.getComputedStyle(modal).opacity,
                contentExists: !!content,
                contentHTML: content ? content.innerHTML.length : 0,
                scrollDisabled: document.body.style.overflow === 'hidden'
            });
            
            const mainImg = document.getElementById('main-product-image');
            if (mainImg) {
                console.log('Main image loaded:', mainImg.complete);
                mainImg.onerror = () => console.error('Image failed to load');
            }
        }, 200);
    }

    closeModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('active');
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('modal-content').innerHTML = '';
                
                this.currentProduct = null;
                this.currentTotal = 0;
                
                document.body.style.overflow = '';
            }, 300);
        }
    }

    setupCustomizationOptions() {
        const modalContent = document.getElementById('modal-content');
        if (!modalContent) return;
        
        modalContent.addEventListener('click', (e) => {
            const optionBtn = e.target.closest('[data-customization]');
            const galleryThumb = e.target.closest('.gallery-thumb');
            const mainImage = e.target.closest('#main-product-image');
            
            if (optionBtn) {
                e.preventDefault();
                
                const groupKey = optionBtn.dataset.customization;
                
                const allOptionsInGroup = modalContent.querySelectorAll(`[data-customization="${groupKey}"]`);
                allOptionsInGroup.forEach(btn => {
                    btn.classList.remove('selected');
                    btn.style.background = 'rgba(255,255,255,0.05)';
                    btn.style.borderColor = 'var(--glass-border)';
                    btn.style.color = 'var(--text-secondary)';
                });
                
                optionBtn.classList.add('selected');
                optionBtn.style.background = 'var(--accent-color)';
                optionBtn.style.borderColor = 'var(--accent-color)';
                optionBtn.style.color = 'white';
                
                this.updateTotalPrice();
            }
            
            if (galleryThumb) {
                e.preventDefault();
                const imageUrl = galleryThumb.dataset.image;
                
                const mainImg = document.getElementById('main-product-image');
                if (mainImg) {
                    mainImg.src = imageUrl;
                }
                
                const allThumbs = modalContent.querySelectorAll('.gallery-thumb');
                allThumbs.forEach(thumb => {
                    thumb.style.borderColor = 'transparent';
                    thumb.classList.remove('active');
                });
                
                galleryThumb.style.borderColor = 'var(--accent-color)';
                galleryThumb.classList.add('active');
            }
            
            if (mainImage) {
                this.toggleImageZoom(mainImage.src);
            }
        });
        
        modalContent.addEventListener('input', (e) => {
            if (e.target.id && e.target.id.startsWith('custom-text-')) {
                this.updateTotalPrice();
            }
        });
        
        const contactBtn = modalContent.querySelector('.glass-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
                setTimeout(() => this.app.navigation.switchSection('contatti'), 300);
            });
        }
    }

    updateTotalPrice() {
        if (!this.currentProduct) return;
        
        const basePrice = this.app.products.getDiscountedPrice(this.currentProduct);
        
        let total = basePrice;
        
        const selectedOptions = document.querySelectorAll('.customization-option.selected');
        selectedOptions.forEach(option => {
            const price = parseFloat(option.dataset.price) || 0;
            total += price;
        });
        
        this.currentTotal = total;
        
        const totalElement = document.getElementById('modal-total-price');
        if (totalElement) {
            totalElement.textContent = `€${total.toFixed(2)}`;
        }
    }

    toggleImageZoom(imageUrl) {
        let zoomModal = document.getElementById('image-zoom-modal');
        
        if (zoomModal) {
            zoomModal.remove();
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';

            zoomModal = document.createElement('div');
            zoomModal.id = 'image-zoom-modal';
            zoomModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.98);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            zoomModal.innerHTML = `
                <div style="position: relative;">
                    <button onclick="document.getElementById('image-zoom-modal').remove(); document.body.style.overflow = ''"
                            style="position: fixed; top: 20px; right: 20px; 
                                background: #ff4757; border: none;
                                width: 50px; height: 50px; border-radius: 50%;
                                color: white; font-size: 24px; cursor: pointer;
                                z-index: 10000;">
                        ✕
                    </button>
                    <img src="${imageUrl}" alt="Zoom" 
                        style="max-width: 90vw; max-height: 90vh; border-radius: 10px;">
                </div>
            `;
            
            document.body.appendChild(zoomModal);
            
            setTimeout(() => {
                zoomModal.style.opacity = '1';
            }, 10);
            
            zoomModal.addEventListener('click', (e) => {
                if (e.target === zoomModal || e.target.closest('#zoom-close-btn')) {
                    zoomModal.style.opacity = '0';
                    setTimeout(() => {
                        zoomModal.remove();
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
            
            const closeOnEsc = (e) => {
                if (e.key === 'Escape') {
                    zoomModal.style.opacity = '0';
                    setTimeout(() => {
                        zoomModal.remove();
                        document.body.style.overflow = '';
                        document.removeEventListener('keydown', closeOnEsc);
                    }, 300);
                }
            };
            document.addEventListener('keydown', closeOnEsc);
            
            zoomModal.addEventListener('wheel', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
    }

    shareOnWhatsApp() {
        if (!this.currentProduct) return;
        
        let message = `Ciao MECO! Sono interessato al prodotto:\n`;
        message += `📦 *${this.currentProduct.name}*\n`;
        message += `💰 Prezzo base: €${this.currentProduct.basePrice.toFixed(2)}\n`;
        
        const selectedOptions = document.querySelectorAll('.customization-option.selected');
        if (selectedOptions.length > 0) {
            message += `\n🎨 Personalizzazioni scelte:\n`;
            selectedOptions.forEach(option => {
                const price = parseFloat(option.dataset.price) || 0;
                message += `• ${option.textContent.trim()}\n`;
            });
        }
        
        const textInputs = document.querySelectorAll('input[id^="custom-text-"]');
        textInputs.forEach(input => {
            if (input.value.trim()) {
                message += `• ${input.placeholder || 'Testo personalizzato'}: ${input.value}\n`;
            }
        });
        
        if (this.currentTotal > this.currentProduct.basePrice) {
            message += `\n💵 Totale: €${this.currentTotal.toFixed(2)}`;
        }
        
        message += `\n\nVorrei maggiori informazioni su questo prodotto!`;
        
        const encodedMessage = encodeURIComponent(message);
        
        const phoneNumber = '3806458336';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    shareProduct(product) {
        const hasPromo = product.promotion && 
                        product.promotion.active && 
                        this.app.promotions.isPromotionValid(product.promotion);
        const finalPrice = this.app.products.getDiscountedPrice(product);
        
        let message = `Guarda questo prodotto di MECO - Incisioni e Stampe 3D:\n`;
        message += `🌟 *${product.name}*\n`;
        message += `${product.description}\n`;
        
        if (hasPromo) {
            message += `💰 *PREZZO PROMOZIONALE*: €${finalPrice.toFixed(2)} (invece di €${product.basePrice.toFixed(2)})\n`;
            message += `🎁 *SCONTO*: ${product.promotion.discount}% OFF\n`;
        } else {
            message += `💰 Prezzo: €${product.basePrice.toFixed(2)}\n`;
        }
        
        message += `🔗 Vedi sul sito: ${window.location.href.split('#')[0]}#product-${product.id}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }

    openProductModalById(productId) {
        console.log('openProductModalById chiamato con ID:', productId);
        this.openProductModal(productId);
    }
}