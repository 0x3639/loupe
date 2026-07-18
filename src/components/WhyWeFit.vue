<script setup>
const checks = [
  { title: 'FOSS, community-run', body: 'No corporate entity. Founding devs were anonymous and handed the network to the community; development, node operation, and funding are all community-driven.' },
  { title: 'Fair launch', body: 'No ICO, no VC or insider allocation, no team tokens. Users bonded BTC, ran nodes, and received allocations — and their bitcoin back via algorithmic refunds.' },
  { title: 'Bitcoin-aligned research', body: 'An open <a href="https://github.com/TminusZ/zenon-developer-commons">research commons</a> exploring Zenon as a potential bitcoin scaling/interoperability layer: SPV models, verification boundaries, Taproot-era designs.' },
  { title: 'No audit budget', body: 'The exact attacker/maintainer asymmetry the Loupe launch post describes — well-resourced attackers, unfunded maintainers.' },
  { title: 'In active development since 2019', body: 'A living Go codebase with consensus, p2p, an embedded VM, wallet, and RPC — real attack surface, actively maintained.' },
  { title: 'We already build with Spiral tools', body: 'goose is part of our coding workflow, and we run buzz (buzz.zenon.info) for the community. Loupe would be the third.' },
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
          <!-- bodies are static strings authored in this file; v-html lets them carry links -->
          <div class="check-body" v-html="c.body"></div>
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
