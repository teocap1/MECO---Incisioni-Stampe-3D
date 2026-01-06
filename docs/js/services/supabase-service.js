// js/services/supabase-service.js - VERSIONE COMPLETA
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm';

// Configurazione
const SUPABASE_URL = 'https://lakohmwnieglenrqvbaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha29obXduaWVnbGVucnF2YmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDYzODQsImV4cCI6MjA4MzE4MjM4NH0.0iSPz0WS8XPBBFd4pNMayLNPDq-fg9GSp8JIyCxSCWc';

// Crea client Supabase una sola volta
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'meco-supabase-auth'
    }
});

console.log('✅ Supabase Service inizializzato');

// ============ FUNZIONI ESPORTATE ============

// Prodotti
export async function getProducts(category = null) {
    try {
        let query = supabaseClient
            .from('products')
            .select('*')
            .eq('active', true);
        
        if (category && category !== 'tutti') {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        return { data: data || [], error };
    } catch (error) {
        console.error('❌ Errore getProducts:', error);
        return { data: [], error };
    }
}

export async function getProductById(id) {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        return { data, error };
    } catch (error) {
        console.error('❌ Errore getProductById:', error);
        return { data: null, error };
    }
}

// Carrello
export async function getUserCart(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('active', true);
        
        return { data: data || [], error };
    } catch (error) {
        console.error('❌ Errore getUserCart:', error);
        return { data: [], error };
    }
}

export async function addToCart(userId, productId, quantity = 1, customizations = {}) {
    try {
        const { data, error } = await supabaseClient
            .from('cart_items')
            .upsert({
                user_id: userId,
                product_id: productId,
                quantity,
                customizations
            }, {
                onConflict: 'user_id,product_id'
            });
        
        return { data, error };
    } catch (error) {
        console.error('❌ Errore addToCart:', error);
        return { data: null, error };
    }
}

export async function clearUserCart(userId) {
    try {
        const { error } = await supabaseClient
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        
        return { error };
    } catch (error) {
        console.error('❌ Errore clearUserCart:', error);
        return { error };
    }
}

// Auth helper
export async function updateProfile(userId, profileData) {
    try {
        const { error } = await supabaseClient
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            });
        
        return { error };
    } catch (error) {
        console.error('❌ Errore updateProfile:', error);
        return { error };
    }
}

// Test connessione
export async function testConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('id')
            .limit(1);
        
        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
}

// Esponi anche il client per uso diretto (se necessario)
export { supabaseClient };