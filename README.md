<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1mXjY540MwXhRh9ZyxCj6ewW8cKs3q_Xf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

2. Create an env file for the backend:
   - Duplicate `.env.example` as `.env.local` (recommended) and set `GEMINI_API_KEY`.
   - `.env.local` ya está ignorado por git via `*.local`.

3. Start the backend (keeps your API key off the frontend):
   `npm run dev:server`

4. Start the frontend:
   `npm run dev`

5. Verify:
   - Frontend: `http://localhost:3000`
   - Healthcheck: `http://localhost:8787/api/health`

## Changing images

The project includes placeholders under `public/images/`. Replace them with your own files (same names) or update `assets.ts`:

- `public/images/hero.svg`
- `public/images/workshop.svg`
- `public/images/product.svg` (fallback for products)
