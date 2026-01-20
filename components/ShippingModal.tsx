import React, { useMemo, useState } from 'react';
import type { Product } from '../types';

interface ShippingModalProps {
  product: Product;
  onClose: () => void;
}

// Valida CPA (e.g. X5000ABC) o CP numérico (e.g. 5000)
function isValidPostalCode(value: string) {
  const v = value.trim().toUpperCase();
  return /^\d{4}$/.test(v) || /^[A-Z]\d{4}[A-Z]{3}$/.test(v);
}

function estimateDays(postal: string) {
  const v = postal.trim().toUpperCase();
  // Heurística simple: Córdoba (X) más rápido; resto, estándar.
  if (v.startsWith('X') || v === '5000') return '3 - 7 días hábiles';
  return '7 - 15 días hábiles';
}

const ShippingModal: React.FC<ShippingModalProps> = ({ product, onClose }) => {
  const [postalCode, setPostalCode] = useState('');
  const [copied, setCopied] = useState(false);

  const valid = useMemo(() => isValidPostalCode(postalCode), [postalCode]);
  const eta = useMemo(() => (valid ? estimateDays(postalCode) : null), [valid, postalCode]);

  const message = useMemo(() => {
    const pc = postalCode.trim();
    return `Hola! Quiero consultar envío para: ${product.name}.\nCP destino: ${pc || '(sin informar)'}\n¿Costo estimado, opciones de logística y tiempos?`;
  }, [product.name, postalCode]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si el navegador bloquea clipboard, no hacemos nada.
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Consultar envío</p>
            <h3 className="text-2xl font-serif text-stone-900 mt-2">{product.name}</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors" aria-label="Cerrar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">Código Postal (CPA o 4 dígitos)</label>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Ej: 5000 o X5000ABC"
              className="w-full bg-stone-100 p-4 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            {postalCode.trim().length > 0 && !valid && (
              <p className="text-xs text-red-600 mt-2">Formato inválido. Usá 5000 o X5000ABC.</p>
            )}
          </div>

          <div className="bg-stone-50 border border-stone-100 p-4 space-y-2">
            <p className="text-sm text-stone-800">
              <span className="font-medium">Tiempo estimado:</span> {eta ?? 'Ingresá tu CP para estimar.'}
            </p>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              El costo de envío para muebles depende de dimensiones, peso y seguro. La cotización final se confirma al validar destino y detalle de la pieza.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Mensaje sugerido</p>
            <textarea
              readOnly
              value={message}
              rows={4}
              className="w-full bg-white border border-stone-200 p-4 text-sm text-stone-800 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={copy}
            className="flex-1 border border-stone-200 py-4 text-[10px] tracking-widest uppercase font-bold hover:bg-stone-50 transition-colors"
          >
            {copied ? 'Copiado' : 'Copiar mensaje'}
          </button>
          <button
            onClick={() => {
              onClose();
              // Lleva al usuario al formulario de contacto
              const el = document.querySelector('#contact') as HTMLElement | null;
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 bg-stone-900 text-white py-4 text-[10px] tracking-widest uppercase font-bold hover:bg-stone-800 transition-colors"
          >
            Ir a contacto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingModal;
