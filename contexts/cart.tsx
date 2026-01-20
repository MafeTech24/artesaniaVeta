import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CART_STORAGE_KEY = 'av_cart_v1';

const CartContext = createContext<CartContextValue | null>(null);

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota/security errors
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const addItem = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx === -1) {
        const qty = clamp(quantity, 1, product.stock);
        return [...prev, { product, quantity: qty }];
      }
      const next = [...prev];
      const current = next[idx];
      const newQty = clamp(current.quantity + quantity, 1, product.stock);
      next[idx] = { ...current, product, quantity: newQty };
      return next;
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      const next = prev.map((i) => {
        if (i.product.id !== productId) return i;
        const q = clamp(quantity, 1, i.product.stock || 99);
        return { ...i, quantity: q };
      });
      return next;
    });
  };

  const clear = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity * i.product.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
