
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CustomDesigner from './components/CustomDesigner';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import CartDrawer from './components/CartDrawer';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { SITE_IMAGES } from './assets';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Nuestra Historia Section */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
            <span className="text-stone-400 uppercase tracking-widest text-xs font-medium mb-4 block">Legado y Oficio</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-8">
              Nuestra Historia: El susurro de las <span className="italic">Sierras de Córdoba</span>.
            </h2>
            <div className="space-y-6 text-stone-600 leading-relaxed text-lg font-light">
              <p>
                Todo comenzó en 1978, en un pequeño galpón de Barrio Güemes. Mi abuelo, un inmigrante con manos callosas y una devoción casi religiosa por el roble, nos enseñó que la madera no es un material, sino un ser vivo que guarda historias en sus anillos.
              </p>
              <p>
                Hoy, **Artesanía & Veta** es el puente entre ese pasado de gubia y martillo y un presente de diseño vanguardista. No fabricamos muebles en serie; domesticamos troncos caídos y maderas recuperadas para que vuelvan a la vida en forma de mesas imponentes o sillas que parecen flotar.
              </p>
              <p>
                Nuestra filosofía es la "paciencia absoluta". En un mundo que corre, nosotros nos detenemos a esperar que el aceite de lino penetre en la fibra, a que el ensamble calce a la perfección sin necesidad de un solo tornillo.
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-10">
              <div className="border-l-2 border-stone-200 pl-6">
                <p className="text-3xl font-serif text-stone-900">45+</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Años de Tradición</p>
              </div>
              <div className="border-l-2 border-stone-200 pl-6">
                <p className="text-3xl font-serif text-stone-900">0%</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Producción Industrial</p>
              </div>
              <div className="border-l-2 border-stone-200 pl-6">
                <p className="text-3xl font-serif text-stone-900">14</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Maestros Ebanistas</p>
              </div>
            </div>
          </div>

          <div className="relative reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300">
            <div className="relative group overflow-hidden bg-stone-200">
              <img 
                src={SITE_IMAGES.workshop}
                alt="Maestro ebanista en el taller" 
                className="w-full h-[650px] object-cover shadow-2xl transition-transform duration-[3000ms] group-hover:scale-105"
                onError={(e) => {
                   // Fallback por si el archivo no existe o falla al cargar.
                   (e.target as HTMLImageElement).src = SITE_IMAGES.productPlaceholder;
                }}
              />
              <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply pointer-events-none" />
            </div>
            {/* Decoración geométrica sutil */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-stone-100 -z-10 hidden lg:block" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-900/5 -z-10 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-24 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal opacity-0 translate-y-10 transition-all duration-1000">
            <div className="max-w-xl">
              <h2 className="text-4xl font-serif text-stone-900 mb-4">Colecciones de Autor</h2>
              <p className="text-stone-500 font-light">Explora nuestro catálogo completo de piezas únicas diseñadas para durar toda la vida.</p>
            </div>
            <a href="#collections" className="mt-8 md:mt-0 group flex items-center gap-2 text-stone-900 text-sm tracking-widest uppercase font-bold">
              Catálogo Completo
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {PRODUCTS.map((product, idx) => (
              <div key={product.id} className={`reveal opacity-0 translate-y-10 transition-all duration-1000`} style={{ transitionDelay: `${(idx % 4) * 100}ms` }}>
                <ProductCard product={product} onClick={setSelectedProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Designer Section */}
      <CustomDesigner />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-stone-900 overflow-hidden scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Hablemos de tu <span className="italic text-stone-400">próxima pieza</span></h2>
              <p className="text-stone-400 text-lg mb-12 font-light">
                Ya sea para una consulta sobre stock o un proyecto a medida, estamos aquí para asesorarte desde Córdoba para todo el país.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-stone-800 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-2">Nuestro Taller Principal</h4>
                    <p className="text-stone-400 font-light">Belgrano 789, Barrio Güemes<br />Córdoba Capital, Argentina</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-stone-800 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-2">Escríbenos</h4>
                    <p className="text-stone-400 font-light">info@artesaniayveta.com.ar<br />ventas@artesaniayveta.com.ar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-stone-800 pt-12">
          <div className="text-center md:text-left">
            <h3 className="text-white text-xl font-serif mb-2 tracking-tighter">ARTESANÍA & VETA</h3>
            <p className="text-[10px] uppercase tracking-[0.3em]">Córdoba, Argentina</p>
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <a href="#home" className="hover:text-white transition-colors">Inicio</a>
            <a href="#collections" className="hover:text-white transition-colors">Colecciones</a>
            <a href="#about" className="hover:text-white transition-colors">Artesanía</a>
            <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border border-stone-800 hover:border-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & AI Bot */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <CartDrawer />
      <Chatbot />
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
