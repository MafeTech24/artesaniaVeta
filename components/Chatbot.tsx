
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hola, soy Veta-Bot. ¿En qué puedo ayudarte hoy con tu próximo mueble de autor?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendMessageToGemini(userMessage, history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[100]"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-[350px] md:w-[400px] h-[500px] bg-white border border-stone-200 shadow-2xl rounded-2xl flex flex-col z-[100] animate-[fadeInUp_0.3s_ease-out]">
          {/* Header */}
          <div className="p-4 bg-stone-900 text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center">
                <span className="text-[10px] font-bold">AV</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Asistente Virtual</h4>
                <p className="text-[10px] text-stone-400">En línea ahora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 border border-stone-100 shadow-sm rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex gap-1">
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-100 rounded-b-2xl">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="w-full pl-4 pr-12 py-3 bg-stone-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 p-2 text-stone-900 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
