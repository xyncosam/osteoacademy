import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the hero headline', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Learn. Understand. Apply. Transform.' })).toBeInTheDocument()
  })

  it('links to the Dynamic Acupressure course from the featured section', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'View Course Details' })).toHaveAttribute(
      'href',
      '/courses/dynamic-acupressure',
    )
  })

  it('shows the featured course price', () => {
    render(<HomePage />)
    expect(screen.getByText('$495')).toBeInTheDocument()
  })
})
