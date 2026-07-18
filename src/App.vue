<script setup>
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import StatStrip from './components/StatStrip.vue'
import WhatZenonIs from './components/WhatZenonIs.vue'
import WhyWeFit from './components/WhyWeFit.vue'
import WhyNow from './components/WhyNow.vue'
import AskCommit from './components/AskCommit.vue'
import ScopeAside from './components/ScopeAside.vue'
import ScanTargets from './components/ScanTargets.vue'
import ClosingCta from './components/ClosingCta.vue'
import SiteFooter from './components/SiteFooter.vue'

const showAside = import.meta.env.VITE_SHOW_ASIDE !== 'false'
</script>

<template>
  <div class="page">
    <SiteNav />
    <main>
      <HeroSection />
      <StatStrip />
      <WhatZenonIs />
      <WhyWeFit />
      <WhyNow />
      <AskCommit />
      <ScopeAside v-if="showAside" />
      <ScanTargets />
      <ClosingCta />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--bg); overflow-x: clip; }
</style>
