'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { notifyWhenAvailable, type NotifyMeState } from '@/app/courses/actions'

const initialState: NotifyMeState = { status: 'idle' }

export function NotifyMeForm({ courseTitle }: { courseTitle: string }) {
  const [state, formAction, isPending] = useActionState(notifyWhenAvailable, initialState)

  if (state.status === 'success') {
    return (
      <p className="mt-4 font-body text-sm text-forest-900">
        Thanks — we&apos;ll email you when this course opens for enrollment.
      </p>
    )
  }

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="courseTitle" value={courseTitle} />
      <div className="flex gap-2">
        <label htmlFor="notify-email" className="sr-only">Email</label>
        <input
          id="notify-email"
          name="email"
          type="email"
          placeholder="your@email.com"
          className="w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 font-body text-sm"
        />
        <Button type="submit" size="sm" disabled={isPending} className="shrink-0">
          {isPending ? 'Sending...' : 'Notify Me'}
        </Button>
      </div>
      {state.status === 'error' && state.error && (
        <p className="mt-2 font-body text-xs text-red-700">{state.error}</p>
      )}
      <p className="mt-2 font-body text-xs text-ink-900/70">
        We&apos;ll only email you when this course opens for enrollment.
      </p>
    </form>
  )
}
