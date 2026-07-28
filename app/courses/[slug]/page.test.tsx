import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CourseDetailPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('CourseDetailPage', () => {
  it('renders the Dynamic Acupressure course content', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'dynamic-acupressure' }) })
    render(Page)

    expect(screen.getByRole('heading', { level: 1, name: 'Dynamic Acupressure' })).toBeInTheDocument()
    expect(screen.getByText('Enrollment Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('Alexey Soshalskiy')).toBeInTheDocument()
  })

  it('renders no Register/purchase button or link before enrollment opens', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'dynamic-acupressure' }) })
    render(Page)

    expect(screen.queryByRole('button', { name: /register|enroll now|buy|purchase/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /register|enroll now|buy|purchase/i })).not.toBeInTheDocument()
  })

  it('renders a Notify Me form for enrollment interest', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'dynamic-acupressure' }) })
    render(Page)

    expect(screen.getByRole('button', { name: 'Notify Me' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders a refund policy that links to the contact page', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'dynamic-acupressure' }) })
    render(Page)

    expect(screen.getByText('Enroll with confidence')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'contact us' })).toHaveAttribute('href', '/contact')
  })

  it('calls notFound for an unknown slug', async () => {
    await expect(CourseDetailPage({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })
})
