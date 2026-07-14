import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from './page'

describe('AboutPage', () => {
  it('renders the mission statement heading', () => {
    render(<AboutPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Practical continuing education, built by practitioners' }),
    ).toBeInTheDocument()
  })

  it("renders the featured course's instructor name", () => {
    render(<AboutPage />)
    expect(screen.getByText('Dr. Alex Rivera, DO')).toBeInTheDocument()
  })
})
