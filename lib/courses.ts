import type { Course, CourseDate } from './types'

export const COURSES: Course[] = [
  {
    slug: 'dynamic-acupressure',
    title: 'Dynamic Acupressure',
    tagline: 'Hands-on technique for real functional outcomes',
    format: 'in-person',
    priceCents: 49500,
    description: [
      'Dynamic Acupressure is a one-day, hands-on workshop designed for licensed health professionals who want to add a precise, evidence-informed acupressure technique to their clinical toolkit.',
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
      bio: 'Alexey Soshalskiy has been practicing manual therapy since 2019, with training and experience in Rapid NeuroFascial Reset (RNFR) and Manual Osteopathy (MOT). Since 2022, he has served as an instructor at a local massage therapy institute, teaching anatomy, pathology, and orthopedic assessment. Through years of clinical practice, teaching, and continued study, Alexey has developed several original treatment concepts by integrating principles from physiotherapy, osteopathy, and Traditional Chinese Medicine. His approach emphasizes practical, evidence-informed techniques that can be readily applied in clinical practice.',
      photo: '/images/new-portrait.jpg',
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
