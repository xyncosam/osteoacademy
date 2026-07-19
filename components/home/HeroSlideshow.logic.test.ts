import { describe, it, expect } from 'vitest'
import { nextSlideIndex } from './HeroSlideshow.logic'

describe('nextSlideIndex', () => {
  it('advances to the next index', () => {
    expect(nextSlideIndex(0, 6)).toBe(1)
    expect(nextSlideIndex(3, 6)).toBe(4)
  })

  it('wraps back to 0 after the last slide', () => {
    expect(nextSlideIndex(5, 6)).toBe(0)
  })
})
