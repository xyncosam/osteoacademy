import { formatPrice } from '@/lib/format'
import type { Course } from '@/lib/types'
import { NotifyMeForm } from './NotifyMeForm'

export function CourseSidebar({ course }: { course: Course }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="font-display text-3xl font-semibold text-forest-900">{formatPrice(course.priceCents)}</p>
      <p className="mt-1 font-body text-xs text-ink-900/70">one-time payment &middot; lifetime access</p>

      <div className="mt-5 rounded-lg border border-dashed border-border bg-cream-100 p-4">
        <p className="font-body text-sm font-bold text-forest-900">Enrollment Coming Soon</p>
        <p className="mt-1 font-body text-sm leading-relaxed text-ink-900">
          This course isn&apos;t open for enrollment yet. Check back soon for updates.
        </p>
        <NotifyMeForm courseTitle={course.title} />
      </div>

      <p className="mt-6 font-body text-xs text-ink-900/70">Instructor: {course.instructor.name}</p>
    </div>
  )
}
