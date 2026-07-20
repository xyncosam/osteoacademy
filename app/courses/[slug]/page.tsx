import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { LearningObjectives } from '@/components/courses/LearningObjectives'
import { CourseSidebar } from '@/components/courses/CourseSidebar'
import { InstructorProfile } from '@/components/about/InstructorProfile'
import { COURSES, getCourseBySlug } from '@/lib/courses'

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return { title: 'Course Not Found | Osteo Academy' }
  }

  return {
    title: `${course.title} | Osteo Academy`,
    description: `${course.title}: a hands-on workshop for health professionals. ${course.tagline}.`,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  return (
    <main className="py-20">
      <Container className="flex flex-col gap-12 md:flex-row md:items-start">
        <div className="flex-1">
          <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
          <h1 className="mt-4 font-display text-4xl font-medium text-forest-900">{course.title}</h1>
          <p className="mt-3 font-body text-base text-ink-900">{course.tagline}</p>

          <div className="mt-10 flex flex-col gap-4">
            {course.description.map((paragraph, index) => (
              <p key={index} className="font-body text-base leading-relaxed text-ink-900">{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <SectionHeading eyebrow="Curriculum" title="What you'll learn" />
            <div className="mt-6">
              <LearningObjectives objectives={course.learningObjectives} />
            </div>
          </div>

          <div className="mt-10">
            <SectionHeading eyebrow="Your Instructor" title="Meet your instructor" />
            <div className="mt-6">
              <InstructorProfile instructor={course.instructor} />
            </div>
          </div>
        </div>

        <div className="order-first w-full md:order-none md:w-80 md:shrink-0">
          <div className="md:sticky md:top-8">
            <CourseSidebar course={course} />
          </div>
        </div>
      </Container>
    </main>
  )
}
