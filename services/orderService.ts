
import { Order } from '../types';

export const saveOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
  // Simulación de guardado en base de datos
  await new Promise(resolve => setTimeout(resolve, 2000));

  const newOrder: Order = {
    ...orderData,
    id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: 'created'
  };

  // Persistencia local para el historial del usuario
  const existingOrders = JSON.parse(localStorage.getItem('artesania_veta_orders') || '[]');
  localStorage.setItem('artesania_veta_orders', JSON.stringify([...existingOrders, newOrder]));

  return newOrder;
};
