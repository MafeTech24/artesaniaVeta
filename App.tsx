import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
  Navigate,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CustomDesigner from './components/CustomDesigner';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import CartDrawer from './components/CartDrawer';
import CheckoutFlow from './components/CheckoutFlow';
import AuthPage from './components/AuthPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { SITE_IMAGES } from './assets';

// ✅ Protected Route Wrapper (sin pantallas blancas)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-500">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?mode=login&redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
};

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
    <h2 className="text-6xl font-serif text-stone-200 mb-4">404</h2>
    <p className="text-stone-900 font-serif text-2xl mb-8">Esta pieza no existe en nuestra galería.</p>
    <Link
      to="/"
      className="px-12 py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
    >
      Volver al Inicio
    </Link>
  </div>
);

const HomeView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // ✅ Hash scroll (soporta "#home" y secciones)
    if (window.location.hash) {
      // Con HashRouter la URL queda tipo: "#/ruta#collections"
      // Ej: http://.../#/#collections o http://.../#/ #collections dependiendo del preview
      // Entonces buscamos el "último #"
      const full = window.location.hash;
      const lastHashIndex = full.lastIndexOf('#');
      const anchor = lastHashIndex >= 0 ? full.slice(lastHashIndex) : '';

      if (anchor === '#home' || anchor === '#' || anchor === '#/') {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else if (anchor.startsWith('#')) {
        const selector = anchor.replace('#/', '#');
        const el = document.querySelector(selector);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="home" />
      <Hero />

      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
            <span className="text-stone-400 uppercase tracking-widest text-xs font-medium mb-4 block">
              Legado y Oficio
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-8">
              Nuestra Historia: El susurro de las <span className="italic">Sierras de Córdoba</span>.
            </h2>
            <div className="space-y-6 text-stone-600 leading-relaxed text-lg font-light">
              <p>Todo comenzó en 1978... domesticamos troncos caídos para que vuelvan a la vida.</p>
            </div>
          </div>

          <div className="relative reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300">
            <img
              src={SITE_IMAGES.workshop}
              className="w-full h-[600px] object-cover shadow-2xl rounded-sm"
              alt="Artesanía en madera"
            />
          </div>
        </div>
      </section>

      <section id="collections" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-stone-900 mb-12">Colecciones de Autor</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {PRODUCTS.map((product, idx) => (
              <div
                key={product.id}
                className="reveal opacity-0 translate-y-10 transition-all duration-1000"
                style={{ transitionDelay: `${(idx % 4) * 100}ms` }}
              >
                <ProductCard product={product} onClick={setSelectedProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Para que NAVIGATION '#designer' funcione */}
      <section id="designer">
        <CustomDesigner />
      </section>

      <section id="contact" className="py-24 max-w-4xl mx-auto px-6">
        <ContactForm />
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

const SuccessView: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
        <div className="w-24 h-24 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-4xl font-serif text-stone-900">¡Tu orden está confirmada!</h2>
        <p className="text-stone-500 font-light">
          Estamos preparando tu pieza artesanal. Recibirás un correo con los detalles del envío.
        </p>

        <button
          onClick={() => navigate('/')}
          className="px-12 py-5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  return <CheckoutFlow onCancel={() => navigate('/')} onSuccess={() => navigate('/order/success')} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-stone-50 overflow-x-hidden">
            <Navbar />
            <CartDrawer />

            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order/success"
                element={
                  <ProtectedRoute>
                    <SuccessView />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>

            <Chatbot />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
