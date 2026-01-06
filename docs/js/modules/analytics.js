export class AnalyticsManager {
    constructor(app) {
        this.app = app;
    }
    
    async getSalesStats(startDate, endDate) {
        try {
            const { data, error } = await this.app.supabase
                .from('orders')
                .select('total_amount, created_at, order_status')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .eq('order_status', 'delivered');
            
            if (error) throw error;
            
            const stats = {
                totalSales: data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
                orderCount: data.length,
                averageOrderValue: data.length > 0 ? 
                    data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) / data.length : 0,
                byDay: this.groupByDay(data)
            };
            
            return stats;
            
        } catch (error) {
            console.error('❌ Errore statistiche:', error);
            return null;
        }
    }
    
    groupByDay(orders) {
        const days = {};
        orders.forEach(order => {
            const date = order.created_at.split('T')[0];
            days[date] = (days[date] || 0) + parseFloat(order.total_amount);
        });
        return days;
    }
}