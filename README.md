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

This repo is published as a **project site** with Vite `base: '/dtp-webapp/'`. Hosting uses the **`gh-pages` branch** (not the GitHub Actions `github-pages` environment).

### One-time Pages settings

In the GitHub UI:

1. Open **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Set **Branch** to `gh-pages` and folder to **`/(root)`**
4. Save

Live URL: https://atulkhatri.github.io/dtp-webapp/

### Publish a new build

```bash
npm run deploy
```

That builds `dist`, then force-publishes a clean `gh-pages` branch containing only the built app (including `.nojekyll`).

### Optional: GitHub Actions later

There is **no** Actions workflow that deploys to the protected `github-pages` environment. Branch-based `gh-pages` hosting is the default.

If you later prefer **Settings → Pages → Source: GitHub Actions**, you must also allow the deploying branch under **Settings → Environments → github-pages → Deployment branches** (for example allow `main`). Without that, Actions deploys fail with environment protection errors.

## Stack

Vite · React · TypeScript · React Router · Mantine · Leaflet/OSM · JSON mock data in `/public/data`
