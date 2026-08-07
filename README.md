# Dialed In CNC Solutions — Website

A high-end, art-directed marketing site for **Dialed In CNC Solutions LLC** (Kevin Steinbrugge, Dayton OH). Built as a fast, dependency-free static site.

## Files / pages
- `index.html` — homepage (7 sections + nav + footer)
- `services.html` — full service capabilities (6 detailed blocks + platform grid)
- `about.html` — brand story, mission/vision, values, who we serve
- `contact.html` — contact details + pre-filled service-request form
- `styles.css` — design system + all styling (shared by every page)
- `main.js` — interactions (reveal on scroll, dial gauge, counters, interactive process, custom cursor, mobile menu, contact form)
- `server.js` — tiny local preview server (Node, no dependencies)

All four pages share the same nav, footer, overlays (grain/cursor/scroll-gauge) and design tokens, so they read as one site.

## Run it locally
```bash
npm run dev
```
(or `node server.js` — same thing, no dependencies to install). Then open **http://localhost:4321**. (Any static host works too — it's just HTML/CSS/JS. Drop these files on Netlify, Vercel, GitHub Pages, or any web host.)

## Deploying to Vercel
This is a **static site with no build step**. `vercel.json` configures it:
- `cleanUrls: true` → pages served at `/services`, `/about`, `/contact` (the `.html` is hidden)
- `trailingSlash: false` → keeps the relative `styles.css` / `main.js` links resolving to the site root (this is what prevents the "HTML loads but CSS doesn't" problem)

In Vercel Project Settings, the framework should be **Other** with **no Build Command** and **no Output Directory** (files are served from the repo root). `server.js` is local-only and is excluded from the deploy via `.vercelignore`. Pushing to `main` triggers an automatic redeploy.

## Design system (from the brand kit)
- **Palette:** Precision Black `#0a0a0b`/`#111113`, Machine Silver `#c0c0c0`, Industrial Gray `#888888`, Clean White `#f5f5f5`, plus one restrained **alarm-signal amber `#ff5a1f`** used sparingly for urgent/interactive states.
- **Type:** Bebas Neue (display), Montserrat (body), Space Mono (technical labels) — loaded from Google Fonts.
- **Concept:** precision-instrument / dial-gauge aesthetic, editorial oversized type, film grain, measurement-motif detailing.

## Sections
1. Cinematic hero with an animated dial-gauge instrument + platform ticker
2. Problem / solution — cost-of-downtime failure modes
3. Services showcase — 6 capabilities in an editorial list
4. Results / proof — animated stats, platform grid, Kevin's pull-quote
5. Interactive process — 4-step diagnostic-to-repair flow (click/auto-advance)
6. Offer — three honest engagement modes (no invented prices)
7. Final CTA — giant click-to-call + email request

## Swapping in the real logo
The nav/hero currently use an on-brand **SVG dial-gauge mark** (built to the brand-kit description) since no logo file was supplied. To use the official logo:
- Replace the `<svg class="brand__mark">…</svg>` in `index.html` with an `<img src="logo.svg" …>` (use the **white/silver** version — the nav sits on a dark background).

## Notes
- Fully responsive (desktop → mobile) with a mobile menu overlay.
- Honors `prefers-reduced-motion` (animations disabled for users who request it).
- Degrades gracefully if JS is disabled (content stays visible).
- The "Request Service" buttons open a pre-filled email to `dialedincnc@gmail.com`; wire these to a form backend if you prefer.
