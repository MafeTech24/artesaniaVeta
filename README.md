# Artesanía & Veta

E-commerce boutique de muebles artesanales en madera, con catálogo, carrito, checkout y asistente inteligente.  
Creado inicialmente con **Google AI Studio**, luego personalizado por mí y continuado con la ayuda de **Codex**.  
Despliegue previsto en **Vercel**.

## Stack
- React + TypeScript + Vite
- React Router
- Tailwind CSS

## Requisitos
- Node.js 18+ (recomendado)

## Instalación
```bash
npm install
```

## Variables de entorno
Este proyecto usa **Gemini** en el frontend (Vite), por lo que la key se expone en el bundle.

Creá `.env` en la raíz:
```
VITE_GEMINI_API_KEY=tu_clave
```

## Desarrollo local
```bash
npm run dev
```

App:
- `http://localhost:3000`

## Build
```bash
npm run build
npm run preview
```

## Deploy en Vercel
1. Subí el repo a GitHub.
2. Importá el proyecto en Vercel.
3. Agregá la variable de entorno `VITE_GEMINI_API_KEY`.
4. Deploy.

## Notas
- El módulo de envío calcula costo en base al CP (4 dígitos), con **gratis para CP 5000 (Córdoba)** y costo por km para el resto del país.
- El auth es **mock con localStorage** (registro, login, “olvidé contraseña” simulado).

## Créditos
- Generación inicial: **Google AI Studio**
- Personalización y mejoras: **Usuario**
- Iteraciones y soporte técnico: **Codex**
