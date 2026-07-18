import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatStrip from '../src/components/StatStrip.vue'

describe('StatStrip', () => {
  it('renders all five stats with values and captions', () => {
    const wrapper = mount(StatStrip)
    const values = wrapper.findAll('.value').map((n) => n.text())
    expect(values).toEqual(['0', '0', '0', '100%', '2019'])
    for (const caption of ['VC funding', 'Corporate entities', 'Audit budget, USD', 'Go · GPL-3.0', 'In active development since']) {
      expect(wrapper.text()).toContain(caption)
    }
  })
})
