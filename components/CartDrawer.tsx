import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateShipping } from '../services/shippingService';

const CartDrawer: React.FC = () => {
  const { items, totals, updateQuantity, removeItem, clearCart, setManualShipping, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [cp, setCp] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingMsg, setShippingMsg] = useState('');

  if (!isCartOpen) return null;

  const formatPrice = (p: number) => new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(p);

  const handleCalculateShipping = async () => {
    if (cp.length < 4) return;
    setIsCalculating(true);
    try {
      const result = await calculateShipping(cp, totals.subtotal);
      setManualShipping(result.cost);
      setShippingMsg(result.cost === 0 ? '¡Envío Bonificado!' : `Costo: ${formatPrice(result.cost)} (${result.zone})`);
    } catch (e) {
      setShippingMsg('Error al calcular.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth?mode=login&redirect=/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-fade-in">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h2 className="text-xl font-serif text-stone-900">Tu Selección</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-stone-500 font-light">Tu carrito está vacío.</p>
                <button onClick={() => {setIsCartOpen(false); navigate('/');}} className="text-stone-900 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1">Ver Colecciones</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-24 bg-stone-100 overflow-hidden rounded-sm">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-stone-900 font-serif text-sm">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1">-</button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">+</button>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-900 self-start"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))
            )}
            {items.length > 0 && (
              <div className="pt-6 border-t border-stone-100">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3">Calcular Envío</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="CP (ej: 1425)" value={cp} onChange={(e) => setCp(e.target.value)} className="flex-1 bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-stone-900" />
                  <button onClick={handleCalculateShipping} disabled={isCalculating || cp.length < 4} className="bg-stone-900 text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest disabled:opacity-50">{isCalculating ? '...' : 'OK'}</button>
                </div>
                {shippingMsg && <p className="mt-2 text-[10px] text-stone-600 font-medium">{shippingMsg}</p>}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
              <div className="flex justify-between items-baseline"><span className="text-stone-900 font-serif text-lg">Total</span><span className="text-stone-900 font-bold text-xl">{formatPrice(totals.total)}</span></div>
              <button onClick={handleCheckoutClick} className="w-full py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 shadow-xl">Finalizar Compra</button>
              <button onClick={() => {setIsCartOpen(false); navigate('/');}} className="w-full py-3 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest hover:bg-white">Seguir Comprando</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
