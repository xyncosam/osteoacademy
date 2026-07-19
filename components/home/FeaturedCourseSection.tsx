import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { getFeaturedCourse } from '@/lib/courses'

export function FeaturedCourseSection() {
  const course = getFeaturedCourse()

  return (
    <section className="bg-cream-100 py-20">
      <Container>
        <SectionHeading eyebrow="Featured Workshop" title={course.title} />
        <div className="mt-4 flex items-center gap-4">
          <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
          <span className="font-display text-2xl text-forest-900">{formatPrice(course.priceCents)}</span>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {course.description.map((paragraph, index) => (
            <p key={index} className="max-w-2xl font-body text-base leading-relaxed text-ink-900">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <Button href={`/courses/${course.slug}`}>View Course Details</Button>
        </div>
      </Container>
    </section>
  )
}
