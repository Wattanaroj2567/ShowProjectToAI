# Fiction Book Review – Client (Vite + React + MUI)

## Quick Start

- Copy env: `cp .env.example .env` (adjust `VITE_API_BASE` if needed)
- Install deps: `npm install`
- Run dev: `npm run dev`

Default dev URL: `http://localhost:5173`
API base (dev): `http://localhost:8080/api`

## Scripts
- `dev` – Start Vite dev server
- `build` – Production build
- `preview` – Preview built app

## Structure
```
src/
  components/
  contexts/
  lib/
  pages/
  theme.js
  App.jsx
  main.jsx
```

This client targets the existing server routes under `/api` and uses JWT-based auth.

