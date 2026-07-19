import type { Course, CourseDate } from './types'

export const COURSES: Course[] = [
  {
    slug: 'dynamic-acupressure',
    title: 'Dynamic Acupressure',
    tagline: 'Hands-on technique for real functional outcomes',
    format: 'in-person',
    priceCents: 49500,
    description: [
      "Dynamic Acupressure combines traditional acupressure point selection with modern anatomy and neurophysiology to treat common musculoskeletal conditions such as tennis elbow, golfer's elbow, plantar fasciitis, frozen shoulder, sciatica, SI joint dysfunction, TMJ dysfunction, neck pain, and low back pain.",
      'Using sustained pressure combined with movement and positioning, the technique is designed to engage multiple neuromuscular and fascial receptors simultaneously, including muscle spindles, Golgi tendon organs, Ruffini endings, and interstitial mechanoreceptors. This multimodal approach aims to reduce protective muscle guarding, improve tissue mobility, increase local circulation, and, where appropriate, help restore normal joint and soft tissue alignment for improved movement and function.',
      'Ideal for massage therapists, physiotherapists, chiropractors, manual osteopathic practitioners, athletic therapists, and other healthcare professionals, this hands-on course provides practical, condition-specific treatment protocols that can be immediately integrated into clinical practice.',
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
