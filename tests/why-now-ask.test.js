import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhyNow from '../src/components/WhyNow.vue'
import AskCommit from '../src/components/AskCommit.vue'

describe('WhyNow', () => {
  it('renders both mid-flight changes and the closing line', () => {
    const wrapper = mount(WhyNow)
    expect(wrapper.text()).toContain('Two major changes are mid-flight.')
    expect(wrapper.text()).toContain('Dynamic Plasma')
    expect(wrapper.text()).toContain('libp2p')
    expect(wrapper.text()).toContain('not after it')
  })
})

describe('AskCommit', () => {
  it('renders two numbered asks and four commitments', () => {
    const wrapper = mount(AskCommit)
    expect(wrapper.text()).toContain("What we're asking for")
    expect(wrapper.text()).toContain('What we commit to')
    expect(wrapper.findAll('.ask')).toHaveLength(2)
    expect(wrapper.findAll('.commit')).toHaveLength(4)
    expect(wrapper.text()).toContain('Repo-prep guidance')
  })
})
