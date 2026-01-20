
import React, { useState, useEffect } from 'react';
import { NAVIGATION } from '../constants';
import { useCart } from '../contexts/cart';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  const scrollToSection = (href: string) => {
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;

    // Compensa el navbar fijo para que el encabezado de cada seccion no quede tapado.
    const nav = document.querySelector('nav') as HTMLElement | null;
    const navHeight = nav?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    scrollToSection(href);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className={`text-2xl font-serif font-bold tracking-tighter transition-colors ${isScrolled ? 'text-stone-900' : 'text-white'}`}
        >
          ARTESANÍA & VETA
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-12">
          {NAVIGATION.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-sm font-medium tracking-widest uppercase transition-all hover:opacity-70 ${isScrolled ? 'text-stone-700' : 'text-white'}`}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={toggleCart}
            className={`relative p-2 rounded-lg transition-colors ${isScrolled ? 'text-stone-900' : 'text-white'}`}
            aria-label="Abrir carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2L17 13M7 13H5.4M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-stone-900' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-stone-900 text-white p-8 flex flex-col space-y-6 animate-fade-in-down">
          {NAVIGATION.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-lg font-light tracking-widest uppercase border-b border-stone-800 pb-2"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
