import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders an anchor when href is provided', () => {
    render(<Button href="/courses">Explore Courses</Button>)
    const link = screen.getByRole('link', { name: 'Explore Courses' })
    expect(link).toHaveAttribute('href', '/courses')
  })

  it('renders a submit button when type="submit"', () => {
    render(<Button type="submit">Send</Button>)
    const button = screen.getByRole('button', { name: 'Send' })
    expect(button).toHaveAttribute('type', 'submit')
  })
})
