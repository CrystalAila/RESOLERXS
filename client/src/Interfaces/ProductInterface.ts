export interface ProductColumns {
  product_id: number;
  name: string;
  brand: string;
  size: string;
  sku?: string | null;
  capital_price: number;
  selling_price: number;
  quantity: number;
  low_stock_threshold: number;
  image?: string | null;
  has_image?: boolean;
  is_low_stock?: boolean;
  is_deleted?: boolean;
}

export interface ProductFieldErrors {
  product_image?: string[];
  name?: string[];
  brand?: string[];
  size?: string[];
  sku?: string[];
  capital_price?: string[];
  selling_price?: string[];
  quantity?: string[];
  low_stock_threshold?: string[];
}
