import { describe, it, expect } from 'vitest'
import { isValidEmail } from './validateEmail'

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('jamie@example.com')).toBe(true)
  })

  it('rejects a string without an @', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })

  it('rejects a string without a domain', () => {
    expect(isValidEmail('jamie@example')).toBe(false)
  })
})
