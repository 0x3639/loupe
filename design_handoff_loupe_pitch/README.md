# Handoff: "Put Zenon under the Loupe" — pitch landing page

## Overview
A single-page site pitching Spiral/Block's Loupe team on running Loupe (their AI vulnerability scanner) against go-zenon and other Zenon Network repos. Audience: bitcoin-native engineers, allergic to hype. Tone: engineer-to-engineer, factual, honest. Goal: someone at Spiral says "yes, let's scan it" (or points at the self-serve path).

## About the design files
`Loupe Pitch.dc.html` is a **design reference created in HTML** — a prototype showing the intended look and behavior, NOT production code to copy directly. The task is to **recreate this design as a Vue 3 app** (user's chosen framework), using idiomatic Vue: SFCs, `<script setup>`, scoped styles or CSS custom properties. Vite + Vue 3 recommended; deploy as a static site (no backend needed). Note: the prototype uses a proprietary component format with a small templating runtime — ignore its mechanics (`<x-dc>`, `{{ }}` holes, `sc-for`/`sc-if`, `renderVals`); recreate the rendered result. Consider the canonical Zenon design system source: https://github.com/digitalSloth/zenon-design-system (this design follows its portable brand kit, included as `zenon-brand-kit.md`; the repo also mirrors nom-ui, a shadcn-vue library — useful since the target is Vue).

## Fidelity
**High-fidelity.** Recreate pixel-perfectly: colors, type, spacing, and the two canvas animations are final design intent.

## Page structure (single scroll, max content width 1080px, 32px side padding, near-black canvas)
1. **Nav** — logo (assets/znn-logo.png, 34px circle) + mono uppercase label "zenon → loupe"; right: "go-zenon on GitHub" (muted) + "Talk to us" (green) → Matrix link.
2. **Hero** — 2-col grid (1.2fr/0.8fr, 56px gap). Left: ledger eyebrow "A pitch to the Loupe team at Spiral"; H1 52px/800 "Put Zenon under the Loupe."; subhead 18px muted: "A community-run, open-source, bitcoin-aligned Layer 1 blockchain with no company, no VCs, and no audit budget requests a Loupe security scan before its next major network upgrade."; plasma CTA "Talk to us on Matrix →" (https://matrix.to/#/%23loupe:zenon.chat) + mono caption "#loupe:zenon.chat". Right: magnifying-glass illustration over Go code + **matrix rain canvas** behind it (spec below) + green radial halo, all centered on the lens.
3. **Stat strip** — full-width band (card bg, 1px borders top/bottom), 5 equal columns, mono tabular 30px/700 values with ledger captions: 0 / VC funding · 0 / Corporate entities · 0 / Audit budget, USD · 100% / Go · GPL-3.0 · 2019 / In active development since.
4. **What Zenon is** — eyebrow, H2 30px/700 "A feeless, dual-ledger network, verifiable from a browser.", paragraph (see prototype; includes link on the word "architecture" → https://github.com/TminusZ/zenon-developer-commons). Below: 2 cards (1.5fr/1fr grid, 16px gap):
   - **Dual-ledger canvas animation** (spec below), caption underneath.
   - **Verification-first panel** — "Don't trust. Verify." + 3 steps (01 sync headers / 02 request proof / ✓ verified locally) each pulsing opacity .3→1 on an 8s staggered loop (delays 0 / 2.7s / 5.3s); footer note links to zenon.wtf.
5. **Why we fit Loupe's mission** — green eyebrow, H2 "We check the boxes.", 2-col grid of 6 checklist cards (dark card, lit top edge, green mono ✓ 20px): FOSS community-run · Fair launch · Bitcoin-aligned research · No audit budget · Active since 2019 · We already build with Spiral tools (goose daily; buzz at buzz.zenon.info). Exact copy in prototype.
6. **Why now** — 2 cards: Dynamic Plasma (in implementation) & libp2p (in migration); closing line: fixes ship **in** the next major upgrade, not after it.
7. **Ask / Commit** — 2-col: numbered asks 1-3 (funded scan; self-serve guidance — we'll be the guinea pig on a Go codebase; repo-prep guidance) and 4 commitments (→ bullets).
8. **Honest aside** — dashed-border card, "On scope, honestly" + scope paragraph. (Prototype has a boolean to hide it — expose as a build flag if convenient.)
9. **Scan targets** — primary card zenon-network/go-zenon (mono facts: lang Go 100%, license GPL-3.0, surface: consensus · p2p · embedded VM · wallet · RPC) + "Future scans" card zenon-network/*.
10. **Closing CTA** — H2 "One scan. Confirmed findings, PoC included, fixed in the next upgrade." + outline button "Meet us on Matrix →".
11. **Footer** — 4 link columns (Zenon sites / Research / Loupe / Contact). Contact still has placeholder "[ add handle / email ]" — fill before publishing.

## Canvas animation 1 — matrix rain (hero)
- 700×620 CSS px canvas absolutely centered on the lens center (lens center is offset −31px,−31px from the illustration box center), behind the glass, pointer-events none.
- CSS mask: radial-gradient(ellipse 50% 50% at 50% 50%, black 40%, transparent 82%) so rain never reaches the hero text.
- Columns pitch = 16px (13px JetBrains Mono glyphs + 3). Glyph set: katakana + code chars `アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}()=:;/*+-#$&`.
- Each column: random speed 3.5–9.5 rows/s, trail of 18 glyphs; head hsl(120 86% 70% / .75), tail hsl(145 100% 42%) fading linearly to 0; ~6% of cells mutate glyph per frame. rAF loop, devicePixelRatio-aware, full clear each frame.

## Canvas animation 2 — dual-ledger / momentum (architecture card)
- Full card width × 300px, left-edge CSS mask fade (transparent 0 → black 26px).
- World scrolls left at v = 26 px/s (camera x = t·v − width + 120). Everything spawns at x = t·v.
- 3 account-chain lanes (y 52/108/164, labels z1qx…f8a / z1qp…2mk / z1qz…9rw pinned at left, 9px mono on card-bg chip). Each lane appends a 30×20 rounded (r4) "tx" block every 1.1–2.8s (random per spawn): pop-in scale 1.25→1 over 250ms, green border/text fading to gray over 0.8s; blocks connected by 1px hsl(0 0% 24%) lines.
- On each block spawn, a 3px green dot flies on a quadratic bezier from the block to the **next momentum slot** (dashed ghost rect, 56×32 r5) over 0.9–1.4s; arrived dots pool in a grid cluster above the ghost.
- Every 3.6s the pooled dots become a momentum block at the ghost position (label "N tx", 10px mono): flash = plasma vertical gradient fill (hsl(120 86% 63%)→hsl(145 100% 38%)) fading to card gray over 1s; dark text while flash alpha > .4. Momentum blocks connected by lines; lane label "MOMENTUM CHAIN" pinned left; height counter (mono, starts 4,821,304, +1 per block) bottom-right, format en-US grouping.
- Both animations: render one static frame under prefers-reduced-motion.

## Design tokens (from zenon-brand-kit.md — dark theme is the only theme here)
- Background hsl(0 0% 8%) · card hsl(0 0% 10%) · border hsl(0 0% 20%) · muted-fg hsl(0 0% 65%) · fg hsl(0 0% 98%) · body-ish text hsl(0 0% 80%)
- Green (brand/success) hsl(145 100% 42%) / #00d557 · link blue hsl(214 100% 62%) (hover 72%) · plasma gradient linear-gradient(180deg, hsl(120 86% 63%), hsl(145 100% 38%)) — used ONCE as fill: the primary CTA (hover filter brightness(1.1), active .95)
- Fonts (Google): Space Grotesk (UI, 300-700) + JetBrains Mono (all data/labels, 400-700, always tabular-nums)
- Ledger label utility: mono, 11px (0.6875rem), weight 500, uppercase, letter-spacing .06em, muted color — eyebrows/captions only
- Radii: buttons/blocks 6px & 4-5px, cards 10px. Card shadow (lit top edge): 0 2px 6px -1px hsl(0 0% 0% / .55), inset 0 1px 0 0 hsl(0 0% 100% / .04)
- Transitions 150ms cubic-bezier(.4,0,.2,1). No emoji; ✓ / → are functional mono glyphs.

## Assets
- assets/znn-logo.png — ZNN mark (user-provided).
- All other visuals are CSS/canvas (loupe illustration is pure CSS: 220px circle, 11px hsl(0 0% 36%) rim, radial glass bg, highlight ellipse, rounded-rect handle+collar rotated 45° at bottom-right).

## Files
- Loupe Pitch.dc.html — the full design reference (view in a browser)
- zenon-brand-kit.md — distilled Zenon brand rules
- assets/znn-logo.png

## Pre-publish TODOs (from the client)
- Add real contact handle/email in footer.
- Confirm go-zenon has a SECURITY.md.
- Optionally enumerate specific secondary scan-target repos.
