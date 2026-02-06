
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LS_LAST_EMAIL_KEY = 'artesania_veta_last_email';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login, register, resetPassword, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectPath);
  }, [isAuthenticated, navigate, redirectPath]);

  useEffect(() => {
    const lastEmail = localStorage.getItem(LS_LAST_EMAIL_KEY);
    if (lastEmail) {
      setFormData((prev) => ({ ...prev, email: lastEmail }));
      setRememberEmail(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [registerNotice, setRegisterNotice] = useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetNotice(null);
    setRegisterNotice(null);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        });
        setRegisterNotice('Cuenta creada (verificación pendiente).');
      }
      if (rememberEmail) {
        localStorage.setItem(LS_LAST_EMAIL_KEY, formData.email.trim());
      } else {
        localStorage.removeItem(LS_LAST_EMAIL_KEY);
      }
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 pt-32">
      <div className="bg-white w-full max-w-md p-10 shadow-2xl rounded-sm animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-stone-900 mb-2">
            {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
          </h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">
            {mode === 'login' ? 'Accede a tu cuenta de autor' : 'Únete a nuestra comunidad artesana'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Nombre Completo</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm" placeholder="Juan Pérez" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Teléfono</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm" placeholder="+54 351 ..." />
              </div>
            </>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Contraseña</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border-b border-stone-200 py-3 focus:border-stone-900 outline-none transition-colors text-sm" placeholder="••••••••" />
            <p className="mt-2 text-[10px] uppercase tracking-widest text-stone-400">
              8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.
            </p>
          </div>

          {mode === 'login' && (
            <button
              type="button"
              onClick={async () => {
                setResetNotice(null);
                const result = await resetPassword(formData.email);
                if (result?.ok) setResetNotice(result.message);
              }}
              className="text-stone-400 text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors text-left"
            >
              ¿Olvidaste tu contraseña? Reenviar por email
            </button>
          )}

          {mode === 'login' && (
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="accent-stone-900"
              />
              Recuérdame
            </label>
          )}

          {error && <p className="text-red-600 text-[10px] uppercase font-bold text-center">{error}</p>}
          {resetNotice && <p className="text-emerald-700 text-[10px] uppercase font-bold text-center">{resetNotice}</p>}
          {registerNotice && <p className="text-emerald-700 text-[10px] uppercase font-bold text-center">{registerNotice}</p>}

          <button type="submit" disabled={isLoading} className="w-full py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all disabled:opacity-50">
            {isLoading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              clearError();
              setResetNotice(null);
              setRegisterNotice(null);
            }}
            className="text-stone-400 text-[10px] uppercase tracking-widest hover:text-stone-900 transition-colors"
          >
            {mode === 'login' ? '¿No tienes cuenta? Registrate' : '¿Ya eres miembro? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
