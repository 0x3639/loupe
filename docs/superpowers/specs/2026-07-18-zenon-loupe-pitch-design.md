# "Put Zenon under the Loupe" — pitch landing page (Vue 3 + GitHub Pages)

**Date:** 2026-07-18
**Status:** Approved by user

## Purpose

Recreate the design-handoff prototype (`design_handoff_loupe_pitch/Loupe Pitch.dc.html`) as a production Vue 3 static site and deploy it to GitHub Pages. The page pitches the Loupe team at Spiral on running a security scan of go-zenon. Audience: bitcoin-native engineers. High-fidelity: colors, type, spacing, copy, and both canvas animations follow the handoff exactly.

The handoff README (`design_handoff_loupe_pitch/README.md`) is the canonical design spec — section structure, copy, animation parameters, and design tokens are defined there and in `zenon-brand-kit.md`. This document records only the decisions made on top of it.

## Decisions (user-confirmed)

1. **Deploy target:** GitHub Pages on the existing repo `https://github.com/0x3639/loupe`, deployed via GitHub Actions on push to `main`.
2. **Stack:** Vue 3 + Vite, per the handoff. SFCs with `<script setup>`, CSS custom properties for tokens. No router, no state library.
3. **Footer contact:** replace the `[ add handle / email ]` placeholder with `mailto:portal@zenon.network`.

## Architecture

Repo root = `/Users/dfriestedt/Github/loupe` (this repo). Handoff files stay in `design_handoff_loupe_pitch/` for reference.

- `index.html` — Google Fonts links (Space Grotesk 300–700, JetBrains Mono 400–700), app mount
- `src/App.vue` — page shell importing section components in order
- `src/components/`
  - `SiteNav.vue`
  - `HeroSection.vue` — includes `MatrixRain.vue` (canvas) and the pure-CSS loupe illustration
  - `StatStrip.vue`
  - `WhatZenonIs.vue` — includes `DualLedgerCanvas.vue` and `VerifyPanel.vue`
  - `WhyWeFit.vue` — checklist content as a plain array in the SFC
  - `WhyNow.vue`
  - `AskCommit.vue`
  - `ScopeAside.vue` — rendered when `VITE_SHOW_ASIDE` is not `"false"` (build flag per handoff)
  - `ScanTargets.vue`
  - `ClosingCta.vue`
  - `SiteFooter.vue`
- `src/assets/tokens.css` — brand tokens as CSS custom properties (background, card, border, muted/fg colors, green, link blue, plasma gradient stops, radii, card shadow, 150ms transition curve); ledger-label utility class
- `src/assets/znn-logo.png` — copied from the handoff zip

### Canvas animations

**Amendment (2026-07-18, post-launch, user-requested):** the What-Zenon-is section's card pair breaks out of the 1080px column to a 1440px band (prose stays at 1080/76ch); the dual-ledger canvas uses the extra width. Additionally: the dual-ledger animation deviates from the handoff spec — the momentum chain scrolls in its own frame at a steady 26px/s and seals a momentum every 3s (simulating Zenon's 10s cadence), while each account lane scrolls in its own frame at an independently varying speed (14–44px/s, easing toward a new random target every 2–4s). Account chains fire tx dots at the pending momentum's ghost slot throughout each 3s window; fly-dots are drawn in screen space so they track both differently-moving frames.

Ported from the prototype's script with identical parameters (matrix rain: 16px column pitch, 13px glyphs, katakana+code glyph set, 3.5–9.5 rows/s, 18-glyph trail, ~6% mutation; dual-ledger: v=26px/s camera, 3 account lanes, momentum every 3.6s, height counter from 4,821,304). Each is a component owning its own rAF loop, devicePixelRatio-aware, cancelled in `onUnmounted`. Under `prefers-reduced-motion: reduce`, render one static frame.

## Deltas from the prototype (intentional)

1. Footer contact placeholder → `portal@zenon.network`.
2. Prototype's broken references (`support.js`, `uploads/*.png`) ignored; logo from `assets/znn-logo.png`.
3. **Responsive additions** (handoff is desktop-only): below ~860px, multi-column grids collapse to one column, the stat strip wraps to a 2-per-row grid, the hero illustration (and its rain/halo layers) is hidden, and the H1 steps down to 38px. Pixel-perfect at desktop widths; not-broken on phones.

## Deployment

- GitHub Actions workflow: checkout → node setup → `npm ci` → `vite build` → `actions/upload-pages-artifact` → `actions/deploy-pages`, on push to `main`.
- Vite `base: '/loupe/'` (matched to repo name).
- Site URL: `https://0x3639.github.io/loupe/`.

## Verification

- Dev-server screenshots of every section compared against the handoff spec; both canvases animating; reduced-motion static frame; hover states on CTAs.
- `vite build && vite preview` to confirm the bundle works under the Pages base path.
- After deploy: fetch the live URL, confirm 200 + assets load.
- Handoff TODO: check go-zenon for a `SECURITY.md` and report the finding (no page change unless requested).

## Out of scope

- Custom domain, analytics, SEO/meta beyond a title + description tag, and enumerating secondary scan-target repos (handoff marks optional).
