import { describe, it, expect } from 'vitest'
import { getCourseBySlug, getFeaturedCourse } from './courses'

describe('getCourseBySlug', () => {
  it('finds the Dynamic Acupressure course', () => {
    expect(getCourseBySlug('dynamic-acupressure')?.title).toBe('Dynamic Acupressure')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getCourseBySlug('does-not-exist')).toBeUndefined()
  })
})

describe('getFeaturedCourse', () => {
  it('returns the Dynamic Acupressure course', () => {
    expect(getFeaturedCourse().slug).toBe('dynamic-acupressure')
  })
})
