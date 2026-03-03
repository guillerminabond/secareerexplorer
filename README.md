# HBS SE Career Explorer

Social Enterprise Career Explorer (secareerexplorer.vercel.app) — discover impact organizations and opportunities.

## Running locally

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`

## Environment variables

Set these in your environment (e.g. Vercel project → Settings → Environment Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`

Do not commit `.env`; use `.env.example` as a template.

## Deploy (Vercel)

The app is a single-page app (SPA). `vercel.json` rewrites all routes to `index.html` so client-side routing works for `/explore`, `/all-orgs`, `/all-orgs/nominate`, etc.
