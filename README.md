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

Repo is configured with `base: '/dtp-webapp/'`.

```bash
npm run deploy
```

Or push to `main` / this branch and use the GitHub Action in `.github/workflows/deploy-pages.yml`.

Live site (after Pages is enabled): https://atulkhatri.github.io/dtp-webapp/

## Stack

Vite · React · TypeScript · React Router · plain CSS · Leaflet/OSM · JSON mock data in `/public/data`
