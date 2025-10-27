import { Product } from "./product.model";

export interface CartItem {
  product:Product;
  quantity: number;
  price: number;
}

export interface OrderModel {
  id: number;
  reference: string;
  date: string;
  total: number;
  created_at: string;
  status: 'paid' | 'pending' | 'cancelled';
  items: { name: string; quantity: number; price: number, product: Product }[];
}