export class UIManager {
    constructor(app) {
        this.app = app;
    }

    setupFilters() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.app.products.filterProducts());
        }
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.app.products.filterProducts();
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Grazie per il tuo messaggio! Ti risponderemo al più presto.');
                form.reset();
                this.app.navigation.switchSection('home');
            });
        }
    }

    setupModal() {
        const modal = document.getElementById('product-modal');
        const closeBtn = modal.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.app.modal.closeModal());
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.app.modal.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.app.modal.closeModal();
            }
        });
    }

    setupRatingStars() {
        // Questa funzione è ora in ReviewsManager
    }

    // In ui.js, dentro UIManager
    closeCartModal() {
        if (this.app.cart && this.app.cart.closeCartModal) {
            this.app.cart.closeCartModal();
        }
    }

    closeCheckoutModal() {
        if (this.app.checkout && this.app.checkout.closeCheckoutModal) {
            this.app.checkout.closeCheckoutModal();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
}