import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoursesPage from './page'

describe('CoursesPage', () => {
  it('lists the Dynamic Acupressure course with a link to its detail page', () => {
    render(<CoursesPage />)
    const link = screen.getByRole('link', { name: /Dynamic Acupressure/ })
    expect(link).toHaveAttribute('href', '/courses/dynamic-acupressure')
  })
})
