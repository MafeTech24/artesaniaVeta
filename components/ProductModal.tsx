
import React, { useState } from 'react';
import { Product } from '../types';
import { SITE_IMAGES } from '../assets';
import { useCart } from '../contexts/cart';
import ShippingModal from './ShippingModal';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem, openCart } = useCart();
  const [shippingOpen, setShippingOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    openCart();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col md:flex-row shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-stone-900 md:text-stone-400 hover:text-stone-900 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="md:w-1/2 h-[400px] md:h-auto overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = SITE_IMAGES.productPlaceholder;
            }}
          />
        </div>

        {/* Info Container */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col">
          <div className="mb-auto">
            <span className="text-stone-400 uppercase tracking-widest text-xs mb-4 block">{product.category}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-light text-stone-900">
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
              </span>
              <span className={`px-3 py-1 text-[10px] tracking-widest uppercase font-bold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Sin Stock'}
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed mb-8 text-lg font-light">
              {product.description}
            </p>

            <div className="space-y-4 border-t border-stone-100 pt-8">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400 uppercase tracking-widest">Material principal</span>
                <span className="text-stone-900 font-medium">{product.woodType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400 uppercase tracking-widest">Tiempo de entrega</span>
                <span className="text-stone-900 font-medium">15 - 20 días hábiles</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-stone-900 text-white py-5 text-xs tracking-widest uppercase font-bold hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:hover:bg-stone-900"
            >
              {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
            </button>
            <button
              onClick={() => setShippingOpen(true)}
              className="flex-1 border border-stone-200 py-5 text-xs tracking-widest uppercase font-bold hover:bg-stone-50 transition-colors"
            >
              Consultar Envío
            </button>
          </div>
        </div>
      </div>

      {shippingOpen && <ShippingModal product={product} onClose={() => setShippingOpen(false)} />}
    </div>
  );
};

export default ProductModal;
