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

// ------------------------------
// Gemini chat: modelo estable + retry/backoff
// ------------------------------

const SYSTEM_INSTRUCTION = `Eres "Veta-Bot", el asistente experto de la tienda "Artesanía & Veta".
Tu tono es profesional, cálido y elegante.
Estamos ubicados en Belgrano 789, Barrio Güemes, Córdoba, Argentina.
Sabes todo sobre muebles de madera hechos a mano.
Materiales: Roble, Nogal, Fresno, Ébano, Petiribí.
Procesos: Barnizado natural, tallado a mano, ensamble tradicional sin tornillos.
Si el cliente pregunta por precios, refiérelo a la sección de colecciones (#collections). Los precios están en Pesos Argentinos (ARS).
Responde siempre en español. Sé conciso pero servicial.`;

const CHAT_MODELS = (() => {
  const envModels = (process.env.GEMINI_CHAT_MODELS || '').trim();
  const list = envModels
    ? envModels.split(',').map((s) => s.trim()).filter(Boolean)
    : ['gemini-2.0-flash', 'gemini-1.5-flash']; 
  return list;
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const extractHttpCode = (err) => {
  // @google/genai suele exponer status numérico (p.ej. 503) en `err.status`
  if (err && typeof err.status === 'number') return err.status;
  // Algunos errores traen un JSON string dentro de message
  const msg = String(err?.message || '');
  const m = msg.match(/"code"\s*:\s*(\d{3})/);
  if (m) return Number(m[1]);
  return null;
};

const extractRetryDelayMs = (err) => {
  const msg = String(err?.message || '');
  // Caso 1: RetryInfo del backend: "retryDelay":"51s"
  const m1 = msg.match(/"retryDelay"\s*:\s*"(\d+)s"/);
  if (m1) return Number(m1[1]) * 1000;
  // Caso 2: Texto libre: "Please retry in 51.87s"
  const m2 = msg.match(/retry in\s+([0-9.]+)s/i);
  if (m2) return Math.ceil(Number(m2[1]) * 1000);
  return null;
};

const isRetryable = (code) => {
  // Transitorios típicos
  return code === 429 || code === 500 || code === 502 || code === 503 || code === 504;
};

const withRetry = async (fn, opts) => {
  const {
    maxRetries = 3,
    baseDelayMs = 600,
    maxDelayMs = 8000,
    jitter = 0.2,
  } = opts || {};

  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      const code = extractHttpCode(err) ?? 0;
      const retryable = isRetryable(code);
      if (!retryable || attempt === maxRetries) throw err;

      // Delay: usa retryDelay si viene, si no, exponencial + jitter
      const suggested = extractRetryDelayMs(err);
      const exp = baseDelayMs * Math.pow(2, attempt);
      const rand = 1 + (Math.random() * 2 - 1) * jitter; // 1 ± jitter
      const computed = Math.min(maxDelayMs, Math.ceil(exp * rand));
      const delay = suggested ? Math.min(maxDelayMs, Math.max(computed, suggested)) : computed;
      await sleep(delay);
    }
  }
  throw lastErr;
};

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

    // El frontend manda history con este formato:
    // [{ role: 'user'|'model', parts: [{ text: '...' }] }, ...]
    const safeHistory = Array.isArray(history) ? history : [];
    const contents = [
      ...safeHistory,
      { role: 'user', parts: [{ text: String(message) }] },
    ];

    // Intentamos con modelos estables (y fallback), con retry en errores transitorios.
    let lastError = null;
    for (const model of CHAT_MODELS) {
      try {
        const response = await withRetry(
          async () =>
            ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
              },
            }),
          { maxRetries: 3, baseDelayMs: 650, maxDelayMs: 8000, jitter: 0.25 }
        );

        const text =
          response?.text ||
          response?.candidates?.[0]?.content?.parts
            ?.map((p) => p?.text)
            ?.filter(Boolean)
            ?.join('') ||
          '';

        if (!text.trim()) {
          return res.status(502).json({ error: 'Gemini chat returned empty text' });
        }

        return res.json({ text });
      } catch (err) {
        lastError = err;
        const code = extractHttpCode(err);
        // Si el modelo no existe/está prohibido, probamos el siguiente.
        // Para errores transitorios, withRetry ya reintentó.
        if (code && !isRetryable(code)) {
          continue;
        }
        // Si es transitorio y aun así falló, probamos el siguiente modelo como fallback.
        continue;
      }
    }

    const code = extractHttpCode(lastError) || 500;
    console.error('Gemini chat error (after retries/models):', lastError);
    return res
      .status(code >= 400 && code <= 599 ? code : 500)
      .json({ error: 'Gemini chat failed', code });
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
  model: 'models/gemini-2.0-flash', 
  contents: {
    parts: [
          {
            text: `Genera una imagen de un mueble artesanal:: ${prompt}`,
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
