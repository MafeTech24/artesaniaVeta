// IMPORTANT SECURITY NOTE
// -----------------------
// No expongas tu Gemini API Key en el frontend. Cualquier clave que llegue al navegador
// puede ser vista por terceros.
//
// Esta app llama a un backend (server/index.js) que mantiene la clave en el servidor.
// En desarrollo, Vite hace proxy de /api hacia http://localhost:8787 (ver vite.config.ts).

export type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const jsonFetch = async <T>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
};

export const sendMessageToGemini = async (message: string, history: ChatHistory) => {
  try {
    const data = await jsonFetch<{ text: string }>(`/api/gemini/chat`, { message, history });
    return data.text;
  } catch (error) {
    console.error('Error calling backend Gemini chat:', error);
    return 'Lo siento, ahora mismo no puedo conectar con el asistente. Si es tu primera vez ejecutando el proyecto, asegurate de levantar el servidor (npm run dev:server) y configurar GEMINI_API_KEY en .env.local.';
  }
};

export const generateFurnitureImage = async (prompt: string): Promise<string | null> => {
  try {
    const data = await jsonFetch<{ dataUrl: string | null }>(`/api/gemini/image`, { prompt });
    return data.dataUrl;
  } catch (error) {
    console.error('Error calling backend Gemini image:', error);
    return null;
  }
};
