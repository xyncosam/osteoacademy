import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CourseDetailPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('CourseDetailPage', () => {
  it('renders the Functional Acupressure course content', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'functional-acupressure' }) })
    render(Page)

    expect(screen.getByRole('heading', { level: 1, name: 'Functional Acupressure' })).toBeInTheDocument()
    expect(screen.getByText('Dates Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('Alexey Soshalskiy')).toBeInTheDocument()
  })

  it('renders no Register/Notify button or link while dates are unpublished', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'functional-acupressure' }) })
    render(Page)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('calls notFound for an unknown slug', async () => {
    await expect(CourseDetailPage({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })
})
