# "Put Zenon under the Loupe" Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the design-handoff prototype as a Vue 3 + Vite static site and deploy it to GitHub Pages at `https://0x3639.github.io/loupe/`.

**Architecture:** Single-scroll SPA, no router/state library. One SFC per page section, assembled in `App.vue`. Brand tokens live in `src/assets/tokens.css` as CSS custom properties plus a few global utility classes (`.ledger-label`, `.card`, `.section`, `.h2`). The two canvas animations are self-contained components owning their own rAF loops. Deployed by GitHub Actions on push to `main`.

**Tech Stack:** Vue 3, Vite, Vitest + @vue/test-utils + jsdom for tests, GitHub Actions → GitHub Pages.

## Global Constraints

- Design source of truth: `design_handoff_loupe_pitch/README.md` and `design_handoff_loupe_pitch/Loupe Pitch.dc.html`. Copy text **verbatim** from the code blocks in this plan (they were transcribed from the prototype).
- Spec: `docs/superpowers/specs/2026-07-18-zenon-loupe-pitch-design.md`.
- Vite `base: '/loupe/'` (repo is `0x3639/loupe`).
- Fonts via Google Fonts `<link>`: Space Grotesk 300–700 (UI), JetBrains Mono 400–700 (all data/labels, always `tabular-nums` for numbers).
- Colors only from the token set (see Task 1). The plasma gradient is used exactly once as a fill: the primary hero CTA.
- No emoji anywhere. `✓` and `→` are functional mono glyphs.
- Transitions: `150ms cubic-bezier(.4,0,.2,1)`.
- Both canvas animations must render one static frame under `prefers-reduced-motion: reduce`, be devicePixelRatio-aware, and cancel their rAF on unmount. Guard `getContext('2d')` returning null (jsdom) with an early return.
- Footer contact: `portal@zenon.network` (replaces the prototype's `[ add handle / email ]` placeholder).
- Responsive addition (not in handoff): at `max-width: 860px` multi-column grids collapse to one column, stat strip becomes 2-per-row, hero illustration/rain/halo hidden, H1 38px, footer 2 columns.
- Git: commit after every task; GPG signing is already disabled repo-locally (session has no pinentry).
- All commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Project scaffold, tokens, test harness

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue` (temporary shell — replaced in Task 9), `src/assets/tokens.css`, `tests/app.test.js`
- Create: `public/znn-logo.png` (copied from `design_handoff_loupe_pitch/assets/znn-logo.png`)

**Interfaces:**
- Produces: global CSS custom properties (`--bg`, `--card`, `--border`, `--muted`, `--fg`, `--body-text`, `--green`, `--link`, `--link-hover`, `--plasma`, `--radius-card`, `--radius-btn`, `--shadow-card`, `--ease`, `--mono`) and global classes `.ledger-label`, `.card`, `.section`, `.h2`, plus keyframes `zn-step`. Every later task consumes these. Logo served at `import.meta.env.BASE_URL + 'znn-logo.png'`.

- [ ] **Step 1: Create the project files**

`package.json`:

```json
{
  "name": "zenon-loupe-pitch",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^25.0.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/loupe/',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
  },
})
```

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Put Zenon under the Loupe</title>
    <meta name="description" content="A community-run, open-source, bitcoin-aligned Layer 1 blockchain requests a Loupe security scan of go-zenon before its next major network upgrade." />
    <link rel="icon" type="image/png" href="%BASE_URL%znn-logo.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

`src/main.js`:

```js
import { createApp } from 'vue'
import './assets/tokens.css'
import App from './App.vue'

createApp(App).mount('#app')
```

`src/App.vue` (temporary — replaced in Task 9):

```vue
<script setup></script>

<template>
  <div class="page"></div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }
</style>
```

`src/assets/tokens.css`:

```css
:root {
  --bg: hsl(0 0% 8%);
  --card: hsl(0 0% 10%);
  --border: hsl(0 0% 20%);
  --muted: hsl(0 0% 65%);
  --fg: hsl(0 0% 98%);
  --body-text: hsl(0 0% 80%);
  --green: hsl(145 100% 42%);
  --link: hsl(214 100% 62%);
  --link-hover: hsl(214 100% 72%);
  --plasma: linear-gradient(180deg, hsl(120 86% 63%) 0%, hsl(145 100% 38%) 100%);
  --radius-card: 10px;
  --radius-btn: 6px;
  --shadow-card: 0 2px 6px -1px hsl(0 0% 0% / .55), inset 0 1px 0 0 hsl(0 0% 100% / .04);
  --ease: cubic-bezier(.4, 0, .2, 1);
  --mono: "JetBrains Mono", ui-monospace, monospace;
}
body { margin: 0; background: var(--bg); color: var(--fg); font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
a { color: var(--link); text-decoration: none; }
a:hover { color: var(--link-hover); text-decoration: underline; }
.ledger-label { font-family: var(--mono); font-size: .6875rem; line-height: 1rem; font-weight: 500; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.section { max-width: 1080px; margin: 0 auto; padding: 72px 32px 0; }
.h2 { font-size: 30px; font-weight: 700; margin: 0 0 16px; }
@keyframes zn-step { 0%, 100% { opacity: .3; } 12%, 80% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

Copy the logo:

```bash
cp design_handoff_loupe_pitch/assets/znn-logo.png public/znn-logo.png
```

- [ ] **Step 2: Write the failing test**

`tests/app.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('App', () => {
  it('mounts the page shell', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.page').exists()).toBe(true)
  })
})
```

- [ ] **Step 3: Install and run the test**

Run: `npm install && npm test`
Expected: PASS (1 test). If `npm install` fails on a version, relax the failing caret range to the latest available major.

- [ ] **Step 4: Verify build works**

Run: `npm run build`
Expected: `dist/` produced without errors; `dist/index.html` references `/loupe/` asset paths.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src public tests
git commit -m "feat: scaffold Vite + Vue 3 project with brand tokens"
```

---

### Task 2: SiteNav and SiteFooter

**Files:**
- Create: `src/components/SiteNav.vue`, `src/components/SiteFooter.vue`
- Test: `tests/chrome.test.js`

**Interfaces:**
- Consumes: global classes/tokens from Task 1; logo at `import.meta.env.BASE_URL + 'znn-logo.png'`.
- Produces: default-export SFCs `SiteNav` and `SiteFooter`, no props.

- [ ] **Step 1: Write the failing test**

`tests/chrome.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteNav from '../src/components/SiteNav.vue'
import SiteFooter from '../src/components/SiteFooter.vue'

describe('SiteNav', () => {
  it('shows the brand label and both nav links', () => {
    const wrapper = mount(SiteNav)
    expect(wrapper.text()).toContain('zenon → loupe')
    expect(wrapper.get('a[href="https://github.com/zenon-network/go-zenon"]').text()).toBe('go-zenon on GitHub')
    expect(wrapper.get('a[href="https://matrix.to/#/%23loupe:zenon.chat"]').text()).toBe('Talk to us')
  })
})

describe('SiteFooter', () => {
  it('shows all four link columns with the real contact email', () => {
    const wrapper = mount(SiteFooter)
    for (const label of ['Zenon', 'Research', 'Loupe', 'Contact']) {
      expect(wrapper.text()).toContain(label)
    }
    expect(wrapper.get('a[href="mailto:portal@zenon.network"]').text()).toBe('portal@zenon.network')
    expect(wrapper.text()).not.toContain('add handle')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/SiteNav.vue`.

- [ ] **Step 3: Implement the components**

`src/components/SiteNav.vue`:

```vue
<script setup>
const logoUrl = import.meta.env.BASE_URL + 'znn-logo.png'
</script>

<template>
  <nav class="nav">
    <div class="brand">
      <img :src="logoUrl" alt="ZNN" class="logo" />
      <span class="ledger-label">zenon → loupe</span>
    </div>
    <div class="links">
      <a href="https://github.com/zenon-network/go-zenon" class="muted-link">go-zenon on GitHub</a>
      <a href="https://matrix.to/#/%23loupe:zenon.chat" class="green-link">Talk to us</a>
    </div>
  </nav>
</template>

<style scoped>
.nav { display: flex; align-items: center; justify-content: space-between; max-width: 1080px; margin: 0 auto; padding: 22px 32px; }
.brand { display: flex; align-items: center; gap: 10px; }
.logo { width: 34px; height: 34px; border-radius: 50%; display: block; }
.links { display: flex; align-items: center; gap: 22px; font-size: 14px; }
.muted-link { color: var(--muted); }
.green-link { color: var(--green); }
</style>
```

`src/components/SiteFooter.vue`:

```vue
<script setup></script>

<template>
  <footer class="footer">
    <div class="inner">
      <div class="col">
        <span class="ledger-label">Zenon</span>
        <a href="https://zenon.network">zenon.network</a>
        <a href="https://zenon.wtf/">zenon.wtf</a>
        <a href="https://zenon.org">zenon.org</a>
        <a href="https://zenonhub.io">zenonhub.io</a>
      </div>
      <div class="col">
        <span class="ledger-label">Research</span>
        <a href="https://github.com/TminusZ/zenon-developer-commons">zenon-developer-commons</a>
        <a href="https://github.com/zenon-network">zenon-network org</a>
      </div>
      <div class="col">
        <span class="ledger-label">Loupe</span>
        <a href="https://github.com/project-loupe/loupe">project-loupe/loupe</a>
        <a href="https://spiralxyz.substack.com/p/meet-loupe-ai-powered-vulnerability">Launch post</a>
        <a href="https://www.youtube.com/watch?v=WisO6hoeUb8">Intro video</a>
        <a href="https://x.com/ProjectLoupe">@ProjectLoupe</a>
      </div>
      <div class="col">
        <span class="ledger-label">Contact</span>
        <a href="https://matrix.to/#/%23loupe:zenon.chat" class="mono-sm">#loupe:zenon.chat</a>
        <a href="mailto:portal@zenon.network" class="mono-sm">portal@zenon.network</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--border); }
.inner { max-width: 1080px; margin: 0 auto; padding: 44px 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; font-size: 14px; }
.col { display: flex; flex-direction: column; gap: 9px; }
.mono-sm { font-family: var(--mono); font-size: 12.5px; }
@media (max-width: 860px) { .inner { grid-template-columns: repeat(2, 1fr); } }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.vue src/components/SiteFooter.vue tests/chrome.test.js
git commit -m "feat: add nav and footer with real contact email"
```

---

### Task 3: MatrixRain canvas and HeroSection

**Files:**
- Create: `src/components/MatrixRain.vue`, `src/components/HeroSection.vue`
- Test: `tests/hero.test.js`

**Interfaces:**
- Consumes: tokens/utilities from Task 1.
- Produces: `MatrixRain` (canvas filling its parent, no props) and `HeroSection` (no props).

- [ ] **Step 1: Write the failing test**

`tests/hero.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MatrixRain from '../src/components/MatrixRain.vue'
import HeroSection from '../src/components/HeroSection.vue'

describe('MatrixRain', () => {
  it('renders a canvas and survives mount/unmount without a 2d context', () => {
    const wrapper = mount(MatrixRain)
    expect(wrapper.find('canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('HeroSection', () => {
  it('renders headline, subhead, and plasma CTA to Matrix', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain('Put Zenon under the Loupe.')
    expect(wrapper.text()).toContain('A pitch to the Loupe team at Spiral')
    expect(wrapper.text()).toContain('no company, no VCs, and no audit budget')
    const cta = wrapper.get('a.cta')
    expect(cta.attributes('href')).toBe('https://matrix.to/#/%23loupe:zenon.chat')
    expect(cta.text()).toBe('Talk to us on Matrix →')
    expect(wrapper.text()).toContain('#loupe:zenon.chat')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/MatrixRain.vue`.

- [ ] **Step 3: Implement MatrixRain**

`src/components/MatrixRain.vue` (a straight port of the prototype's `startRain`, same parameters):

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}()=:;/*+-#$&'
  const FS = 13
  const TRAIL = 18
  let cols = []
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const setup = (w, h) => {
    const n = Math.ceil(w / (FS + 3))
    cols = Array.from({ length: n }, (_, i) => ({
      x: i * (FS + 3) + 2,
      y: Math.random() * h / FS,
      sp: 3.5 + Math.random() * 6,
      chars: Array.from({ length: Math.ceil(h / FS) + TRAIL }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
    }))
  }
  let last = performance.now()
  const frame = (nowMs) => {
    const dt = Math.min(0.1, (nowMs - last) / 1000)
    last = nowMs
    const dpr = window.devicePixelRatio || 1
    const w = cv.clientWidth || 300
    const h = cv.clientHeight || 300
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    if (cols.length === 0 || cols.length !== Math.ceil(w / (FS + 3))) setup(w, h)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.font = `${FS}px "JetBrains Mono", monospace`
    ctx.textBaseline = 'top'
    const rows = Math.ceil(h / FS)
    cols.forEach((c) => {
      c.y += c.sp * dt * (reduced ? 0 : 1)
      if (Math.random() < 0.06) c.chars[Math.floor(Math.random() * c.chars.length)] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      const head = Math.floor(c.y % (rows + TRAIL))
      for (let k = 0; k < TRAIL; k++) {
        const r = head - k
        if (r < 0 || r >= rows) continue
        const a = k === 0 ? 0.75 : 0.55 * (1 - k / TRAIL)
        ctx.fillStyle = k === 0 ? `hsl(120 86% 70% / ${a})` : `hsl(145 100% 42% / ${a})`
        ctx.fillText(c.chars[(r + Math.floor(c.y / rows)) % c.chars.length], c.x, r * FS)
      }
    })
    if (!reduced) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="rain" aria-hidden="true"></canvas>
</template>

<style scoped>
.rain { width: 100%; height: 100%; display: block; }
</style>
```

- [ ] **Step 4: Implement HeroSection**

`src/components/HeroSection.vue`:

```vue
<script setup>
import MatrixRain from './MatrixRain.vue'
</script>

<template>
  <header class="hero">
    <div>
      <p class="ledger-label eyebrow">A pitch to the Loupe team at Spiral</p>
      <h1 class="title">Put Zenon under the Loupe.</h1>
      <p class="subhead">A community-run, open-source, bitcoin-aligned Layer 1 blockchain with no company, no VCs, and no audit budget requests a Loupe security scan before its next major network upgrade.</p>
      <div class="cta-row">
        <a href="https://matrix.to/#/%23loupe:zenon.chat" class="cta">Talk to us on Matrix →</a>
        <span class="cta-caption">#loupe:zenon.chat</span>
      </div>
    </div>
    <div class="illo-wrap">
      <div class="rain-layer"><MatrixRain /></div>
      <div class="halo"></div>
      <div class="loupe">
        <div class="handle"></div>
        <div class="collar"></div>
        <div class="glass">
          <div class="highlight"></div>
          <pre class="code">func (m *Momentum) Verify(
  ctx ChainContext,
) error {
  <span class="code-comment">// what does Loupe see?</span>
  proof := m.SPVProof()
  …</pre>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero { max-width: 1080px; margin: 0 auto; padding: 64px 32px 56px; display: grid; grid-template-columns: 1.2fr .8fr; gap: 56px; align-items: center; }
.eyebrow { margin: 0 0 14px; }
.title { font-size: 52px; font-weight: 800; line-height: 1.08; margin: 0 0 18px; text-wrap: balance; }
.subhead { font-size: 18px; line-height: 1.6; color: var(--muted); margin: 0 0 28px; max-width: 52ch; }
.cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.cta { display: inline-block; background-image: var(--plasma); color: hsl(0 0% 8%); font-weight: 600; font-size: 16px; padding: 12px 22px; border-radius: var(--radius-btn); transition: filter 150ms var(--ease); }
.cta:hover { filter: brightness(1.1); text-decoration: none; color: hsl(0 0% 8%); }
.cta:active { filter: brightness(.95); }
.cta-caption { font-family: var(--mono); font-size: 12.5px; color: var(--muted); }
.illo-wrap { display: flex; justify-content: center; position: relative; }
.rain-layer { position: absolute; left: 50%; top: 50%; width: 700px; height: 620px; transform: translate(calc(-50% - 31px), calc(-50% - 31px)); -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 40%, transparent 82%); mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 40%, transparent 82%); pointer-events: none; }
.halo { position: absolute; left: 50%; top: 50%; width: 560px; height: 560px; transform: translate(calc(-50% - 31px), calc(-50% - 31px)); background: radial-gradient(circle at 50% 50%, hsl(145 100% 38% / .25) 0%, transparent 60%); pointer-events: none; }
.loupe { position: relative; width: 320px; height: 320px; }
.handle { position: absolute; top: 196px; left: 196px; width: 112px; height: 26px; background: linear-gradient(180deg, hsl(0 0% 42%), hsl(0 0% 24%)); border-radius: 13px; transform: rotate(45deg); transform-origin: left center; box-shadow: 0 6px 14px hsl(0 0% 0% / .5); }
.collar { position: absolute; top: 186px; left: 186px; width: 34px; height: 38px; background: linear-gradient(180deg, hsl(0 0% 48%), hsl(0 0% 26%)); border-radius: 8px; transform: rotate(45deg); transform-origin: center; box-shadow: 0 4px 10px hsl(0 0% 0% / .45); }
.glass { position: absolute; top: 8px; left: 8px; width: 220px; height: 220px; border-radius: 50%; border: 11px solid hsl(0 0% 36%); box-shadow: 0 18px 40px -8px hsl(0 0% 0% / .7), 0 0 0 2px hsl(0 0% 16%), inset 0 0 0 2px hsl(0 0% 18%), inset 0 2px 1px hsl(0 0% 100% / .28); background: radial-gradient(circle at 34% 28%, hsl(0 0% 15%), hsl(0 0% 9%) 65%); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.highlight { position: absolute; top: 12px; left: 26px; width: 110px; height: 52px; border-radius: 50%; background: linear-gradient(160deg, hsl(0 0% 100% / .12), transparent 70%); transform: rotate(-24deg); pointer-events: none; }
.code { margin: 0; font-family: var(--mono); font-size: 11.5px; line-height: 1.85; color: hsl(0 0% 55%); }
.code-comment { color: var(--green); }
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; padding: 48px 32px 40px; }
  .title { font-size: 38px; }
  .illo-wrap { display: none; }
}
</style>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/MatrixRain.vue src/components/HeroSection.vue tests/hero.test.js
git commit -m "feat: add hero with matrix rain canvas and CSS loupe illustration"
```

---

### Task 4: StatStrip

**Files:**
- Create: `src/components/StatStrip.vue`
- Test: `tests/stats.test.js`

**Interfaces:**
- Consumes: `.ledger-label` global class, tokens.
- Produces: `StatStrip` SFC, no props.

- [ ] **Step 1: Write the failing test**

`tests/stats.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatStrip from '../src/components/StatStrip.vue'

describe('StatStrip', () => {
  it('renders all five stats with values and captions', () => {
    const wrapper = mount(StatStrip)
    const values = wrapper.findAll('.value').map((n) => n.text())
    expect(values).toEqual(['0', '0', '0', '100%', '2019'])
    for (const caption of ['VC funding', 'Corporate entities', 'Audit budget, USD', 'Go · GPL-3.0', 'In active development since']) {
      expect(wrapper.text()).toContain(caption)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/StatStrip.vue`.

- [ ] **Step 3: Implement**

`src/components/StatStrip.vue`:

```vue
<script setup>
const stats = [
  { value: '0', label: 'VC funding' },
  { value: '0', label: 'Corporate entities' },
  { value: '0', label: 'Audit budget, USD' },
  { value: '100%', label: 'Go · GPL-3.0' },
  { value: '2019', label: 'In active development since' },
]
</script>

<template>
  <div class="strip">
    <div class="inner">
      <div v-for="s in stats" :key="s.label">
        <div class="value">{{ s.value }}</div>
        <div class="ledger-label">{{ s.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.strip { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--card); }
.inner { max-width: 1080px; margin: 0 auto; padding: 26px 32px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
.value { font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 30px; font-weight: 700; }
@media (max-width: 860px) { .inner { grid-template-columns: repeat(2, 1fr); } }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatStrip.vue tests/stats.test.js
git commit -m "feat: add stat strip"
```

---

### Task 5: DualLedgerCanvas, VerifyPanel, WhatZenonIs

**Files:**
- Create: `src/components/DualLedgerCanvas.vue`, `src/components/VerifyPanel.vue`, `src/components/WhatZenonIs.vue`
- Test: `tests/what-zenon-is.test.js`

**Interfaces:**
- Consumes: `.card`, `.section`, `.h2`, `.ledger-label`, `zn-step` keyframes from Task 1.
- Produces: `DualLedgerCanvas` (full-width × 300px canvas, no props), `VerifyPanel` (no props), `WhatZenonIs` (section wrapper, no props).

- [ ] **Step 1: Write the failing test**

`tests/what-zenon-is.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DualLedgerCanvas from '../src/components/DualLedgerCanvas.vue'
import VerifyPanel from '../src/components/VerifyPanel.vue'
import WhatZenonIs from '../src/components/WhatZenonIs.vue'

describe('DualLedgerCanvas', () => {
  it('renders a canvas and survives mount/unmount without a 2d context', () => {
    const wrapper = mount(DualLedgerCanvas)
    expect(wrapper.find('canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('VerifyPanel', () => {
  it('renders the three verification steps and zenon.wtf link', () => {
    const wrapper = mount(VerifyPanel)
    expect(wrapper.text()).toContain("Don't trust. Verify.")
    expect(wrapper.text()).toContain('sync headers')
    expect(wrapper.text()).toContain('request proof')
    expect(wrapper.text()).toContain('verified locally')
    expect(wrapper.find('a[href="https://zenon.wtf"]').exists()).toBe(true)
  })
})

describe('WhatZenonIs', () => {
  it('renders the section heading, architecture link, and both cards', () => {
    const wrapper = mount(WhatZenonIs)
    expect(wrapper.text()).toContain('A feeless, dual-ledger network, verifiable from a browser.')
    expect(wrapper.get('a[href="https://github.com/TminusZ/zenon-developer-commons"]').text()).toBe('architecture')
    expect(wrapper.text()).toContain('Dual ledger · asynchronous account chains')
    expect(wrapper.text()).toContain('Both ledgers grow together.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/DualLedgerCanvas.vue`.

- [ ] **Step 3: Implement DualLedgerCanvas**

`src/components/DualLedgerCanvas.vue` (a straight port of the prototype's `startArch`, same parameters):

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const V = 26
  const H = 300
  const MOMY = 240
  const MOMIV = 3.6
  const LANES = [
    { y: 52, label: 'z1qx…f8a' },
    { y: 108, label: 'z1qp…2mk' },
    { y: 164, label: 'z1qz…9rw' },
  ]
  const now = () => performance.now() / 1000
  const t0 = now()
  const st = {
    lanes: LANES.map((l) => ({ y: l.y, label: l.label, blocks: [], nextT: 0 })),
    moms: [],
    flies: [],
    pend: [],
    nextMomT: t0 + 1.6,
    height: 4821304,
  }
  st.lanes.forEach((l) => {
    let t = t0 - 60
    while (t < t0) {
      l.blocks.push({ x: t * V, born: t0 - 10 })
      t += 1.1 + Math.random() * 1.7
    }
    l.nextT = t
  })
  for (let t = t0 - 60; t < t0 - 2; t += MOMIV) {
    st.moms.push({ x: t * V, born: t0 - 10, count: 3 + Math.floor(Math.random() * 6) })
    st.height++
  }
  const rr = (x, y, w, h, r) => {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
  }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const frame = () => {
    const t = now()
    const dpr = window.devicePixelRatio || 1
    const w = cv.clientWidth || 600
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, H)
    const cam = t * V - w + 120
    st.lanes.forEach((l) => {
      if (t >= l.nextT) {
        l.blocks.push({ x: t * V, born: t })
        st.flies.push({ x0: t * V, y0: l.y, x1: st.nextMomT * V, born: t, dur: 0.9 + Math.random() * 0.5 })
        l.nextT = t + 1.1 + Math.random() * 1.7
        if (l.blocks.length > 60) l.blocks.shift()
      }
    })
    st.flies = st.flies.filter((f) => {
      if (t - f.born >= f.dur) {
        st.pend.push(f)
        return false
      }
      return true
    })
    if (t >= st.nextMomT) {
      st.height++
      st.moms.push({ x: st.nextMomT * V, born: t, count: st.pend.length || 1 })
      st.pend = []
      st.nextMomT += MOMIV
      if (st.moms.length > 40) st.moms.shift()
    }
    ctx.save()
    ctx.translate(-cam, 0)
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    st.lanes.forEach((l) => {
      ctx.strokeStyle = 'hsl(0 0% 24%)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 1; i < l.blocks.length; i++) {
        ctx.moveTo(l.blocks[i - 1].x + 15, l.y)
        ctx.lineTo(l.blocks[i].x - 15, l.y)
      }
      ctx.stroke()
      l.blocks.forEach((b) => {
        const a = Math.max(0, 1 - (t - b.born) / 0.8)
        const pop = 1 + 0.25 * Math.max(0, 1 - (t - b.born) / 0.25)
        rr(b.x - 15 * pop, l.y - 10 * pop, 30 * pop, 20 * pop, 4)
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        ctx.strokeStyle = a > 0 ? `hsl(145 100% 42% / ${0.3 + 0.7 * a})` : 'hsl(0 0% 26%)'
        ctx.stroke()
        ctx.fillStyle = a > 0 ? 'hsl(145 100% 52%)' : 'hsl(0 0% 48%)'
        ctx.fillText('tx', b.x, l.y + 0.5)
      })
    })
    ctx.strokeStyle = 'hsl(0 0% 28%)'
    ctx.beginPath()
    for (let i = 1; i < st.moms.length; i++) {
      ctx.moveTo(st.moms[i - 1].x + 28, MOMY)
      ctx.lineTo(st.moms[i].x - 28, MOMY)
    }
    ctx.stroke()
    st.moms.forEach((b) => {
      const a = Math.max(0, 1 - (t - b.born) / 1.0)
      rr(b.x - 28, MOMY - 16, 56, 32, 5)
      if (a > 0) {
        const g = ctx.createLinearGradient(0, MOMY - 16, 0, MOMY + 16)
        g.addColorStop(0, `hsl(120 86% 63% / ${0.15 + 0.85 * a})`)
        g.addColorStop(1, `hsl(145 100% 38% / ${0.15 + 0.85 * a})`)
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        rr(b.x - 28, MOMY - 16, 56, 32, 5)
        ctx.fillStyle = g
        ctx.fill()
        ctx.fillStyle = a > 0.4 ? 'hsl(0 0% 8%)' : 'hsl(0 0% 65%)'
      } else {
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        ctx.fillStyle = 'hsl(0 0% 55%)'
      }
      ctx.strokeStyle = a > 0 ? `hsl(145 100% 42% / ${0.4 + 0.6 * a})` : 'hsl(0 0% 30%)'
      ctx.stroke()
      ctx.fillText(b.count + ' tx', b.x, MOMY + 0.5)
    })
    const gx = st.nextMomT * V
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'hsl(0 0% 32%)'
    rr(gx - 28, MOMY - 16, 56, 32, 5)
    ctx.stroke()
    ctx.setLineDash([])
    st.pend.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(gx - 16 + (i % 5) * 8, MOMY - 30 - Math.floor(i / 5) * 9, 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 42%)'
      ctx.fill()
    })
    st.flies.forEach((f) => {
      const p = Math.min(1, (t - f.born) / f.dur)
      const e = p * p * (3 - 2 * p)
      const y1 = MOMY - 30
      const mx = (f.x0 + f.x1) / 2 + 26
      const my = (f.y0 + y1) / 2
      const x = (1 - e) * (1 - e) * f.x0 + 2 * (1 - e) * e * mx + e * e * f.x1
      const y = (1 - e) * (1 - e) * f.y0 + 2 * (1 - e) * e * my + e * e * y1
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 50% / .95)'
      ctx.fill()
    })
    ctx.restore()
    ctx.textAlign = 'left'
    ctx.font = '9px "JetBrains Mono", monospace'
    st.lanes.forEach((l) => {
      const tw = ctx.measureText(l.label).width
      ctx.fillStyle = 'hsl(0 0% 10% / .85)'
      ctx.fillRect(30, l.y - 26, tw + 8, 14)
      ctx.fillStyle = 'hsl(0 0% 55%)'
      ctx.fillText(l.label, 34, l.y - 19)
    })
    const ml = 'MOMENTUM CHAIN'
    ctx.fillStyle = 'hsl(0 0% 10% / .85)'
    ctx.fillRect(30, MOMY - 39, ctx.measureText(ml).width + 8, 14)
    ctx.fillStyle = 'hsl(0 0% 60%)'
    ctx.fillText(ml, 34, MOMY - 32)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'hsl(0 0% 45%)'
    ctx.fillText('height ' + st.height.toLocaleString('en-US'), w - 8, H - 8)
    if (!reduced) raf = requestAnimationFrame(frame)
  }
  frame()
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="arch" aria-hidden="true"></canvas>
</template>

<style scoped>
.arch { width: 100%; height: 300px; display: block; }
</style>
```

- [ ] **Step 4: Implement VerifyPanel**

`src/components/VerifyPanel.vue`:

```vue
<script setup></script>

<template>
  <div class="card panel">
    <div class="ledger-label head">Verification-first</div>
    <div class="title">Don't trust. Verify.</div>
    <div class="steps">
      <div class="step" style="animation-delay: 0s">
        <span class="num">01</span>
        <div class="body"><span class="mono">sync headers</span> — the momentum header chain is small enough for a browser</div>
      </div>
      <div class="step" style="animation-delay: 2.7s">
        <span class="num">02</span>
        <div class="body"><span class="mono">request proof</span> — an SPV-style path from any transaction to a momentum commitment</div>
      </div>
      <div class="step" style="animation-delay: 5.3s">
        <span class="check">✓</span>
        <div class="body"><span class="mono green">verified locally</span> — no trusted remote RPC, ever</div>
      </div>
    </div>
    <div class="note">Browser-native proofs today; node participation and execution next. <a href="https://zenon.wtf" class="note-link">zenon.wtf</a></div>
  </div>
</template>

<style scoped>
.panel { padding: 26px 28px; display: flex; flex-direction: column; }
.head { margin-bottom: 10px; }
.title { font-size: 20px; font-weight: 700; margin-bottom: 18px; }
.steps { display: flex; flex-direction: column; gap: 14px; flex: 1; }
.step { display: flex; gap: 12px; align-items: baseline; animation: zn-step 8s infinite; }
.num { font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 12px; color: hsl(0 0% 45%); flex: none; }
.check { font-family: var(--mono); font-size: 12px; color: var(--green); flex: none; }
.body { font-size: 14px; line-height: 1.55; color: var(--body-text); }
.mono { font-family: var(--mono); font-size: 12.5px; }
.green { color: var(--green); }
.note { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 13px; line-height: 1.6; color: var(--muted); }
.note-link { font-size: 13px; }
</style>
```

- [ ] **Step 5: Implement WhatZenonIs**

`src/components/WhatZenonIs.vue`:

```vue
<script setup>
import DualLedgerCanvas from './DualLedgerCanvas.vue'
import VerifyPanel from './VerifyPanel.vue'
</script>

<template>
  <section class="section">
    <p class="ledger-label eyebrow">What Zenon is</p>
    <h2 class="h2">A feeless, dual-ledger network, verifiable from a browser.</h2>
    <p class="lead">Zenon pairs per-user account chains with a global settlement chain that produces <em>momentums</em> (blocks). Each account processes transactions on its own chain — truly asynchronous and parallel — while momentums provide an ordered commitment over the whole network. Because momentums commit to network state in a small header chain, clients can verify inclusion with SPV-style proofs alone. That unlocks browser-native proof verification, wallets, and eventually node participation and execution — no trusted remote RPC. The <a href="https://github.com/TminusZ/zenon-developer-commons">architecture</a> is in place. The community is building out the vision.</p>
    <div class="cards">
      <div class="card arch-card">
        <div class="ledger-label arch-head">Dual ledger · asynchronous account chains</div>
        <div class="arch-mask"><DualLedgerCanvas /></div>
        <div class="caption">Each account writes to its own chain, in parallel — transactions fire at the settlement layer, get grouped, and are committed into the next momentum. Both ledgers grow together.</div>
      </div>
      <VerifyPanel />
    </div>
  </section>
</template>

<style scoped>
.eyebrow { margin: 0 0 12px; }
.lead { font-size: 17px; line-height: 1.75; color: var(--body-text); max-width: 76ch; margin: 0; }
.cards { margin-top: 36px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
.arch-card { padding: 26px 28px; }
.arch-head { margin-bottom: 18px; }
.arch-mask { -webkit-mask-image: linear-gradient(90deg, transparent 0, black 26px, black 100%); mask-image: linear-gradient(90deg, transparent 0, black 26px, black 100%); }
.caption { margin-top: 14px; font-size: 13.5px; line-height: 1.6; color: var(--muted); }
@media (max-width: 860px) { .cards { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/DualLedgerCanvas.vue src/components/VerifyPanel.vue src/components/WhatZenonIs.vue tests/what-zenon-is.test.js
git commit -m "feat: add What-Zenon-is section with dual-ledger canvas and verify panel"
```

---

### Task 6: WhyWeFit checklist

**Files:**
- Create: `src/components/WhyWeFit.vue`
- Test: `tests/why-we-fit.test.js`

**Interfaces:**
- Consumes: `.card`, `.section`, `.h2`, `.ledger-label`.
- Produces: `WhyWeFit` SFC, no props.

- [ ] **Step 1: Write the failing test**

`tests/why-we-fit.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhyWeFit from '../src/components/WhyWeFit.vue'

describe('WhyWeFit', () => {
  it('renders all six checklist cards', () => {
    const wrapper = mount(WhyWeFit)
    expect(wrapper.text()).toContain('We check the boxes.')
    const titles = wrapper.findAll('.check-title').map((n) => n.text())
    expect(titles).toEqual([
      'FOSS, community-run',
      'Fair launch',
      'Bitcoin-aligned research',
      'No audit budget',
      'In active development since 2019',
      'We already build with Spiral tools',
    ])
    expect(wrapper.findAll('.tick')).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/WhyWeFit.vue`.

- [ ] **Step 3: Implement**

`src/components/WhyWeFit.vue`:

```vue
<script setup>
const checks = [
  { title: 'FOSS, community-run', body: 'No corporate entity. Founding devs were anonymous and handed the network to the community; development, node operation, and funding are all community-driven.' },
  { title: 'Fair launch', body: 'No ICO, no VC or insider allocation, no team tokens. Users bonded BTC, ran nodes, and received allocations — and their bitcoin back via algorithmic refunds.' },
  { title: 'Bitcoin-aligned research', body: 'An open research commons exploring Zenon as a potential bitcoin scaling/interoperability layer: SPV models, verification boundaries, Taproot-era designs.' },
  { title: 'No audit budget', body: 'The exact attacker/maintainer asymmetry the Loupe launch post describes — well-resourced attackers, unfunded maintainers.' },
  { title: 'In active development since 2019', body: 'A living Go codebase with consensus, p2p, an embedded VM, wallet, and RPC — real attack surface, actively maintained.' },
  { title: 'We already build with Spiral tools', body: 'goose is part of our daily coding workflow, and we run buzz (buzz.zenon.info) for the community. Loupe would be the third.' },
]
</script>

<template>
  <section class="section">
    <p class="ledger-label eyebrow green-eyebrow">Why we fit Loupe's mission</p>
    <h2 class="h2 tight">We check the boxes.</h2>
    <p class="sub">Loupe exists to fix the attacker/maintainer asymmetry for FOSS bitcoin projects. That asymmetry is our exact situation.</p>
    <div class="grid">
      <div v-for="c in checks" :key="c.title" class="card check-card">
        <span class="tick">✓</span>
        <div>
          <div class="check-title">{{ c.title }}</div>
          <div class="check-body">{{ c.body }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eyebrow { margin: 0 0 12px; }
.green-eyebrow { color: var(--green); }
.tight { margin: 0 0 8px; }
.sub { font-size: 16px; color: var(--muted); margin: 0 0 28px; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.check-card { display: flex; gap: 14px; align-items: flex-start; padding: 20px 22px; }
.tick { font-family: var(--mono); font-size: 20px; font-weight: 700; color: var(--green); line-height: 1.2; }
.check-title { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
.check-body { font-size: 14.5px; line-height: 1.6; color: var(--muted); }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/WhyWeFit.vue tests/why-we-fit.test.js
git commit -m "feat: add why-we-fit checklist section"
```

---

### Task 7: WhyNow and AskCommit

**Files:**
- Create: `src/components/WhyNow.vue`, `src/components/AskCommit.vue`
- Test: `tests/why-now-ask.test.js`

**Interfaces:**
- Consumes: `.card`, `.section`, `.h2`, `.ledger-label`.
- Produces: `WhyNow` and `AskCommit` SFCs, no props.

- [ ] **Step 1: Write the failing test**

`tests/why-now-ask.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhyNow from '../src/components/WhyNow.vue'
import AskCommit from '../src/components/AskCommit.vue'

describe('WhyNow', () => {
  it('renders both mid-flight changes and the closing line', () => {
    const wrapper = mount(WhyNow)
    expect(wrapper.text()).toContain('Two major changes are mid-flight.')
    expect(wrapper.text()).toContain('Dynamic Plasma')
    expect(wrapper.text()).toContain('libp2p')
    expect(wrapper.text()).toContain('not after it')
  })
})

describe('AskCommit', () => {
  it('renders three numbered asks and four commitments', () => {
    const wrapper = mount(AskCommit)
    expect(wrapper.text()).toContain("What we're asking for")
    expect(wrapper.text()).toContain('What we commit to')
    expect(wrapper.findAll('.ask')).toHaveLength(3)
    expect(wrapper.findAll('.commit')).toHaveLength(4)
    expect(wrapper.text()).toContain('guinea pig')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/WhyNow.vue`.

- [ ] **Step 3: Implement WhyNow**

`src/components/WhyNow.vue`:

```vue
<script setup></script>

<template>
  <section class="section">
    <p class="ledger-label eyebrow">Why now</p>
    <h2 class="h2">Two major changes are mid-flight.</h2>
    <div class="grid">
      <div class="card change-card">
        <div class="ledger-label head">In implementation</div>
        <div class="name">Dynamic Plasma</div>
        <div class="body">The feeless anti-spam and resource model — new consensus-adjacent code paths.</div>
      </div>
      <div class="card change-card">
        <div class="ledger-label head">In migration</div>
        <div class="name">libp2p</div>
        <div class="body">Replacing the networking stack — the p2p attack surface is being rebuilt.</div>
      </div>
    </div>
    <p class="closing">A scan of the current codebase today means confirmed findings and fixes ship <strong>in</strong> the next major network upgrade — not after it.</p>
  </section>
</template>

<style scoped>
.eyebrow { margin: 0 0 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
.change-card { padding: 22px; }
.head { margin-bottom: 8px; }
.name { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
.body { font-size: 14.5px; line-height: 1.6; color: var(--muted); }
.closing { font-size: 16px; line-height: 1.7; color: var(--body-text); margin: 0; max-width: 76ch; }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 4: Implement AskCommit**

`src/components/AskCommit.vue`:

```vue
<script setup>
const asks = [
  'A funded Loupe scan of go-zenon — and other Zenon repos, one at a time, as Loupe supports.',
  "If that's out of scope for phase 1: guidance to self-run Loupe with our own model tokens. We'll be the guinea pig for the self-serve path on a Go codebase and report back publicly.",
  "Repo-prep guidance — the launch post says markdown context files optimize scanning; we'll write them.",
]
const commits = [
  'A responsive security contact for responsible disclosure',
  'Timely triage of every report',
  'Fixes shipped in the upcoming major upgrade',
  'Public feedback to help Spiral iterate on the outreach process',
]
</script>

<template>
  <section class="section ask-grid">
    <div>
      <p class="ledger-label eyebrow">What we're asking for</p>
      <ol class="asks">
        <li v-for="(a, i) in asks" :key="i" class="ask">
          <span class="num">{{ i + 1 }}</span>
          <span class="text">{{ a }}</span>
        </li>
      </ol>
    </div>
    <div>
      <p class="ledger-label eyebrow">What we commit to</p>
      <ul class="commits">
        <li v-for="c in commits" :key="c" class="commit">
          <span class="arrow">→</span>{{ c }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ask-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.eyebrow { margin: 0 0 12px; }
.asks { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 18px; }
.ask { display: flex; gap: 14px; }
.num { font-family: var(--mono); font-variant-numeric: tabular-nums; font-weight: 700; color: var(--green); }
.text { font-size: 15.5px; line-height: 1.65; color: var(--body-text); }
.commits { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
.commit { display: flex; gap: 12px; font-size: 15.5px; line-height: 1.65; color: var(--body-text); }
.arrow { color: var(--green); font-family: var(--mono); }
@media (max-width: 860px) { .ask-grid { grid-template-columns: 1fr; gap: 32px; } }
</style>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/WhyNow.vue src/components/AskCommit.vue tests/why-now-ask.test.js
git commit -m "feat: add why-now and ask/commit sections"
```

---

### Task 8: ScopeAside, ScanTargets, ClosingCta

**Files:**
- Create: `src/components/ScopeAside.vue`, `src/components/ScanTargets.vue`, `src/components/ClosingCta.vue`
- Test: `tests/tail-sections.test.js`

**Interfaces:**
- Consumes: `.card`, `.section`, `.ledger-label`, tokens.
- Produces: `ScopeAside`, `ScanTargets`, `ClosingCta` SFCs, no props. (The show/hide decision for `ScopeAside` lives in `App.vue`, Task 9 — the component itself is unconditional.)

- [ ] **Step 1: Write the failing test**

`tests/tail-sections.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScopeAside from '../src/components/ScopeAside.vue'
import ScanTargets from '../src/components/ScanTargets.vue'
import ClosingCta from '../src/components/ClosingCta.vue'

describe('ScopeAside', () => {
  it('renders the honest scope note', () => {
    const wrapper = mount(ScopeAside)
    expect(wrapper.text()).toContain('On scope, honestly')
    expect(wrapper.text()).toContain('phase 1 is bitcoin-ecosystem repos')
  })
})

describe('ScanTargets', () => {
  it('renders primary and future scan target cards', () => {
    const wrapper = mount(ScanTargets)
    expect(wrapper.get('a[href="https://github.com/zenon-network/go-zenon"]').text()).toBe('zenon-network/go-zenon')
    expect(wrapper.text()).toContain('Primary')
    expect(wrapper.text()).toContain('Future scans')
    expect(wrapper.text()).toContain('consensus · p2p · embedded VM · wallet · RPC')
  })
})

describe('ClosingCta', () => {
  it('renders the closing headline and outline Matrix button', () => {
    const wrapper = mount(ClosingCta)
    expect(wrapper.text()).toContain('One scan. Confirmed findings, PoC included, fixed in the next upgrade.')
    const btn = wrapper.get('a.outline-btn')
    expect(btn.attributes('href')).toBe('https://matrix.to/#/%23loupe:zenon.chat')
    expect(btn.text()).toBe('Meet us on Matrix →')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/components/ScopeAside.vue`.

- [ ] **Step 3: Implement ScopeAside**

`src/components/ScopeAside.vue`:

```vue
<script setup></script>

<template>
  <section class="aside-section">
    <div class="aside">
      <p class="ledger-label head">On scope, honestly</p>
      <p class="body">We know phase 1 is bitcoin-ecosystem repos. We think a fairly-launched, community-run FOSS network researching bitcoin scaling is within the spirit of the program — and if it isn't, we'll happily take the self-serve path and report back.</p>
    </div>
  </section>
</template>

<style scoped>
.aside-section { max-width: 1080px; margin: 0 auto; padding: 64px 32px 0; }
.aside { border: 1px dashed hsl(0 0% 25%); border-radius: var(--radius-card); padding: 22px 26px; max-width: 820px; }
.head { margin: 0 0 8px; }
.body { font-size: 15.5px; line-height: 1.7; color: var(--body-text); margin: 0; }
</style>
```

- [ ] **Step 4: Implement ScanTargets**

`src/components/ScanTargets.vue`:

```vue
<script setup></script>

<template>
  <section class="section">
    <p class="ledger-label eyebrow">Scan targets</p>
    <div class="grid">
      <div class="card target-card">
        <div class="head-row">
          <a href="https://github.com/zenon-network/go-zenon" class="repo">zenon-network/go-zenon</a>
          <span class="ledger-label primary">Primary</span>
        </div>
        <div class="desc">The reference Go node implementation.</div>
        <div class="facts">lang: Go 100% · license: GPL-3.0<br />surface: consensus · p2p · embedded VM · wallet · RPC</div>
      </div>
      <div class="card target-card">
        <div class="head-row">
          <a href="https://github.com/zenon-network" class="repo">zenon-network/*</a>
          <span class="ledger-label">Future scans</span>
        </div>
        <div class="desc">SDKs, znn-controller, wallets — one at a time, as Loupe's coverage grows.</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eyebrow { margin: 0 0 12px; }
.grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
.target-card { padding: 24px; }
.head-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.repo { font-family: var(--mono); font-size: 17px; font-weight: 600; color: var(--fg); }
.primary { color: var(--green); }
.desc { font-size: 14.5px; line-height: 1.6; color: var(--muted); margin-bottom: 14px; }
.target-card:last-child .desc { margin-bottom: 0; }
.facts { font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 12.5px; line-height: 1.9; color: var(--body-text); }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 5: Implement ClosingCta**

`src/components/ClosingCta.vue`:

```vue
<script setup></script>

<template>
  <section class="closing">
    <h2 class="headline">One scan. Confirmed findings, PoC included, fixed in the next upgrade.</h2>
    <p class="sub">No application form needed — Loupe says reach out. So we're reaching out.</p>
    <a href="https://matrix.to/#/%23loupe:zenon.chat" class="outline-btn">Meet us on Matrix →</a>
  </section>
</template>

<style scoped>
.closing { max-width: 1080px; margin: 0 auto; padding: 80px 32px; text-align: center; }
.headline { font-size: 34px; font-weight: 800; margin: 0 0 12px; text-wrap: balance; }
.sub { font-size: 16px; color: var(--muted); margin: 0 0 26px; }
.outline-btn { display: inline-block; border: 1px solid hsl(0 0% 30%); color: var(--fg); font-weight: 600; font-size: 16px; padding: 12px 24px; border-radius: var(--radius-btn); transition: border-color 150ms var(--ease); }
.outline-btn:hover { border-color: var(--green); text-decoration: none; color: var(--fg); }
</style>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ScopeAside.vue src/components/ScanTargets.vue src/components/ClosingCta.vue tests/tail-sections.test.js
git commit -m "feat: add scope aside, scan targets, and closing CTA"
```

---

### Task 9: Assemble App, showAside flag, full-page test, build check

**Files:**
- Modify: `src/App.vue` (replace entirely), `tests/app.test.js` (replace entirely)

**Interfaces:**
- Consumes: every component from Tasks 2–8, by the exact names/paths above.
- Produces: complete page. `VITE_SHOW_ASIDE` env var — any value except the string `"false"` (including unset) shows the scope aside.

- [ ] **Step 1: Replace the app test with the full-page version**

`tests/app.test.js` (replace entire file):

```js
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function freshApp() {
  const { default: App } = await import('../src/App.vue')
  return App
}

describe('App', () => {
  it('renders every section in order', async () => {
    const App = await freshApp()
    const wrapper = mount(App)
    const text = wrapper.text()
    const landmarks = [
      'zenon → loupe',
      'Put Zenon under the Loupe.',
      'In active development since',
      'A feeless, dual-ledger network, verifiable from a browser.',
      'We check the boxes.',
      'Two major changes are mid-flight.',
      "What we're asking for",
      'On scope, honestly',
      'Scan targets',
      'One scan. Confirmed findings, PoC included, fixed in the next upgrade.',
      'portal@zenon.network',
    ]
    let pos = -1
    for (const l of landmarks) {
      const next = text.indexOf(l)
      expect(next, `"${l}" missing or out of order`).toBeGreaterThan(pos)
      pos = next
    }
  })

  it('hides the scope aside when VITE_SHOW_ASIDE is "false"', async () => {
    vi.stubEnv('VITE_SHOW_ASIDE', 'false')
    const App = await freshApp()
    const wrapper = mount(App)
    expect(wrapper.text()).not.toContain('On scope, honestly')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — App still renders the empty Task 1 shell.

- [ ] **Step 3: Replace App.vue**

`src/App.vue` (replace entire file):

```vue
<script setup>
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import StatStrip from './components/StatStrip.vue'
import WhatZenonIs from './components/WhatZenonIs.vue'
import WhyWeFit from './components/WhyWeFit.vue'
import WhyNow from './components/WhyNow.vue'
import AskCommit from './components/AskCommit.vue'
import ScopeAside from './components/ScopeAside.vue'
import ScanTargets from './components/ScanTargets.vue'
import ClosingCta from './components/ClosingCta.vue'
import SiteFooter from './components/SiteFooter.vue'

const showAside = import.meta.env.VITE_SHOW_ASIDE !== 'false'
</script>

<template>
  <div class="page">
    <SiteNav />
    <HeroSection />
    <StatStrip />
    <WhatZenonIs />
    <WhyWeFit />
    <WhyNow />
    <AskCommit />
    <ScopeAside v-if="showAside" />
    <ScanTargets />
    <ClosingCta />
    <SiteFooter />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }
</style>
```

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: PASS — all test files green.

- [ ] **Step 5: Build and preview**

Run:

```bash
npm run build
npm run preview &
PREVIEW_PID=$!
sleep 2
curl -s http://localhost:4173/loupe/ | grep -o '<title>[^<]*</title>'
kill $PREVIEW_PID
```

Expected: `<title>Put Zenon under the Loupe</title>`. (If port 4173 is busy, `npm run preview` prints the actual port — adjust the curl.)

- [ ] **Step 6: Visual check against the handoff**

Start `npm run dev`, open the page in a browser (via the claude-in-chrome skill if executing agentically), and compare each section against `design_handoff_loupe_pitch/README.md` §"Page structure": both canvases animating, plasma CTA gradient, verify-panel steps pulsing on the 8s stagger, layout at 1280px wide, and the 860px collapse. Fix discrepancies before committing.

- [ ] **Step 7: Commit**

```bash
git add src/App.vue tests/app.test.js
git commit -m "feat: assemble full landing page with showAside build flag"
```

---

### Task 10: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` producing `dist/` (Task 1); remote `origin` = `https://github.com/0x3639/loupe.git` (already configured).
- Produces: live site at `https://0x3639.github.io/loupe/`.

- [ ] **Step 1: Write the workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit the workflow**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy to GitHub Pages on push to main"
```

- [ ] **Step 3: Enable Pages (workflow build type), then push**

```bash
gh api -X POST repos/0x3639/loupe/pages -f build_type=workflow || echo "Pages may already be enabled — continuing"
git push -u origin main
```

Expected: push succeeds; a `Deploy to GitHub Pages` run starts. (If the `gh api` call 404s because the repo needs at least one push first, push, then re-run the `gh api` command, then `gh workflow run deploy.yml`.)

- [ ] **Step 4: Watch the run**

Run: `gh run watch $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status`
Expected: both jobs succeed.

- [ ] **Step 5: Verify the live site**

Run: `curl -sI https://0x3639.github.io/loupe/ | head -1 && curl -s https://0x3639.github.io/loupe/ | grep -o '<title>[^<]*</title>'`
Expected: `HTTP/2 200` and `<title>Put Zenon under the Loupe</title>`. Pages DNS can take a minute on first deploy — retry once after 60s before diagnosing.

- [ ] **Step 6: Handoff TODO — SECURITY.md check (report only)**

Run: `gh api repos/zenon-network/go-zenon/contents/SECURITY.md --jq .name || echo "NO SECURITY.md"`
Report the result to the user (the handoff asks to confirm go-zenon has one; no page change either way).
