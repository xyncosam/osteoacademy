import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the hero headline', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Learn. Understand. Apply. Transform.' })).toBeInTheDocument()
  })

  it('links to the Functional Acupressure course from the featured section', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'View Course Details' })).toHaveAttribute(
      'href',
      '/courses/functional-acupressure',
    )
  })

  it('shows the featured course price', () => {
    render(<HomePage />)
    expect(screen.getByText('$495')).toBeInTheDocument()
  })
})
