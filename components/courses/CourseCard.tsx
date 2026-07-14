import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/format'
import type { Course } from '@/lib/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
        <h3 className="mt-4 font-display text-2xl text-forest-900">{course.title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink-900">{course.tagline}</p>
        <p className="mt-4 font-display text-lg text-forest-900">{formatPrice(course.priceCents)}</p>
      </Card>
    </Link>
  )
}
