export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedIngredients: string[];
  removedIngredients: string[];
  specialNote: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  tableNumber: number;
  status: 'pending' | 'preparing' | 'completed';
  totalAmount: number;
  orderTime: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'staff';
  message: string;
  timestamp: string;
}

export type ThemeMode = 'light' | 'dark';