<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const V = 26
  const H = 300
  const MOMY = 240
  const MOMIV = 3.6
  const LANES = [
    { y: 52, label: 'z1qx…f8a' },
    { y: 108, label: 'z1qp…2mk' },
    { y: 164, label: 'z1qz…9rw' },
  ]
  const now = () => performance.now() / 1000
  const t0 = now()
  const st = {
    lanes: LANES.map((l) => ({ y: l.y, label: l.label, blocks: [], nextT: 0 })),
    moms: [],
    flies: [],
    pend: [],
    nextMomT: t0 + 1.6,
    height: 4821304,
  }
  st.lanes.forEach((l) => {
    let t = t0 - 60
    while (t < t0) {
      l.blocks.push({ x: t * V, born: t0 - 10 })
      t += 1.1 + Math.random() * 1.7
    }
    l.nextT = t
  })
  for (let t = t0 - 60; t < t0 - 2; t += MOMIV) {
    st.moms.push({ x: t * V, born: t0 - 10, count: 3 + Math.floor(Math.random() * 6) })
    st.height++
  }
  const rr = (x, y, w, h, r) => {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
  }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const frame = () => {
    const t = now()
    const dpr = window.devicePixelRatio || 1
    const w = cv.clientWidth || 600
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, H)
    const cam = t * V - w + 120
    st.lanes.forEach((l) => {
      if (t >= l.nextT) {
        l.blocks.push({ x: t * V, born: t })
        st.flies.push({ x0: t * V, y0: l.y, x1: st.nextMomT * V, born: t, dur: 0.9 + Math.random() * 0.5 })
        l.nextT = t + 1.1 + Math.random() * 1.7
        if (l.blocks.length > 60) l.blocks.shift()
      }
    })
    st.flies = st.flies.filter((f) => {
      if (t - f.born >= f.dur) {
        st.pend.push(f)
        return false
      }
      return true
    })
    if (t >= st.nextMomT) {
      st.height++
      st.moms.push({ x: st.nextMomT * V, born: t, count: st.pend.length || 1 })
      st.pend = []
      st.nextMomT += MOMIV
      if (st.moms.length > 40) st.moms.shift()
    }
    ctx.save()
    ctx.translate(-cam, 0)
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    st.lanes.forEach((l) => {
      ctx.strokeStyle = 'hsl(0 0% 24%)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 1; i < l.blocks.length; i++) {
        ctx.moveTo(l.blocks[i - 1].x + 15, l.y)
        ctx.lineTo(l.blocks[i].x - 15, l.y)
      }
      ctx.stroke()
      l.blocks.forEach((b) => {
        const a = Math.max(0, 1 - (t - b.born) / 0.8)
        const pop = 1 + 0.25 * Math.max(0, 1 - (t - b.born) / 0.25)
        rr(b.x - 15 * pop, l.y - 10 * pop, 30 * pop, 20 * pop, 4)
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        ctx.strokeStyle = a > 0 ? `hsl(145 100% 42% / ${0.3 + 0.7 * a})` : 'hsl(0 0% 26%)'
        ctx.stroke()
        ctx.fillStyle = a > 0 ? 'hsl(145 100% 52%)' : 'hsl(0 0% 48%)'
        ctx.fillText('tx', b.x, l.y + 0.5)
      })
    })
    ctx.strokeStyle = 'hsl(0 0% 28%)'
    ctx.beginPath()
    for (let i = 1; i < st.moms.length; i++) {
      ctx.moveTo(st.moms[i - 1].x + 28, MOMY)
      ctx.lineTo(st.moms[i].x - 28, MOMY)
    }
    ctx.stroke()
    st.moms.forEach((b) => {
      const a = Math.max(0, 1 - (t - b.born) / 1.0)
      rr(b.x - 28, MOMY - 16, 56, 32, 5)
      if (a > 0) {
        const g = ctx.createLinearGradient(0, MOMY - 16, 0, MOMY + 16)
        g.addColorStop(0, `hsl(120 86% 63% / ${0.15 + 0.85 * a})`)
        g.addColorStop(1, `hsl(145 100% 38% / ${0.15 + 0.85 * a})`)
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        rr(b.x - 28, MOMY - 16, 56, 32, 5)
        ctx.fillStyle = g
        ctx.fill()
        ctx.fillStyle = a > 0.4 ? 'hsl(0 0% 8%)' : 'hsl(0 0% 65%)'
      } else {
        ctx.fillStyle = 'hsl(0 0% 15%)'
        ctx.fill()
        ctx.fillStyle = 'hsl(0 0% 55%)'
      }
      ctx.strokeStyle = a > 0 ? `hsl(145 100% 42% / ${0.4 + 0.6 * a})` : 'hsl(0 0% 30%)'
      ctx.stroke()
      ctx.fillText(b.count + ' tx', b.x, MOMY + 0.5)
    })
    const gx = st.nextMomT * V
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'hsl(0 0% 32%)'
    rr(gx - 28, MOMY - 16, 56, 32, 5)
    ctx.stroke()
    ctx.setLineDash([])
    st.pend.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(gx - 16 + (i % 5) * 8, MOMY - 30 - Math.floor(i / 5) * 9, 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 42%)'
      ctx.fill()
    })
    st.flies.forEach((f) => {
      const p = Math.min(1, (t - f.born) / f.dur)
      const e = p * p * (3 - 2 * p)
      const y1 = MOMY - 30
      const mx = (f.x0 + f.x1) / 2 + 26
      const my = (f.y0 + y1) / 2
      const x = (1 - e) * (1 - e) * f.x0 + 2 * (1 - e) * e * mx + e * e * f.x1
      const y = (1 - e) * (1 - e) * f.y0 + 2 * (1 - e) * e * my + e * e * y1
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 50% / .95)'
      ctx.fill()
    })
    ctx.restore()
    ctx.textAlign = 'left'
    ctx.font = '9px "JetBrains Mono", monospace'
    st.lanes.forEach((l) => {
      const tw = ctx.measureText(l.label).width
      ctx.fillStyle = 'hsl(0 0% 10% / .85)'
      ctx.fillRect(30, l.y - 26, tw + 8, 14)
      ctx.fillStyle = 'hsl(0 0% 55%)'
      ctx.fillText(l.label, 34, l.y - 19)
    })
    const ml = 'MOMENTUM CHAIN'
    ctx.fillStyle = 'hsl(0 0% 10% / .85)'
    ctx.fillRect(30, MOMY - 39, ctx.measureText(ml).width + 8, 14)
    ctx.fillStyle = 'hsl(0 0% 60%)'
    ctx.fillText(ml, 34, MOMY - 32)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'hsl(0 0% 45%)'
    ctx.fillText('height ' + st.height.toLocaleString('en-US'), w - 8, H - 8)
    if (!reduced) raf = requestAnimationFrame(frame)
  }
  frame()
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="arch" aria-hidden="true"></canvas>
</template>

<style scoped>
.arch { width: 100%; height: 300px; display: block; }
</style>
