'use server'

import { isValidEmail } from '@/lib/validateEmail'
import { sendEmail } from '@/lib/email'
import { escapeHtml } from '@/lib/escapeHtml'

export type NotifyMeState = {
  status: 'idle' | 'success' | 'error'
  error?: string
}

export async function notifyWhenAvailable(
  _prevState: NotifyMeState,
  formData: FormData,
): Promise<NotifyMeState> {
  const email = String(formData.get('email') ?? '').trim()
  const courseTitle = String(formData.get('courseTitle') ?? '').trim() || 'a course'

  if (!email || !isValidEmail(email)) {
    return { status: 'error', error: 'Please enter a valid email address.' }
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  if (!toEmail) {
    return { status: 'error', error: 'This form is not fully configured yet. Please use the contact page instead.' }
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `Enrollment interest: ${courseTitle}`,
      html: `<p>${escapeHtml(email)} asked to be notified when <strong>${escapeHtml(courseTitle)}</strong> opens for enrollment.</p>`,
    })
  } catch (error) {
    console.error('Failed to send notify-me email:', error)
    return { status: 'error', error: 'Something went wrong. Please try again shortly.' }
  }

  return { status: 'success' }
}
