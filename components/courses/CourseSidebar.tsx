import { DatesComingSoon } from './DatesComingSoon'
import { formatPrice } from '@/lib/format'
import { getPublishedDates } from '@/lib/courses'
import type { Course } from '@/lib/types'

export function CourseSidebar({ course }: { course: Course }) {
  const dates = getPublishedDates(course)

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="font-display text-3xl font-semibold text-forest-900">{formatPrice(course.priceCents)}</p>
      <p className="mt-1 font-body text-xs text-ink-900/70">
        per attendee &middot; {course.format === 'in-person' ? 'in-person' : 'online'}
      </p>

      <div className="mt-5">
        {dates.length === 0 ? (
          <DatesComingSoon />
        ) : (
          <ul className="flex flex-col gap-3">
            {dates.map((date) => (
              <li key={date.id} className="rounded-md border border-border p-3">
                <p className="font-body text-sm font-semibold text-forest-900">{date.date}</p>
                <p className="font-body text-xs text-ink-900/70">{date.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 font-body text-xs text-ink-900/70">Instructor: {course.instructor.name}</p>
    </div>
  )
}
