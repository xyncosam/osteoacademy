import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CourseCard } from '@/components/courses/CourseCard'
import { COURSES } from '@/lib/courses'

export default function CoursesPage() {
  return (
    <main className="py-20">
      <Container>
        <SectionHeading eyebrow="Courses" title="Workshops and courses for health professionals" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Container>
    </main>
  )
}
