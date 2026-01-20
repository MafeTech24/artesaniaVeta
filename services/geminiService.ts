import { GoogleGenerativeAI } from "@google/generative-ai";

// En Vercel, asegúrate de crear la variable llamada exactamente API_KEY
const API_KEY = process.env.API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const sendMessageToGemini = async (message: string, history: any[]) => {
  // Usamos gemini-2.0-flash que es el estándar actual por velocidad y costo
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: `Eres "Veta-Bot", el asistente experto de la tienda "Artesanía & Veta". 
        Tu tono es profesional, cálido y elegante. 
        Estamos ubicados en Belgrano 789, Barrio Güemes, Córdoba, Argentina.
        Sabes todo sobre muebles de madera hechos a mano. 
        Materiales: Roble, Nogal, Fresno, Ébano, Petiribí. 
        Procesos: Barnizado natural, tallado a mano, ensamble tradicional sin tornillos. 
        Si el cliente pregunta por precios, refiérelo a la sección de colecciones (#collections). Los precios están en Pesos Argentinos (ARS).
        Responde siempre en español. Sé conciso pero servicial.`,
  });

  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, estoy teniendo dificultades para conectar ahora mismo. ¿Podrías intentarlo de nuevo en un momento?";
  }
};

export const generateFurnitureImage = async (prompt: string): Promise<string | null> => {
  try {
    // Para generación de imágenes en 2026 usamos el modelo específico de Imagen a través de Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
    
    const result = await model.generateContent([
      `Un mueble de madera artesanal de alta gama, estilo elegante y minimalista, fotografía profesional de estudio, iluminación cálida, fondo neutro. Descripción específica: ${prompt}`
    ]);
    
    const response = await result.response;
    // Nota: La generación de imágenes base64 depende de los permisos de tu API Key de Google Cloud
    const imagePart = response.candidates?.[0].content.parts.find(part => part.inlineData);
    
    if (imagePart) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
