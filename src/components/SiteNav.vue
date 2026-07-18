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
