import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScopeAside from '../src/components/ScopeAside.vue'
import ScanTargets from '../src/components/ScanTargets.vue'
import ClosingCta from '../src/components/ClosingCta.vue'

describe('ScopeAside', () => {
  it('renders the honest scope note', () => {
    const wrapper = mount(ScopeAside)
    expect(wrapper.text()).toContain('On scope, honestly')
    expect(wrapper.text()).toContain('the Loupe phase 1 rollout is bitcoin-ecosystem repos')
    expect(wrapper.text()).toContain('we meet the criteria for participation')
  })
})

describe('ScanTargets', () => {
  it('renders primary and future scan target cards', () => {
    const wrapper = mount(ScanTargets)
    expect(wrapper.get('a[href="https://github.com/zenon-network/go-zenon"]').text()).toBe('zenon-network/go-zenon')
    expect(wrapper.text()).toContain('Primary')
    expect(wrapper.text()).toContain('Future scans')
    expect(wrapper.text()).toContain('consensus · p2p · embedded VM · wallet · RPC')
  })
})

describe('ClosingCta', () => {
  it('renders the closing headline and outline Matrix button', () => {
    const wrapper = mount(ClosingCta)
    expect(wrapper.text()).toContain('One scan. Confirmed findings, PoC included, fixed in the next upgrade.')
    const btn = wrapper.get('a.outline-btn')
    expect(btn.attributes('href')).toBe('https://matrix.to/#/%23loupe:zenon.chat')
    expect(btn.text()).toBe('Meet us on Matrix →')
  })
})
