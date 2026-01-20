import React, { useMemo } from 'react';
import { useCart } from '../contexts/cart';
import { SITE_IMAGES } from '../assets';

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, items, subtotal, removeItem, setQuantity, clear } = useCart();

  const canCheckout = useMemo(() => items.length > 0, [items.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300]">
      <div className="absolute inset-0 bg-stone-900/70" onClick={closeCart} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif text-stone-900">Carrito</h3>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Piezas seleccionadas</p>
          </div>
          <button onClick={closeCart} className="text-stone-400 hover:text-stone-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-stone-500 py-16">
              <p className="text-sm">Tu carrito está vacío.</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-2">Explorá colecciones y agregá piezas.</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 border border-stone-100 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover bg-stone-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SITE_IMAGES.productPlaceholder;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-serif text-stone-900 truncate">{product.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{product.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                      aria-label={`Quitar ${product.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200">
                      <button
                        className="px-3 py-2 text-stone-700 hover:bg-stone-50"
                        onClick={() => setQuantity(product.id, Math.max(1, quantity - 1))}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="px-3 py-2 text-sm text-stone-900 min-w-[40px] text-center">{quantity}</span>
                      <button
                        className="px-3 py-2 text-stone-700 hover:bg-stone-50"
                        onClick={() => setQuantity(product.id, Math.min(product.stock || 99, quantity + 1))}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-900">{formatARS(product.price * quantity)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400">{formatARS(product.price)} c/u</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Subtotal</span>
            <span className="text-stone-900 font-medium">{formatARS(subtotal)}</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Envíos y tiempos se cotizan según destino y dimensiones de la pieza. Para muebles de gran porte, el despacho se coordina con logística especializada.
          </p>
          <div className="flex gap-3">
            <button
              onClick={clear}
              disabled={!canCheckout}
              className="flex-1 border border-stone-200 py-4 text-[10px] tracking-widest uppercase font-bold hover:bg-stone-50 transition-colors disabled:opacity-40"
            >
              Vaciar
            </button>
            <button
              disabled={!canCheckout}
              className="flex-1 bg-stone-900 text-white py-4 text-[10px] tracking-widest uppercase font-bold hover:bg-stone-800 transition-colors disabled:opacity-40"
            >
              Finalizar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
