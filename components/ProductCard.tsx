
import React from 'react';
import { Product } from '../types';
import { SITE_IMAGES } from '../assets';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(product.price);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product);
    }
  };

  return (
    <div 
      className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-4 rounded-sm transition-all" 
      onClick={() => onClick(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-stone-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = SITE_IMAGES.productPlaceholder;
          }}
        />
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-[8px] tracking-[0.2em] uppercase font-bold ${product.stock > 0 ? 'bg-white text-stone-900' : 'bg-red-900 text-white'}`}>
            {product.stock > 0 ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <button 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-stone-900 text-[10px] tracking-[0.2em] uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-bold whitespace-nowrap shadow-xl"
          tabIndex={-1} // Evitamos doble foco ya que el padre es el botón principal
        >
          Ver Detalles
        </button>
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="text-lg font-serif text-stone-800 truncate">{product.name}</h3>
          <span className="text-sm font-medium text-stone-900 whitespace-nowrap">{formattedPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">{product.category} — {product.woodType}</p>
          <span className="text-[10px] text-stone-500">{product.stock} en stock</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
