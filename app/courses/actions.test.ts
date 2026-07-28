import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notifyWhenAvailable, type NotifyMeState } from './actions'
import { sendEmail } from '@/lib/email'

vi.mock('@/lib/email', () => ({ sendEmail: vi.fn() }))

const initialState: NotifyMeState = { status: 'idle' }

function formData(fields: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe('notifyWhenAvailable', () => {
  beforeEach(() => {
    vi.mocked(sendEmail).mockReset()
    vi.stubEnv('CONTACT_TO_EMAIL', 'hello@osteoacademy.test')
  })

  it('returns a validation error for a missing email without sending', async () => {
    const result = await notifyWhenAvailable(initialState, formData({ courseTitle: 'Dynamic Acupressure' }))
    expect(result.status).toBe('error')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('returns a validation error for an invalid email without sending', async () => {
    const result = await notifyWhenAvailable(
      initialState,
      formData({ email: 'not-an-email', courseTitle: 'Dynamic Acupressure' }),
    )
    expect(result.status).toBe('error')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('sends an email and returns success for a valid email', async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined)
    const result = await notifyWhenAvailable(
      initialState,
      formData({ email: 'jamie@example.com', courseTitle: 'Dynamic Acupressure' }),
    )
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'hello@osteoacademy.test',
        subject: 'Enrollment interest: Dynamic Acupressure',
      }),
    )
    expect(result.status).toBe('success')
  })

  it('escapes HTML in the submitted values before building the email body', async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined)
    await notifyWhenAvailable(
      initialState,
      formData({ email: 'jamie@example.com', courseTitle: '<img src=x onerror=alert(1)>' }),
    )
    expect(vi.mocked(sendEmail).mock.calls[0][0].html).not.toContain('<img src=x')
  })

  it('returns an error state when sendEmail throws', async () => {
    vi.mocked(sendEmail).mockRejectedValue(new Error('network down'))
    const result = await notifyWhenAvailable(
      initialState,
      formData({ email: 'jamie@example.com', courseTitle: 'Dynamic Acupressure' }),
    )
    expect(result.status).toBe('error')
  })

  it('returns a friendly not-configured message without sending when CONTACT_TO_EMAIL is unset', async () => {
    vi.stubEnv('CONTACT_TO_EMAIL', '')
    const result = await notifyWhenAvailable(
      initialState,
      formData({ email: 'jamie@example.com', courseTitle: 'Dynamic Acupressure' }),
    )
    expect(result.status).toBe('error')
    expect(result.error).toBe('This form is not fully configured yet. Please use the contact page instead.')
    expect(sendEmail).not.toHaveBeenCalled()
  })
})
