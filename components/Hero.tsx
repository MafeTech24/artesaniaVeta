
import React from 'react';
import { SITE_IMAGES } from '../assets';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden scroll-mt-28">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110 hover:scale-100"
        style={{ backgroundImage: `url("${SITE_IMAGES.heroBackground}")` }}
      >
        <div className="absolute inset-0 bg-stone-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl opacity-0 translate-y-10 animate-[fadeInUp_1.2s_ease-out_forwards]">
        <span className="text-white/80 uppercase tracking-[0.4em] text-xs mb-6 block">Ebanistería de Autor</span>
        <h1 className="text-5xl md:text-8xl text-white font-serif mb-8 leading-tight">
          La Poesía de la <br /> <span className="italic">Madera Viva</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Cada pieza cuenta una historia grabada en sus vetas. Muebles diseñados para trascender generaciones, creados a mano con respeto por la naturaleza.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="#collections" className="px-10 py-4 bg-white text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-200 transition-all font-medium">
            Ver Colecciones
          </a>
          <a href="#about" className="px-10 py-4 border border-white text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-all font-medium">
            Nuestra Historia
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a href="#collections" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce cursor-pointer group">
        <div className="w-[1px] h-12 bg-white transition-all group-hover:h-16" />
        <span className="text-[10px] text-white uppercase tracking-widest">Explorar</span>
      </a>
    </section>
  );
};

export default Hero;
