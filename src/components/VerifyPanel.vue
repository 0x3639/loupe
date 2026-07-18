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
