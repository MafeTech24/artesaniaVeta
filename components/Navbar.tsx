import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const scrollToHash = (hash: string) => {
    // hash "#home" es especial: scroll al top
    if (hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToHash = (hash: string) => {
    // Desde otra ruta, navegamos a "/#hash" y Home se encarga del scroll
    if (location.pathname !== '/') {
      navigate('/' + hash); // "/#collections"
      return;
    }
    // Si ya estamos en Home, scrollea directo
    scrollToHash(hash);
  };

  const handleNavItem = (href: string) => {
    const raw = href.trim();

    // Secciones en home (#about, #collections, etc.)
    if (raw.startsWith('#')) {
      goToHash(raw);
      return;
    }

    // Rutas internas (/checkout, /auth, etc.)
    const path = raw.startsWith('/') ? raw : `/${raw}`;
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 ${
        isScrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          to="/"
          className={`text-2xl font-serif font-bold tracking-tighter transition-colors ${
            isScrolled || !isHome ? 'text-stone-900' : 'text-white'
          }`}
          onClick={(e) => {
            // si ya estás en home, que haga scroll arriba en lugar de “nada”
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          ARTESANÍA & VETA
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          {NAVIGATION.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavItem(item.href)}
              className={`text-[11px] font-bold tracking-[0.2em] uppercase hover:opacity-60 transition-all ${
                isScrolled || !isHome ? 'text-stone-700' : 'text-white'
              }`}
              type="button"
            >
              {item.name}
            </button>
          ))}

          <div className="flex items-center gap-6 ml-4 border-l border-stone-200/20 pl-6">
            {isAuthenticated ? (
              <div className="group relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer ${
                    isScrolled || !isHome ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'
                  }`}
                  title={user?.name || 'Usuario'}
                >
                  {(user?.name?.[0] || 'U').toUpperCase()}
                </div>

                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 border border-stone-100">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-xs text-stone-700 hover:bg-stone-50 font-bold uppercase tracking-widest"
                    type="button"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`text-[11px] font-bold tracking-widest uppercase hover:opacity-60 ${
                  isScrolled || !isHome ? 'text-stone-900' : 'text-white'
                }`}
              >
                Entrar
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-all hover:scale-110 ${
                isScrolled || !isHome ? 'text-stone-900' : 'text-white'
              }`}
              type="button"
              aria-label="Abrir carrito"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
