
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  woodType: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export type PaymentMethod = 'credit_card' | 'transfer' | 'cash' | 'mercadopago';
export type ShippingType = 'pickup' | 'delivery';

export interface ShippingCalculation {
  cost: number;
  etaDaysMin: number;
  etaDaysMax: number;
  zone: string;
}

export interface Order {
  id: string;
  createdAt: string;
  userId?: string;
  items: CartItem[];
  totals: CartTotals;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shipping: {
    type: ShippingType;
    cost: number;
    address?: string;
    city?: string;
    postalCode?: string;
    eta?: string;
  };
  payment: {
    method: PaymentMethod;
    status: 'pending' | 'approved' | 'rejected';
    transactionId?: string;
  };
  status: 'created' | 'processing' | 'shipped' | 'delivered';
}

export type AppView = 'home' | 'checkout' | 'order_success';
