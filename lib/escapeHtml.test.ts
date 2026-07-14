import { describe, it, expect } from 'vitest'
import { escapeHtml } from './escapeHtml'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Hello, world!')).toBe('Hello, world!')
  })

  it('escapes ampersands and quotes', () => {
    expect(escapeHtml('Tom & "Jerry"')).toBe('Tom &amp; &quot;Jerry&quot;')
  })
})
