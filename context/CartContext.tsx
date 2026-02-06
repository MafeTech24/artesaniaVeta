
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartTotals } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setManualShipping: (cost: number) => void;
  totals: CartTotals;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('artesania_veta_cart');
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('artesania_veta_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setItems([]);
    setShippingCost(0);
  };

  const setManualShipping = (cost: number) => setShippingCost(cost);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Recalcular shipping si el subtotal cambia (Envío gratis automático)
  const effectiveShipping = subtotal >= 1500000 ? 0 : (subtotal === 0 ? 0 : shippingCost);

  const totals: CartTotals = {
    subtotal,
    shipping: effectiveShipping,
    discount: 0,
    total: subtotal + effectiveShipping
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, clearCart, 
      setManualShipping, totals, itemCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
