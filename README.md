# Nobel Solutions — Contractor Dispatch (MVP)

Plataforma de despacho y coordinación de subcontratistas para instalación de muebles de oficina en Austin, TX. MVP de previsualización navegable construido para Luis Larez / Nobel Solutions.

Tres interfaces:

- **Panel Admin (Luis)** — dashboard, panel de despacho, subcontratistas, reportes y pagos
- **Panel Empresa** — dashboard cliente, nueva orden, historial
- **Panel Subcontratista** — mi día, órdenes, check-in/out mobile-first

## Stack

Vite + React 19 + TypeScript · Tailwind v3 + shadcn/ui · Recharts · Framer Motion · Lucide.

## Scripts

```bash
npm install   # instalar dependencias
npm run dev   # dev server en http://localhost:5173
npm run build # compila a ./dist
```

## Credenciales demo

`luis` / `Nobel2026`

## Deploy en Render

El archivo `render.yaml` deja la app lista como **Static Site** en Render:

1. Conectá el repo de GitHub en Render → New + → Blueprint
2. Render detecta `render.yaml` y crea el sitio automáticamente
3. Build: `npm install && npm run build` · Publish: `dist/`

Alternativa manual: New + → Static Site → Build Command `npm install && npm run build`, Publish Directory `dist`, Add Rewrite Rule `/*` → `/index.html`.
