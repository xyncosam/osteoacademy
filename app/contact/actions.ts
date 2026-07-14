'use server'

import { validateContactForm, type ContactFormErrors } from '@/lib/validateContactForm'
import { sendEmail } from '@/lib/email'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors: ContactFormErrors
  message?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const input = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  const errors = validateContactForm(input)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors }
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  if (!toEmail) {
    return { status: 'error', errors: {}, message: 'This form is not fully configured yet — please email us directly.' }
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `New contact form message from ${input.name}`,
      html: `<p><strong>From:</strong> ${input.name} (${input.email})</p><p>${input.message}</p>`,
    })
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    return { status: 'error', errors: {}, message: 'Something went wrong sending your message. Please try again shortly.' }
  }

  return { status: 'success', errors: {} }
}
