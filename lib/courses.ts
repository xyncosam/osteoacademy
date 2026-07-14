import type { Course, CourseDate } from './types'

export const COURSES: Course[] = [
  {
    slug: 'functional-acupressure',
    title: 'Functional Acupressure',
    tagline: 'Hands-on technique for real functional outcomes',
    format: 'in-person',
    priceCents: 49500,
    description: [
      'Functional Acupressure is a one-day, hands-on workshop designed for licensed health professionals who want to add a precise, evidence-informed acupressure technique to their clinical toolkit.',
      'Rather than treating acupressure as an isolated modality, this course frames each technique within a functional movement context, connecting point selection to the assessment findings you already use every day.',
      "Through guided practice, case-based discussion, and instructor feedback, you'll leave with a repeatable framework you can apply in your very next patient session.",
    ],
    learningObjectives: [
      'Assess common functional movement restrictions relevant to acupressure technique',
      'Apply core acupressure points with correct depth, angle, and sequencing',
      "Build a session-length treatment sequence tailored to a patient's presentation",
      'Integrate acupressure technique alongside existing manual therapy approaches',
      'Recognize contraindications and safety considerations for acupressure practice',
    ],
    instructor: {
      name: 'Alexey Soshalskiy',
      bio: 'Bio coming soon.',
      photo: '/images/img-2066.jpg',
    },
    dates: [],
  },
]

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug)
}

export function getFeaturedCourse(): Course {
  return COURSES[0]
}

export function getPublishedDates(course: Course): CourseDate[] {
  return course.dates.filter((date) => date.published)
}
