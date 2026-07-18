<script setup></script>

<template>
  <section class="section">
    <h2 class="ledger-label eyebrow">Scan targets</h2>
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
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.target-card { padding: 24px; }
.head-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.repo { font-family: var(--mono); font-size: 17px; font-weight: 600; color: var(--fg); }
.primary { color: var(--green); }
.desc { font-size: 14.5px; line-height: 1.6; color: var(--muted); margin-bottom: 14px; }
.target-card:last-child .desc { margin-bottom: 0; }
.facts { font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 12.5px; line-height: 1.9; color: var(--body-text); }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
