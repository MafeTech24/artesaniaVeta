import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Carga variables de entorno (.env y/o .env.local)
// - .env.local suele estar ignorado por git
dotenv.config({ path: '.env.local' });
dotenv.config();

const PORT = Number(process.env.PORT || 8787);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// Si desplegas frontend y backend en dominios distintos, define CORS_ORIGIN.
// Ejemplo: CORS_ORIGIN=https://tu-frontend.com
app.use(
  cors({
    origin: CORS_ORIGIN ? CORS_ORIGIN.split(',').map((s) => s.trim()) : true,
  })
);

// Rate limiting basico para reducir abuso de endpoints (recomendado en prod)
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment' });
    }

    const { message, history } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
      // NOTA: el SDK puede administrar historial internamente. Si queres persistencia,
      // podes enviar history en futuras iteraciones.
    });

    // Si llega history, enviamos un primer mensaje "silencioso"? Para no complicar,
    // dejamos que el SDK gestione contexto en esta request.
    // Para mantener simplicidad, usamos solo message.
    const result = await chat.sendMessage({ message });

    return res.json({ text: result.text });
  } catch (err) {
    console.error('Gemini chat error:', err);
    return res.status(500).json({ error: 'Gemini chat failed' });
  }
});

app.post('/api/gemini/image', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment' });
    }

    const { prompt } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
          aspectRatio: '1:1',
        },
      },
    });

    let dataUrl = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        dataUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return res.json({ dataUrl });
  } catch (err) {
    console.error('Gemini image error:', err);
    return res.status(500).json({ error: 'Gemini image failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini backend listening on http://localhost:${PORT}`);
});
