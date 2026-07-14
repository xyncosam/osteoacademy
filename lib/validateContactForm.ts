export type ContactFormInput = {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormInput, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(input: ContactFormInput): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!input.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!input.message.trim()) {
    errors.message = 'Please enter a message.'
  }

  return errors
}
