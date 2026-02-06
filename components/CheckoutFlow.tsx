
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveOrder } from '../services/orderService';
import { processSimulatedPayment } from '../services/paymentService';
import { Order, ShippingType, PaymentMethod } from '../types';

interface CheckoutFlowProps {
  onCancel: () => void;
  onSuccess: (order: Order) => void;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ onCancel, onSuccess }) => {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    shippingType: (totals.shipping > 0 || totals.subtotal >= 1500000) ? 'delivery' : 'pickup' as ShippingType,
    address: '',
    city: 'Córdoba',
    postalCode: '',
    paymentMethod: 'credit_card' as PaymentMethod,
  });

  const formatPrice = (p: number) => new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0
  }).format(p);

  const handleFinalSubmit = async () => {
    setStatus('processing');
    setErrorMessage('');
    
    try {
      // 1. Simular Pago
      const payment = await processSimulatedPayment(totals.total, formData.paymentMethod);
      
      if (payment.status === 'rejected') {
        throw new Error(payment.error || 'El pago fue rechazado.');
      }

      // 2. Crear Orden
      const order = await saveOrder({
        userId: user?.id,
        items: items,
        totals: totals,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          type: formData.shippingType,
          cost: totals.shipping,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        payment: {
          method: formData.paymentMethod,
          status: 'approved',
          transactionId: payment.transactionId
        }
      });

      clearCart();
      onSuccess(order);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado.');
    }
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6">
        <div className="w-16 h-16 border-4 border-stone-900 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Validando Transacción</h2>
        <p className="text-stone-500 text-sm tracking-widest uppercase">Por favor, no cierre esta ventana...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1 space-y-12">
            <div className="flex items-center gap-4 text-stone-300">
              <span className={`text-xs font-bold uppercase tracking-widest ${step === 1 ? 'text-stone-900' : ''}`}>01 Datos</span>
              <div className="w-8 h-[1px] bg-stone-200" />
              <span className={`text-xs font-bold uppercase tracking-widest ${step === 2 ? 'text-stone-900' : ''}`}>02 Envío</span>
              <div className="w-8 h-[1px] bg-stone-200" />
              <span className={`text-xs font-bold uppercase tracking-widest ${step === 3 ? 'text-stone-900' : ''}`}>03 Pago</span>
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-100 p-6 flex items-start gap-4 animate-fade-in">
                <div className="text-red-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-bold text-sm uppercase tracking-widest mb-1">Error en el Pago</p>
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-[10px] font-bold uppercase tracking-widest border-b border-red-800">Reintentar</button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl font-serif text-stone-900">Tus Datos</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Nombre Completo</label>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white border border-stone-200 p-4 outline-none focus:border-stone-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Teléfono</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-stone-200 p-4 outline-none focus:border-stone-900" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!formData.fullName || !formData.phone} className="px-12 py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-50">Continuar al Envío</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl font-serif text-stone-900">Método de Entrega</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <button onClick={() => setFormData({...formData, shippingType: 'delivery'})} className={`p-6 border text-left transition-all ${formData.shippingType === 'delivery' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-900'}`}>
                    <p className="font-bold text-xs uppercase tracking-widest mb-1">Envío a Domicilio</p>
                    <p className="text-[10px] opacity-70">Logística Especializada</p>
                  </button>
                  <button onClick={() => setFormData({...formData, shippingType: 'pickup'})} className={`p-6 border text-left transition-all ${formData.shippingType === 'pickup' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-900'}`}>
                    <p className="font-bold text-xs uppercase tracking-widest mb-1">Retiro en Taller</p>
                    <p className="text-[10px] opacity-70">Barrio Güemes, Córdoba</p>
                  </button>
                </div>
                {formData.shippingType === 'delivery' && (
                  <div className="space-y-6 pt-4 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Dirección</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-stone-200 p-4 outline-none focus:border-stone-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">CP</label>
                        <input type="text" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-white border border-stone-200 p-4 outline-none focus:border-stone-900" placeholder="Ej: 1425" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Ciudad</label>
                        <input type="text" value={formData.city} readOnly className="w-full bg-stone-100 border border-stone-200 p-4 outline-none" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-8 py-5 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest">Volver</button>
                  <button onClick={() => setStep(3)} disabled={formData.shippingType === 'delivery' && (!formData.address || !formData.postalCode)} className="flex-1 py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-50">Continuar al Pago</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl font-serif text-stone-900">Confirmar Pago</h2>
                <div className="space-y-4">
                  {['credit_card', 'mercadopago', 'transfer'].map(method => (
                    <button key={method} onClick={() => setFormData({...formData, paymentMethod: method as PaymentMethod})} className={`w-full p-6 border flex items-center justify-between transition-all ${formData.paymentMethod === method ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200'}`}>
                      <span className="text-xs font-bold uppercase tracking-widest">{method.replace('_', ' ')}</span>
                      <div className={`w-4 h-4 rounded-full border ${formData.paymentMethod === method ? 'bg-stone-900 border-stone-900' : 'border-stone-300'}`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-8 py-5 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest">Volver</button>
                  <button onClick={handleFinalSubmit} className="flex-1 py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 shadow-xl">Confirmar e Invertir</button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-96">
            <div className="bg-white border border-stone-200 p-8 sticky top-32 shadow-sm">
              <h3 className="text-lg font-serif text-stone-900 mb-6 border-b border-stone-100 pb-4">Tu Inversión</h3>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-stone-600 truncate flex-1 pr-4">{item.name} x{item.quantity}</span>
                    <span className="text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-stone-100 pt-6">
                <div className="flex justify-between text-xs text-stone-500"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
                <div className="flex justify-between text-xs text-stone-500"><span>Envío</span><span>{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</span></div>
                <div className="flex justify-between text-lg font-serif text-stone-900 pt-2 border-t border-stone-200"><span>Total</span><span className="font-bold">{formatPrice(totals.total)}</span></div>
              </div>
              <button onClick={onCancel} className="w-full mt-8 text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors font-bold">Cancelar Pedido</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
