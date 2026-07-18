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
