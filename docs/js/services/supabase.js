import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm';
export { supabaseClient as supabase } from './supabase-service.js';
export { 
    getProducts, 
    getProductById, 
    getUserCart, 
    addToCart, 
    clearUserCart, 
    updateProfile,
    testConnection 
} from './supabase-service.js';

// ============ CONFIGURAZIONE PER PRODUZIONE ============
const SUPABASE_URL = 'https://lakohmwnieglenrqvbaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha29obXduaWVnbGVucnF2YmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDYzODQsImV4cCI6MjA4MzE4MjM4NH0.0iSPz0WS8XPBBFd4pNMayLNPDq-fg9GSp8JIyCxSCWc'; // ← TUA ANON KEY QUI

console.log('🚀 Supabase config per:', window.location.origin);

// Crea client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'meco-supabase-auth'
    },
    global: {
        headers: {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
});

// ============ FUNZIONI HELPER ============
export const SupabaseService = {
    // ============ AUTH ============
    async signUp(email, password, userData) {
        console.log('📝 Registrazione:', email);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData,
                emailRedirectTo: window.location.origin
            }
        });
        
        if (error) {
            console.error('❌ Errore registrazione:', error);
            return { data, error };
        }
        
        // Crea profilo automaticamente
        if (data?.user) {
            await this.createProfile(data.user.id, {
                nome: userData.nome || '',
                cognome: userData.cognome || '',
                email_verificata: false
            });
        }
        
        console.log('✅ Registrazione completata');
        return { data, error: null };
    },

    async signIn(email, password) {
        console.log('🔐 Login:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        return { data, error };
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // In supabase.js, dentro SupabaseService
    async updateProfile(userId, updates) {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    ...updates,
                    updated_at: new Date().toISOString()
                });
            
            return { error };
        } catch (error) {
            console.error('Exception updateProfile:', error);
            return { error };
        }
    },

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.log('Nessun utente loggato');
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Errore getCurrentUser:', error);
            return null;
        }
    },

    async createProfile(userId, profileData) {
        try {
            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    ...profileData,
                    created_at: new Date().toISOString()
                });
            
            if (error) {
                console.error('Errore creazione profilo:', error);
            }
        } catch (error) {
            console.error('Exception creazione profilo:', error);
        }
    },

    // ============ PRODOTTI ============
    async getProducts(category = null) {
        console.log('🛍️ Caricamento prodotti...');
        
        let query = supabase
            .from('products')
            .select('*')
            .eq('active', true);
        
        if (category && category !== 'tutti') {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('❌ Errore caricamento prodotti:', error);
            return { data: [], error };
        }
        
        console.log(`✅ Caricati ${data?.length || 0} prodotti`);
        return { data: data || [], error: null };
    },

    async getProductById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        return { data, error };
    },

    // ============ CARRELLO ============
    async getCart(userId) {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                products (*)
            `)
            .eq('user_id', userId)
            .eq('active', true);
        
        return { data, error };
    },

    async addToCart(userId, productId, quantity = 1, customizations = {}) {
        const { data, error } = await supabase
            .from('cart_items')
            .upsert({
                user_id: userId,
                product_id: productId,
                quantity,
                customizations: customizations,
                added_at: new Date().toISOString(),
                active: true
            }, {
                onConflict: 'user_id,product_id',
                ignoreDuplicates: false
            });
        
        return { data, error };
    },

    async clearCart(userId) {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        
        return { error };
    },

    // ============ DEBUG & TEST ============
    async testConnection() {
        console.log('🧪 Test connessione Supabase...');
        
        try {
            // Test 1: Auth
            const { error: authError } = await supabase.auth.getSession();
            console.log('Auth test:', authError ? '❌ ' + authError.message : '✅ OK');
            
            // Test 2: Database
            const { error: dbError } = await supabase
                .from('products')
                .select('id')
                .limit(1);
            
            console.log('Database test:', dbError ? '❌ ' + dbError.message : '✅ OK');
            
            return !authError && !dbError;
            
        } catch (error) {
            console.error('❌ Test fallito:', error);
            return false;
        }
    }
};

// ============ TEST AUTOMATICO AL CARICAMENTO ============
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🔍 Test automatico Supabase...');
    
    // Aspetta che la pagina sia completamente caricata
    setTimeout(async () => {
        const connected = await SupabaseService.testConnection();
        
        if (connected) {
            console.log('🎉 Supabase connesso correttamente!');
            
            // Auto-login di test (opzionale)
            // await testAutoLogin();
        } else {
            console.warn('⚠️ Problemi di connessione con Supabase');
            alert('⚠️ Controlla la console per problemi di connessione con Supabase');
        }
    }, 2000);
});

// Funzione di test auto-login (OPZIONALE - rimuovi in produzione)
async function testAutoLogin() {
    // Crea utente di test se non esiste
    const testEmail = `test${Date.now()}@test.com`;
    const testPassword = 'Test123!';
    
    const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
            data: { nome: 'Test', cognome: 'User' },
            emailConfirm: false
        }
    });
    
    if (!error) {
        console.log('👤 Utente test creato:', testEmail);
    }
}