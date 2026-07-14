import { describe, it, expect } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats a whole-dollar amount without cents', () => {
    expect(formatPrice(49500)).toBe('$495')
  })

  it('formats an amount with cents', () => {
    expect(formatPrice(4999)).toBe('$49.99')
  })

  it('formats zero as $0', () => {
    expect(formatPrice(0)).toBe('$0')
  })
})
