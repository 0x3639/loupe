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
.closing { font-size: 16px; line-height: 1.7; color: var(--body-text); margin: 0; }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
</style>
