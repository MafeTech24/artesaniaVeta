
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      // Error manejado en el context
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md p-8 md:p-12 shadow-2xl rounded-sm">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-stone-900 mb-2">Bienvenido</h2>
          <p className="text-stone-500 text-xs uppercase tracking-widest">Inicia sesión para continuar con tu compra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Email</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Contraseña</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-[10px] uppercase font-bold tracking-tight">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest">
            ¿No tienes cuenta? <span className="text-stone-900 font-bold cursor-pointer">Crea una pieza con nosotros</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
