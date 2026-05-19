export interface SaleItemLine {
  sale_item_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  line_profit: number;
  product?: {
    product_id: number;
    name: string;
    brand: string;
    size: string;
  };
}

export interface SaleColumns {
  sale_id: number;
  user_id: number;
  sale_date: string;
  total_amount: number;
  total_profit: number;
  notes?: string | null;
  user?: { user_id: number; name: string };
  items?: SaleItemLine[];
}

export interface CartItem {
  product_id: number;
  name: string;
  brand: string;
  size: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  max_quantity: number;
}

export interface SaleFieldErrors {
  items?: string[];
  notes?: string[];
}
