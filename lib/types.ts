export type CourseFormat = 'in-person' | 'online'

export type CourseDate = {
  id: string
  date: string
  location: string
  published: boolean
}

export type Instructor = {
  name: string
  credentials?: string
  bio: string
  photo: string
}

export type Course = {
  slug: string
  title: string
  tagline: string
  format: CourseFormat
  priceCents: number
  description: string[]
  learningObjectives: string[]
  instructor: Instructor
  dates: CourseDate[]
}
