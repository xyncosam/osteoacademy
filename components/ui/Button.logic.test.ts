import { describe, it, expect } from 'vitest'
import { getButtonClasses } from './Button.logic'

describe('getButtonClasses', () => {
  it('defaults to primary/md', () => {
    const classes = getButtonClasses()
    expect(classes).toContain('bg-forest-900')
    expect(classes).toContain('px-5')
  })

  it('applies outline variant classes', () => {
    expect(getButtonClasses('outline')).toContain('border-forest-900')
  })

  it('applies sm size classes', () => {
    expect(getButtonClasses('primary', 'sm')).toContain('px-4')
  })
})
