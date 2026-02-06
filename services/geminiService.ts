
import { GoogleGenAI } from "@google/genai";

// Vite expone variables con prefijo VITE_ en el cliente.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Eres "Veta-Bot", el asistente experto de la tienda "Artesanía & Veta". 
        Tu tono es profesional, cálido y elegante. 
        Estamos ubicados en Belgrano 789, Barrio Güemes, Córdoba, Argentina.
        Sabes todo sobre muebles de madera hechos a mano. 
        Materiales: Roble, Nogal, Fresno, Ébano, Petiribí. 
        Procesos: Barnizado natural, tallado a mano, ensamble tradicional sin tornillos. 
        Si el cliente pregunta por precios, refiérelo a la sección de colecciones (#collections). Los precios están en Pesos Argentinos (ARS).
        Responde siempre en español. Sé conciso pero servicial.`,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage({ message });
    return result.text ?? "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, estoy teniendo dificultades para conectar ahora mismo. ¿Podrías intentarlo de nuevo en un momento?";
  }
};

export const generateFurnitureImage = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Un mueble de madera artesanal de alta gama, estilo elegante y minimalista, fotografía profesional de estudio, iluminación cálida, fondo neutro. Descripción específica: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response?.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
