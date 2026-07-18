import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhyWeFit from '../src/components/WhyWeFit.vue'

describe('WhyWeFit', () => {
  it('renders all six checklist cards', () => {
    const wrapper = mount(WhyWeFit)
    expect(wrapper.text()).toContain('We check the boxes.')
    const titles = wrapper.findAll('.check-title').map((n) => n.text())
    expect(titles).toEqual([
      'FOSS, community-run',
      'Fair launch',
      'Bitcoin-aligned research',
      'No audit budget',
      'In active development since 2019',
      'We already build with Spiral tools',
    ])
    expect(wrapper.findAll('.tick')).toHaveLength(6)
    expect(wrapper.get('a[href="https://github.com/TminusZ/zenon-developer-commons"]').text()).toBe('research commons')
  })
})
