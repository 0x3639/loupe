import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MatrixRain from '../src/components/MatrixRain.vue'
import DualLedgerCanvas from '../src/components/DualLedgerCanvas.vue'

let rafQueue
let cancelSpy
let observers

beforeEach(() => {
  rafQueue = []
  cancelSpy = vi.fn()
  observers = []
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    rafQueue.push(cb)
    return rafQueue.length
  })
  vi.stubGlobal('cancelAnimationFrame', cancelSpy)
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb) {
        this.cb = cb
        observers.push(this)
      }
      observe() {
        this.observed = true
      }
      disconnect() {
        this.disconnected = true
      }
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const pump = () => {
  const due = rafQueue.splice(0)
  due.forEach((cb) => cb(performance.now()))
}

describe.each([
  ['MatrixRain', MatrixRain],
  ['DualLedgerCanvas', DualLedgerCanvas],
])('%s visibility loop', (_name, Comp) => {
  it('runs only while visible and cleans up on unmount', () => {
    const wrapper = mount(Comp)
    const io = observers[0]
    expect(io.observed).toBe(true)
    expect(rafQueue).toHaveLength(0) // nothing scheduled before first intersection

    io.cb([{ isIntersecting: true }])
    expect(rafQueue).toHaveLength(1)
    pump()
    expect(rafQueue).toHaveLength(1) // visible loop reschedules itself

    io.cb([{ isIntersecting: false }])
    expect(cancelSpy).toHaveBeenCalled()
    pump()
    expect(rafQueue).toHaveLength(0) // stopped loop does not reschedule

    io.cb([{ isIntersecting: true }])
    expect(rafQueue).toHaveLength(1) // resumes when visible again

    wrapper.unmount()
    expect(io.disconnected).toBe(true)
  })

  it('draws a single static frame under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const wrapper = mount(Comp)
    observers.at(-1).cb([{ isIntersecting: true }])
    expect(rafQueue).toHaveLength(1)
    pump()
    expect(rafQueue).toHaveLength(0) // one frame, no loop
    wrapper.unmount()
  })
})
