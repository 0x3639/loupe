import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('App', () => {
  it('mounts the page shell', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.page').exists()).toBe(true)
  })
})
