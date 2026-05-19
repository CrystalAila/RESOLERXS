export interface DashboardStats {
  total_products: number;
  low_stock_count: number;
  inventory_value: number;
  today_revenue: number;
  today_profit: number;
  today_transactions: number;
  month_revenue: number;
  month_profit: number;
}

export interface LowStockProduct {
  product_id: number;
  name: string;
  brand: string;
  size: string;
  quantity: number;
  low_stock_threshold: number;
}
