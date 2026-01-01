# IAM Portal (Simple React Dashboard)

A minimal Vite + React project with a single dashboard page inspired by the provided mock UI.

## Run

- `cd frontend`
- Install: `npm.cmd install`
- Dev server: `npm.cmd run dev`
- Build: `npm.cmd run build`
- Preview build: `npm.cmd run preview`

## Backend (FastAPI)

- Start the API (from repo root): `\backend\run_backend.cmd`
- Health check: `http://127.0.0.1:8000/health`
- Search API: `http://127.0.0.1:8000/api/identity?query=<name-or-displayName>`

> If PowerShell blocks `npm` with an execution policy error, use `npm.cmd` (as shown above) or run:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force`

## Project layout

- `src/pages/DashboardPage/` – the single dashboard page (calls the backend API for real data)
- `src/components/*/` – each UI component lives in its own folder (JSX + CSS module)
- `src/styles/global.css` – global styles
- `../backend/` – Python backend (FastAPI lives here)

Note: JSON files like `package.json` / `package-lock.json` cannot contain comments.
