import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteNav from '../src/components/SiteNav.vue'
import SiteFooter from '../src/components/SiteFooter.vue'

describe('SiteNav', () => {
  it('shows the brand label and both nav links', () => {
    const wrapper = mount(SiteNav)
    expect(wrapper.text()).toContain('zenon → loupe')
    expect(wrapper.get('a[href="https://github.com/zenon-network/go-zenon"]').text()).toBe('go-zenon on GitHub')
    expect(wrapper.get('a[href="https://matrix.to/#/%23loupe:zenon.chat"]').text()).toBe('Talk to us')
  })
})

describe('SiteFooter', () => {
  it('shows all four link columns with the real contact email', () => {
    const wrapper = mount(SiteFooter)
    for (const label of ['Zenon', 'Research', 'Loupe', 'Contact']) {
      expect(wrapper.text()).toContain(label)
    }
    expect(wrapper.get('a[href="mailto:portal@zenon.network"]').text()).toBe('portal@zenon.network')
    expect(wrapper.text()).not.toContain('add handle')
  })
})
