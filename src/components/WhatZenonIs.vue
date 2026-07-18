<script setup>
import DualLedgerCanvas from './DualLedgerCanvas.vue'
import VerifyPanel from './VerifyPanel.vue'
</script>

<template>
  <section class="section">
    <p class="ledger-label eyebrow">What Zenon is</p>
    <h2 class="h2">A feeless, dual-ledger network, verifiable from a browser.</h2>
    <p class="lead">Zenon pairs per-user account chains with a global settlement chain that produces <em>momentums</em> (blocks). Each account processes transactions on its own chain — truly asynchronous and parallel — while momentums provide an ordered commitment over the whole network. Because momentums commit to network state in a small header chain, clients can verify inclusion with SPV-style proofs alone — simplified payment verification, as Satoshi described in <a href="https://bitcoin.org/bitcoin.pdf">section 8 of the bitcoin white paper</a>. That unlocks browser-native proof verification, wallets, and eventually node participation and execution — no trusted remote RPC. The <a href="https://github.com/TminusZ/zenon-developer-commons">architecture</a> is in place. The community is building out the vision. Don't trust. Verify.</p>
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
.lead { font-size: 17px; line-height: 1.75; color: var(--body-text); margin: 0; }
.cards { margin-top: 36px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
.arch-card { padding: 26px 28px; }
.arch-head { margin-bottom: 18px; }
.arch-mask { -webkit-mask-image: linear-gradient(90deg, transparent 0, black 26px, black 100%); mask-image: linear-gradient(90deg, transparent 0, black 26px, black 100%); }
.caption { margin-top: 14px; font-size: 13.5px; line-height: 1.6; color: var(--muted); }
@media (max-width: 860px) { .cards { grid-template-columns: 1fr; } }
</style>
