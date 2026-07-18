import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DualLedgerCanvas from '../src/components/DualLedgerCanvas.vue'
import VerifyPanel from '../src/components/VerifyPanel.vue'
import WhatZenonIs from '../src/components/WhatZenonIs.vue'

describe('DualLedgerCanvas', () => {
  it('renders a canvas and survives mount/unmount without a 2d context', () => {
    const wrapper = mount(DualLedgerCanvas)
    expect(wrapper.find('canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('VerifyPanel', () => {
  it('renders the three verification steps and zenon.wtf link', () => {
    const wrapper = mount(VerifyPanel)
    expect(wrapper.text()).toContain("Don't trust. Verify.")
    expect(wrapper.text()).toContain('sync headers')
    expect(wrapper.text()).toContain('request proof')
    expect(wrapper.text()).toContain('verified locally')
    expect(wrapper.find('a[href="https://zenon.wtf"]').exists()).toBe(true)
  })
})

describe('WhatZenonIs', () => {
  it('renders the section heading, architecture link, and both cards', () => {
    const wrapper = mount(WhatZenonIs)
    expect(wrapper.text()).toContain('A feeless, dual-ledger network, verifiable from a browser.')
    expect(wrapper.get('a[href="https://github.com/TminusZ/zenon-developer-commons"]').text()).toBe('architecture')
    expect(wrapper.get('a[href="https://bitcoin.org/bitcoin.pdf"]').text()).toBe('section 8 of the bitcoin white paper')
    expect(wrapper.text()).toContain("The community is building out the vision. Don't trust. Verify.")
    expect(wrapper.text()).toContain('Dual ledger · asynchronous account chains')
    expect(wrapper.text()).toContain('Both ledgers grow together.')
  })
})
