import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MatrixRain from '../src/components/MatrixRain.vue'
import HeroSection from '../src/components/HeroSection.vue'

describe('MatrixRain', () => {
  it('renders a canvas and survives mount/unmount without a 2d context', () => {
    const wrapper = mount(MatrixRain)
    expect(wrapper.find('canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('HeroSection', () => {
  it('renders headline, subhead, and plasma CTA to Matrix', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain('Put Zenon under the Loupe.')
    expect(wrapper.text()).toContain('A pitch to the Loupe team at Spiral')
    expect(wrapper.text()).toContain('no company, no VCs, and no audit budget')
    const cta = wrapper.get('a.cta')
    expect(cta.attributes('href')).toBe('https://matrix.to/#/%23loupe:zenon.chat')
    expect(cta.text()).toBe('Talk to us on Matrix →')
    expect(wrapper.text()).toContain('#loupe:zenon.chat')
  })
})
