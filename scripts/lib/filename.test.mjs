import { describe, it, expect } from 'vitest'
import { isDuplicateFile, outputFileNameFor } from './filename.mjs'

describe('isDuplicateFile', () => {
  it('flags OS-style duplicate suffixes', () => {
    expect(isDuplicateFile('IMG_2163(1).HEIC')).toBe(true)
  })

  it('does not flag normal filenames', () => {
    expect(isDuplicateFile('IMG_2163.HEIC')).toBe(false)
  })
})

describe('outputFileNameFor', () => {
  it('lowercases and normalizes an IMG_ style name to .jpg', () => {
    expect(outputFileNameFor('IMG_2777.JPG')).toBe('img-2777.jpg')
  })

  it('normalizes a camera-style name to .jpg', () => {
    expect(outputFileNameFor('6F1A9503.jpeg')).toBe('6f1a9503.jpg')
  })

  it('normalizes a HEIC name to .jpg', () => {
    expect(outputFileNameFor('IMG_2058.HEIC')).toBe('img-2058.jpg')
  })
})
