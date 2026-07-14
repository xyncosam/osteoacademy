import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendEmail } from './email'

describe('sendEmail', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_KEY', 'test-key')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'no-reply@osteoacademy.test')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('posts to the Brevo transactional email endpoint with the expected payload', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 201 }))

    await sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' })

    expect(fetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'api-key': 'test-key' }),
      }),
    )
  })

  it('throws when Brevo responds with a non-OK status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('bad request', { status: 400 }))

    await expect(
      sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' }),
    ).rejects.toThrow('Brevo request failed')
  })

  it('throws when required env vars are missing', async () => {
    vi.stubEnv('BREVO_API_KEY', '')

    await expect(
      sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' }),
    ).rejects.toThrow('Email is not configured')
  })
})
