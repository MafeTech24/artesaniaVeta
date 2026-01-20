
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulamos envío
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="bg-stone-800 p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-white mb-4">Mensaje Recibido</h3>
        <p className="text-stone-400">Un maestro ebanista se pondrá en contacto con usted en las próximas 24 horas.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">Nombre Completo</label>
          <input 
            required
            type="text" 
            className="w-full bg-stone-800 border-none p-4 text-white focus:ring-1 focus:ring-stone-400 outline-none transition-all"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">Email</label>
          <input 
            required
            type="email" 
            className="w-full bg-stone-800 border-none p-4 text-white focus:ring-1 focus:ring-stone-400 outline-none transition-all"
            placeholder="juan@ejemplo.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">Proyecto / Interés</label>
        <select className="w-full bg-stone-800 border-none p-4 text-white focus:ring-1 focus:ring-stone-400 outline-none transition-all appearance-none">
          <option>Consulta General</option>
          <option>Presupuesto para mueble a medida</option>
          <option>Visita al taller en Córdoba</option>
          <option>Colaboración Profesional</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">Mensaje</label>
        <textarea 
          required
          rows={4}
          className="w-full bg-stone-800 border-none p-4 text-white focus:ring-1 focus:ring-stone-400 outline-none transition-all resize-none"
          placeholder="Cuéntanos sobre tu espacio..."
        />
      </div>
      <button 
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-5 bg-white text-stone-900 tracking-widest uppercase text-xs font-bold hover:bg-stone-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {status === 'sending' ? (
          <>
            <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
            Enviando...
          </>
        ) : 'Enviar Solicitud'}
      </button>
    </form>
  );
};

export default ContactForm;
