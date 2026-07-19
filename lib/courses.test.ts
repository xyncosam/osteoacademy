import { describe, it, expect } from 'vitest'
import { getCourseBySlug, getFeaturedCourse, getPublishedDates } from './courses'

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

describe('getPublishedDates', () => {
  it('returns an empty array when no dates are published', () => {
    expect(getPublishedDates(getFeaturedCourse())).toEqual([])
  })

  it('filters out unpublished dates', () => {
    const course = {
      ...getFeaturedCourse(),
      dates: [
        { id: '1', date: '2026-09-01', location: 'Denver, CO', published: true },
        { id: '2', date: '2026-10-01', location: 'Austin, TX', published: false },
      ],
    }
    expect(getPublishedDates(course)).toHaveLength(1)
    expect(getPublishedDates(course)[0].id).toBe('1')
  })
})
