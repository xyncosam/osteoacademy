import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialLinks } from './SocialLinks'

describe('SocialLinks', () => {
  it('links to Instagram, Facebook, and YouTube in new tabs', () => {
    render(<SocialLinks />)

    const instagram = screen.getByRole('link', { name: 'Instagram' })
    expect(instagram).toHaveAttribute(
      'href',
      'https://www.instagram.com/osteo__academy_?igsh=ODFneHN1eGJwd3N0&utm_source=qr',
    )
    expect(instagram).toHaveAttribute('target', '_blank')
    expect(instagram).toHaveAttribute('rel', 'noopener noreferrer')

    const facebook = screen.getByRole('link', { name: 'Facebook' })
    expect(facebook).toHaveAttribute('href', 'https://www.facebook.com/share/1EeDmqpyKH/?mibextid=wwXIfr')

    const youtube = screen.getByRole('link', { name: 'YouTube' })
    expect(youtube).toHaveAttribute('href', 'https://youtube.com/@osteoacademy?si=-2RF_HJAtlNBf515')
  })
})
