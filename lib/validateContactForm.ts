import { isValidEmail } from './validateEmail'

export type ContactFormInput = {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormInput, string>>

export function validateContactForm(input: ContactFormInput): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!input.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!isValidEmail(input.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!input.message.trim()) {
    errors.message = 'Please enter a message.'
  }

  return errors
}
