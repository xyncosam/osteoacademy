import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

describe('Header', () => {
  it('renders the primary nav links', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: 'Courses' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0)
  })

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })
})
