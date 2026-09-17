# DTP Web App

Mobile-first static SPA for **DTP (Digital Traveller Profile)** — tourist journey concierge matching the app mockups.

## Demo login

- Email: `maya.chen@example.com`
- Password: `travel2026`

Client-side check only (no real auth backend).

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Repo is configured with `base: '/dtp-webapp/'`. The `gh-pages` branch is already published from CI/agent deploys.

```bash
npm run deploy
```

Or push to `main` / this branch and use the GitHub Action in `.github/workflows/deploy-pages.yml`.

**One-time setup (needed for the lasting public URL):** GitHub → repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `/ (root)` → Save.**

Then open: https://atulkhatri.github.io/dtp-webapp/

Until Pages is enabled, you can also run `npm run build && npm run preview` locally, or use a temporary tunnel to the preview port.

## Stack

Vite · React · TypeScript · React Router · plain CSS · Leaflet/OSM · JSON mock data in `/public/data`
