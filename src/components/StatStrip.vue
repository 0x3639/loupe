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
