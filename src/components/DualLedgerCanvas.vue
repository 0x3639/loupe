<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = 0

onMounted(() => {
  const cv = canvas.value
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const VM = 26 // momentum chain scrolls at this steady speed (px/s)
  const H = 300
  const MOMY = 240
  const MOMIV = 3.0 // a momentum seals every 3s (simulation stand-in for the real 10s cadence)
  const LANE_MIN = 40 // account-chain speeds wander within this range (px/s)
  const LANE_MAX = 90
  const GAP = 46 // fixed center-to-center spacing between account blocks (30px block + 16px)
  const FADE = 0.6 // seconds for a lane to fade in/out of the visible set
  const SLOT_YS = [44, 80, 116, 152, 188] // room for up to 5 visible lanes
  const MIN_LANES = 3
  const MAX_LANES = 5
  // pending tx dots pool inside the 56x32 ghost box: 6 cols x 3 rows
  const DOT_COLS = 6
  const DOT_CAP = DOT_COLS * 3
  const dotX = (gx, i) => gx - 28 + 7 + (i % DOT_COLS) * 8.5
  const dotY = (i) => MOMY - 9 + Math.floor(i / DOT_COLS) * 9
  const now = () => performance.now() / 1000
  const rnd = (a, b) => a + Math.random() * (b - a)
  const t0 = now()
  const ADDR_CHARS = 'qpzrxy0f2mk9wsn3l7'
  const pick = (s) => s[Math.floor(Math.random() * s.length)]
  const randLabel = () => `z1q${pick(ADDR_CHARS)}…${pick(ADDR_CHARS)}${pick(ADDR_CHARS)}${pick(ADDR_CHARS)}`
  // lanes fade in already populated: the view is a rotating window over many
  // account chains, not chains springing into existence. The stack is anchored
  // at the bottom slot; new chains drop in from above and land on top of it.
  const makeLane = (slot, label, dropIn) => {
    const l = {
      slot,
      y: dropIn ? SLOT_YS[slot] - 34 : SLOT_YS[slot],
      label,
      blocks: [],
      pos: now() * VM,
      v: rnd(LANE_MIN, LANE_MAX),
      vTarget: rnd(LANE_MIN, LANE_MAX),
      vChangeIn: rnd(2, 4),
      alpha: dropIn ? 0 : 1,
      leaving: false,
      fadeT: now(),
    }
    for (let i = 24; i >= 0; i--) {
      l.blocks.push({ x: l.pos - i * GAP, born: now() - 10 })
    }
    return l
  }
  const st = {
    lanes: [
      makeLane(2, 'z1qx…f8a', false),
      makeLane(3, 'z1qp…2mk', false),
      makeLane(4, 'z1qz…9rw', false),
    ],
    moms: [],
    flies: [],
    pend: [],
    nextMomT: t0 + MOMIV,
    nextRotT: t0 + rnd(2.5, 5),
    height: 4821304,
  }
  for (let t = t0 - 60; t < t0 - 2; t += MOMIV) {
    st.moms.push({ x: t * VM, born: t0 - 10, count: 12 + Math.floor(Math.random() * 6) })
    st.height++
  }
  const rr = (x, y, w, h, r) => {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
  }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let last = t0
  const frame = () => {
    const t = now()
    const dt = Math.min(0.1, t - last)
    last = t
    const dpr = window.devicePixelRatio || 1
    const w = cv.clientWidth || 600
    if (cv.width !== Math.round(w * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, H)
    const camM = t * VM - w + 120
    // rotate the visible set of account chains every few seconds
    if (t >= st.nextRotT) {
      const live = st.lanes.filter((l) => !l.leaving)
      const canAdd = live.length < MAX_LANES
      const canRemove = live.length > MIN_LANES
      if (canAdd && (!canRemove || Math.random() < 0.5)) {
        // new chain drops in from the top, landing on top of the stack
        st.lanes.push(makeLane(MAX_LANES - live.length - 1, randLabel(), true))
      } else if (canRemove) {
        // a chain pops out; every chain stacked above it drops down a slot
        const l = live[Math.floor(Math.random() * live.length)]
        l.leaving = true
        l.fadeT = t
        live.forEach((o) => {
          if (o !== l && o.slot < l.slot) o.slot += 1
        })
      }
      st.nextRotT = t + rnd(2.5, 5)
    }
    st.lanes = st.lanes.filter((l) => {
      if (l.leaving) {
        l.alpha = Math.max(0, 1 - (t - l.fadeT) / FADE)
        if (l.alpha === 0) return false
      } else if (l.alpha < 1) {
        l.alpha = Math.min(1, (t - l.fadeT) / FADE)
      }
      return true
    })
    st.lanes.forEach((l) => {
      // tetris drop: ease each lane toward its slot's y
      if (!l.leaving) l.y += (SLOT_YS[l.slot] - l.y) * Math.min(1, dt * 8)
      l.vChangeIn -= dt
      if (l.vChangeIn <= 0) {
        l.vTarget = rnd(LANE_MIN, LANE_MAX)
        l.vChangeIn = rnd(2, 4)
      }
      l.v += (l.vTarget - l.v) * Math.min(1, dt * 1.5)
      l.pos += l.v * dt
      if (l.leaving) return // a departing chain stops firing
      // fire by distance, not time: a block spawns each time the chain has
      // advanced one fixed GAP, so spacing stays uniform and never overlaps
      while (l.pos - l.blocks[l.blocks.length - 1].x >= GAP) {
        const x = l.blocks[l.blocks.length - 1].x + GAP
        l.blocks.push({ x, born: t })
        st.flies.push({
          lane: l,
          x0: x,
          born: t,
          dur: rnd(0.9, 1.4),
          slot: Math.min(DOT_CAP - 1, st.pend.length + st.flies.length),
        })
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
      st.moms.push({ x: st.nextMomT * VM, born: t, count: st.pend.length || 1 })
      st.pend = []
      st.nextMomT += MOMIV
      if (st.moms.length > 40) st.moms.shift()
    }
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    st.lanes.forEach((l) => {
      const camL = l.pos - w + 120
      ctx.save()
      ctx.globalAlpha = l.alpha
      ctx.translate(-camL, 0)
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
      ctx.restore()
    })
    ctx.save()
    ctx.translate(-camM, 0)
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
    const gx = st.nextMomT * VM
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'hsl(0 0% 32%)'
    rr(gx - 28, MOMY - 16, 56, 32, 5)
    ctx.stroke()
    ctx.setLineDash([])
    // pooled tx dots sit in a grid INSIDE the pending momentum box
    st.pend.forEach((p) => {
      ctx.beginPath()
      ctx.arc(dotX(gx, p.slot), dotY(p.slot), 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 42%)'
      ctx.fill()
    })
    ctx.restore()
    // fly dots live in screen space: their start (a lane frame) and target
    // (the momentum frame) scroll at different speeds. Each dot aims at its
    // own grid slot inside the pending momentum box.
    st.flies.forEach((f) => {
      const sx = f.x0 - (f.lane.pos - w + 120)
      const sy = f.lane.y
      const ex = dotX(gx, f.slot) - camM
      const ey = dotY(f.slot)
      const p = Math.min(1, (t - f.born) / f.dur)
      const e = p * p * (3 - 2 * p)
      const mx = (sx + ex) / 2 + 26
      const my = (sy + ey) / 2
      const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * mx + e * e * ex
      const y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * my + e * e * ey
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 7)
      ctx.fillStyle = 'hsl(145 100% 50% / .95)'
      ctx.fill()
    })
    // account-chain addresses sit to the LEFT of each chain, on the lane line
    ctx.textAlign = 'left'
    ctx.font = '9px "JetBrains Mono", monospace'
    st.lanes.forEach((l) => {
      ctx.save()
      ctx.globalAlpha = l.alpha
      const tw = ctx.measureText(l.label).width
      ctx.fillStyle = 'hsl(0 0% 10% / .95)'
      ctx.fillRect(28, l.y - 8, tw + 10, 16)
      ctx.fillStyle = 'hsl(0 0% 55%)'
      ctx.fillText(l.label, 33, l.y + 0.5)
      ctx.restore()
    })
    const ml = 'MOMENTUM CHAIN'
    const mlw = ctx.measureText(ml).width
    ctx.fillStyle = 'hsl(0 0% 10% / .95)'
    ctx.fillRect(28, MOMY - 8, mlw + 10, 16)
    ctx.fillStyle = 'hsl(0 0% 60%)'
    ctx.fillText(ml, 33, MOMY + 0.5)
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
