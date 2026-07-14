import { describe, it, expect } from 'vitest'
import { validateContactForm } from './validateContactForm'

describe('validateContactForm', () => {
  it('returns no errors for valid input', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' })).toEqual({})
  })

  it('requires a name', () => {
    expect(validateContactForm({ name: '', email: 'jamie@example.com', message: 'Hi' }).name).toBeDefined()
  })

  it('requires a valid email format', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'not-an-email', message: 'Hi' }).email).toBeDefined()
  })

  it('requires a message', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'jamie@example.com', message: '' }).message).toBeDefined()
  })
})
