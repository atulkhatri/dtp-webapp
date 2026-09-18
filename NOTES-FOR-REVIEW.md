# Judgment notes (please check)

These were filled in where the plan or resources left room for interpretation:

1. **Login credentials** — Demo email/password are **prefilled** on the login form so you only need to tap Log In.
2. **Borders tab (updated per feedback)** — No longer Canada immigration link groups / webview-style content. Borders is a vertical list of full-width image cards: Terminal Maps; Custom and Immigration; Shop, Dine and Services; Parking. Tap opens an in-app detail page (not an external webview).
3. **UI framework** — Migrated from plain CSS to **Mantine** (`@mantine/core` + notifications) with a DTP periwinkle theme for a more professional mobile UI.
4. **Questionnaire hero** — Local travel hero (`public/images/questionnaire-hero.jpg`) with overlay copy from the mockups. All former Unsplash hotlinks are bundled under `public/images/` and resolved via `assetUrl()` / Vite `BASE_URL` so GitHub Pages does not depend on Unsplash.
5. **Stay dates** — `Thu 7/4 → Fri 8/4` with year 2026 in ISO defaults.
6. **GitHub Pages base path** — `/dtp-webapp/` to match the repo name.
7. **Copyright year** — Footer uses 2026.
