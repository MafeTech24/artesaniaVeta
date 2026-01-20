
import React, { useState } from 'react';
import { generateFurnitureImage } from '../services/geminiService';

const CustomDesigner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const url = await generateFurnitureImage(prompt);
    setGeneratedUrl(url);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedUrl) return;
    const link = document.createElement('a');
    link.href = generatedUrl;
    link.download = `artesania-veta-inspiracion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="designer" className="py-24 bg-stone-900 text-white overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal opacity-0 translate-y-10 transition-all duration-1000">
            <span className="text-stone-500 uppercase tracking-widest text-xs font-medium mb-4 block">Laboratorio de Diseño</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Visualiza tu mueble ideal con <span className="italic text-stone-400">Inteligencia Artificial</span>
            </h2>
            <p className="text-stone-400 leading-relaxed mb-10 text-lg">
              Describe el mueble de tus sueños y nuestro motor de IA lo visualizará al instante. Es el primer paso para nuestra colaboración artesanal.
            </p>
            
            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Una mesa exterior de nogal con bordes orgánicos y patas de hierro negro..."
                  className="w-full bg-stone-800 border-stone-700 rounded-sm p-6 text-white focus:outline-none focus:ring-1 focus:ring-stone-400 min-h-[120px] resize-none"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full py-5 bg-white text-stone-900 tracking-widest uppercase text-xs font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    Tallando Imagen...
                  </>
                ) : 'Generar Inspiración'}
              </button>
            </div>
          </div>

          <div className="relative aspect-square bg-stone-800 flex items-center justify-center border border-stone-700 overflow-hidden reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300 group/canvas">
            {generatedUrl ? (
              <div className="relative w-full h-full">
                <img src={generatedUrl} alt="Inspiración generada" className="w-full h-full object-cover animate-fade-in" />
                
                {/* Botón de descarga */}
                <button 
                  onClick={handleDownload}
                  title="Descargar Diseño"
                  className="absolute top-4 right-4 p-3 bg-stone-900/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover/canvas:opacity-100 transition-opacity hover:bg-stone-900 flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center p-12 space-y-4">
                <div className="w-16 h-16 border border-stone-700 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-stone-600 text-sm tracking-widest uppercase">El lienzo espera tu descripción</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xs tracking-[0.3em] uppercase">Pulimentando píxeles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomDesigner;
