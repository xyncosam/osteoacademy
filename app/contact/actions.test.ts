import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContactForm, type ContactFormState } from './actions'
import { sendEmail } from '@/lib/email'

vi.mock('@/lib/email', () => ({ sendEmail: vi.fn() }))

const initialState: ContactFormState = { status: 'idle', errors: {} }

function formData(fields: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe('submitContactForm', () => {
  beforeEach(() => {
    vi.mocked(sendEmail).mockReset()
    vi.stubEnv('CONTACT_TO_EMAIL', 'hello@osteoacademy.test')
  })

  it('returns validation errors without sending an email', async () => {
    const result = await submitContactForm(initialState, formData({ name: '', email: '', message: '' }))
    expect(result.status).toBe('error')
    expect(result.errors.name).toBeDefined()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('sends an email and returns success for valid input', async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined)
    const result = await submitContactForm(
      initialState,
      formData({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' }),
    )
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'hello@osteoacademy.test', subject: 'New contact form message from Jamie' }),
    )
    expect(result.status).toBe('success')
  })

  it('returns an error state when sendEmail throws', async () => {
    vi.mocked(sendEmail).mockRejectedValue(new Error('network down'))
    const result = await submitContactForm(
      initialState,
      formData({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' }),
    )
    expect(result.status).toBe('error')
  })
})
