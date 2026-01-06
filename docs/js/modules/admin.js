export class AdminManager {
    constructor(app) {
        console.log('👨‍💼 AdminManager inizializzato');
        this.app = app;
    }

    async addProduct(productData) {
        try {
            const { data, error } = await this.app.supabase
                .from('products')
                .insert([productData]);
            
            if (error) throw error;
            
            showNotification('Prodotto aggiunto con successo!', 'success');
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiunta prodotto:', error);
            showNotification('Errore aggiunta prodotto: ' + error.message, 'error');
        }
    }

    async updateProduct(id, updates) {
        try {
            const { data, error } = await this.app.supabase
                .from('products')
                .update(updates)
                .eq('id', id);
            
            if (error) throw error;
            
            showNotification('Prodotto aggiornato!', 'success');
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornamento prodotto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            const { error } = await this.app.supabase
                .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            showNotification('Prodotto eliminato!', 'success');
            
        } catch (error) {
            console.error('❌ Errore eliminazione prodotto:', error);
        }
    }

    async getOrders(status = null) {
        try {
            let query = this.app.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (status) {
                query = query.eq('order_status', status);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore recupero ordini:', error);
            return [];
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const { error } = await this.app.supabase
                .from('orders')
                .update({ 
                    order_status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);
            
            if (error) throw error;
            
            showNotification(`Ordine aggiornato a: ${status}`, 'success');
            
        } catch (error) {
            console.error('❌ Errore aggiornamento ordine:', error);
        }
    }
}