import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PhotoStrip } from '@/components/ui/PhotoStrip'
import { InstructorProfile } from '@/components/about/InstructorProfile'
import { getFeaturedCourse } from '@/lib/courses'

export const metadata: Metadata = {
  title: 'About | Osteo Academy',
  description:
    'Osteo Academy helps licensed health professionals build real, applicable clinical skill through hands-on workshops, with online courses coming soon.',
}

export default function AboutPage() {
  const { instructor } = getFeaturedCourse()

  return (
    <main className="py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="About Osteo Academy"
          title="Practical continuing education, built by a practitioner"
        />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-900">
          Osteo Academy exists to help licensed health professionals build real, applicable clinical skill through
          hands-on workshops today and self-paced online courses soon. Every course is designed around a simple idea:
          learn it, understand why it works, apply it with a real patient, and let it transform your practice.
        </p>

        <div className="mt-12">
          <PhotoStrip />
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="Meet the Instructor" title="Your instructor" />
          <div className="mt-8">
            <InstructorProfile instructor={instructor} />
          </div>
        </div>
      </Container>
    </main>
  )
}
