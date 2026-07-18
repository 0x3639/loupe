<script setup></script>

<template>
  <footer class="footer">
    <div class="inner">
      <div class="col">
        <span class="ledger-label">Zenon</span>
        <a href="https://zenon.network">zenon.network</a>
        <a href="https://zenon.wtf/">zenon.wtf</a>
        <a href="https://zenon.org">zenon.org</a>
        <a href="https://zenonhub.io">zenonhub.io</a>
      </div>
      <div class="col">
        <span class="ledger-label">Research</span>
        <a href="https://github.com/TminusZ/zenon-developer-commons">zenon-developer-commons</a>
        <a href="https://github.com/zenon-network">zenon-network org</a>
      </div>
      <div class="col">
        <span class="ledger-label">Loupe</span>
        <a href="https://github.com/project-loupe/loupe">project-loupe/loupe</a>
        <a href="https://spiralxyz.substack.com/p/meet-loupe-ai-powered-vulnerability">Launch post</a>
        <a href="https://www.youtube.com/watch?v=WisO6hoeUb8">Intro video</a>
        <a href="https://x.com/ProjectLoupe">@ProjectLoupe</a>
      </div>
      <div class="col">
        <span class="ledger-label">Contact</span>
        <a href="https://matrix.to/#/%23loupe:zenon.chat" class="mono-sm">#loupe:zenon.chat</a>
        <a href="mailto:portal@zenon.network" class="mono-sm">portal@zenon.network</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--border); }
.inner { max-width: 1080px; margin: 0 auto; padding: 44px 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; font-size: 14px; }
.col { display: flex; flex-direction: column; gap: 9px; }
.mono-sm { font-family: var(--mono); font-size: 12.5px; }
@media (max-width: 860px) { .inner { grid-template-columns: repeat(2, 1fr); } }
</style>
