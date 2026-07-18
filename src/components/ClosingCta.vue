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
