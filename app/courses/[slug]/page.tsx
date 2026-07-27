import type { Metadata } from 'next'
import Link from 'next/link'
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
    description: `${course.title}: a self-paced online course for health professionals. ${course.tagline}.`,
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

          <div className="mt-10">
            <SectionHeading eyebrow="Refund Policy" title="Enroll with confidence" />
            <div className="mt-6 flex flex-col gap-4">
              <p className="font-body text-base leading-relaxed text-ink-900">
                If {course.title} isn&apos;t the right fit, you can request a full refund within 14 days of
                purchase, provided you&apos;ve completed less than 25% of the course content. This gives you
                real time to explore the material while keeping things fair for everyone.
              </p>
              <p className="font-body text-base leading-relaxed text-ink-900">
                To request a refund,{' '}
                <Link href="/contact" className="underline hover:text-sage-500">
                  contact us
                </Link>{' '}
                with your name and purchase date. Approved refunds are issued to your original payment method
                within 5 business days.
              </p>
              <p className="font-body text-base leading-relaxed text-ink-900">
                Some situations are always covered, regardless of timing: accidental duplicate charges, buying
                the wrong course by mistake, or being unable to access the course due to a technical problem on
                our end. In any of these cases, we&apos;ll make it right with a refund, credit, or fix.
              </p>
              <p className="font-body text-base leading-relaxed text-ink-900">
                Once certificates of completion become available, any course a certificate has been issued for
                will no longer be eligible for a refund, since the certificate confirms the course was
                completed.
              </p>
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
