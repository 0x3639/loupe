<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}()=:;/*+-#$&'
  const FS = 13
  const TRAIL = 18
  let cols = []
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const setup = (w, h) => {
    const n = Math.ceil(w / (FS + 3))
    cols = Array.from({ length: n }, (_, i) => ({
      x: i * (FS + 3) + 2,
      y: Math.random() * h / FS,
      sp: 3.5 + Math.random() * 6,
      chars: Array.from({ length: Math.ceil(h / FS) + TRAIL }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
    }))
  }
  let last = performance.now()
  const frame = (nowMs) => {
    const dt = Math.min(0.1, (nowMs - last) / 1000)
    last = nowMs
    const dpr = window.devicePixelRatio || 1
    const w = cv.clientWidth || 300
    const h = cv.clientHeight || 300
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    if (cols.length === 0 || cols.length !== Math.ceil(w / (FS + 3))) setup(w, h)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.font = `${FS}px "JetBrains Mono", monospace`
    ctx.textBaseline = 'top'
    const rows = Math.ceil(h / FS)
    cols.forEach((c) => {
      c.y += c.sp * dt * (reduced ? 0 : 1)
      if (Math.random() < 0.06) c.chars[Math.floor(Math.random() * c.chars.length)] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      const head = Math.floor(c.y % (rows + TRAIL))
      for (let k = 0; k < TRAIL; k++) {
        const r = head - k
        if (r < 0 || r >= rows) continue
        const a = k === 0 ? 0.75 : 0.55 * (1 - k / TRAIL)
        ctx.fillStyle = k === 0 ? `hsl(120 86% 70% / ${a})` : `hsl(145 100% 42% / ${a})`
        ctx.fillText(c.chars[(r + Math.floor(c.y / rows)) % c.chars.length], c.x, r * FS)
      }
    })
    if (!reduced) raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="rain" aria-hidden="true"></canvas>
</template>

<style scoped>
.rain { width: 100%; height: 100%; display: block; }
</style>
