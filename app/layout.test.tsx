import { describe, it, expect } from 'vitest'
import { metadata } from './layout'

describe('root layout metadata', () => {
  it('sets the Osteo Academy site title', () => {
    expect(metadata.title).toBe('Osteo Academy | Continuing Education for Health Professionals')
  })

  it('sets a description mentioning health professionals', () => {
    expect(metadata.description).toContain('health professionals')
  })
})
