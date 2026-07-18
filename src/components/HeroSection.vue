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
