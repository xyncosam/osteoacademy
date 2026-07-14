'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitContactForm, type ContactFormState } from '@/app/contact/actions'

const initialState: ContactFormState = { status: 'idle', errors: {} }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  if (state.status === 'success') {
    return <p className="font-body text-base text-forest-900">Thanks for reaching out. We&apos;ll get back to you soon.</p>
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="font-body text-sm font-medium text-ink-900">Name</label>
        <input id="name" name="name" type="text" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.name && <p className="mt-1 text-sm text-red-700">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="font-body text-sm font-medium text-ink-900">Email</label>
        <input id="email" name="email" type="email" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.email && <p className="mt-1 text-sm text-red-700">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="font-body text-sm font-medium text-ink-900">Message</label>
        <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.message && <p className="mt-1 text-sm text-red-700">{state.errors.message}</p>}
      </div>

      {state.message && <p className="font-body text-sm text-red-700">{state.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
