# Judgment notes (please check)

These were filled in where the plan or resources left room for interpretation:

1. **Login mockup typo** — PPTX shows “User Your Email”; plan specifies placeholders **Enter your email** / **Enter your password**. Used the plan wording.
2. **Questionnaire hero** — Deck uses a 3×3 travel icon collage on teal; shipped an Unsplash travel hero with the same overlay copy for a similar feel without extracting every PPTX bitmap.
3. **Tab icons** — Mockups use custom glyphs; used simple emoji icons for Borders / Stays / On the Way / Explore / Profile to stay dependency-light. Easy to swap for SVGs later.
4. **Stay dates** — Plan lists `Thu 7/4 → Fri 8/4` with ISO `2026-04-07` / `2026-04-08` (day/month style as in mockups, year 2026).
5. **Borders COVID copy** — Refreshed Testing/Quarantine section to note measures are largely lifted while urging users to verify official sources.
6. **Leaflet marker icons** — Default Leaflet pin assets may need the usual Vite path fix in some environments; if pins look broken, check console and we can point icon URLs to CDN.
7. **GitHub Pages base path** — Set to `/dtp-webapp/` to match the GitHub repo name (not `/DTP/`).
8. **Business role** — Selecting Business after login/signup routes to a Coming soon screen with **Continue as Tourist**.
9. **Favorites seed** — `my-places.json` seeds favorites only when localStorage favorites are empty (first visit after login flows that open My Places).
10. **Copyright year** — Footer uses 2026 (mockup said 2022); content.json also uses 2026.
