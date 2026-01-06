// js/debug.js
export function debugModals() {
    console.log('🔍 Debug modali:');
    
    const modals = {
        'login-modal': document.getElementById('login-modal'),
        'signup-modal': document.getElementById('signup-modal'),
        'cart-modal': document.getElementById('cart-modal'),
        'product-modal': document.getElementById('product-modal')
    };
    
    Object.entries(modals).forEach(([name, modal]) => {
        if (modal) {
            console.log(`${name}:`, {
                exists: true,
                display: modal.style.display,
                classList: modal.classList.toString(),
                position: modal.getBoundingClientRect()
            });
            
            // Aggiungi listener di debug
            modal.addEventListener('click', (e) => {
                console.log(`Click su ${name}:`, e.target);
            });
        } else {
            console.log(`${name}: NON TROVATO`);
        }
    });
    
    // Controlla se il body ha overflow nascosto
    console.log('Body overflow:', document.body.style.overflow);
}

export function forceCloseAllModals() {
    console.log('🔄 Forza chiusura tutti i modali');
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('active');
    });
    
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
}

// Aggiungi alla console per test rapido
window.debugModals = debugModals;
window.forceCloseAllModals = forceCloseAllModals;