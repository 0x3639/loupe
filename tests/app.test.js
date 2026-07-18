import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function freshApp() {
  const { default: App } = await import('../src/App.vue')
  return App
}

describe('App', () => {
  it('renders every section in order', async () => {
    const App = await freshApp()
    const wrapper = mount(App)
    const text = wrapper.text()
    const landmarks = [
      'zenon → loupe',
      'Put Zenon under the Loupe.',
      'In active development since',
      'A feeless, dual-ledger network, verifiable from a browser.',
      'We check the boxes.',
      'Two major changes are mid-flight.',
      "What we're asking for",
      'On scope, honestly',
      'Scan targets',
      'One scan. Confirmed findings, PoC included, fixed in the next upgrade.',
      'portal@zenon.network',
    ]
    let pos = -1
    for (const l of landmarks) {
      const next = text.indexOf(l)
      expect(next, `"${l}" missing or out of order`).toBeGreaterThan(pos)
      pos = next
    }
  })

  it('hides the scope aside when VITE_SHOW_ASIDE is "false"', async () => {
    vi.stubEnv('VITE_SHOW_ASIDE', 'false')
    const App = await freshApp()
    const wrapper = mount(App)
    expect(wrapper.text()).not.toContain('On scope, honestly')
  })
})
