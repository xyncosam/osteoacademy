import { Hero } from '@/components/home/Hero'
import { ValueProps } from '@/components/home/ValueProps'
import { FeaturedCourseSection } from '@/components/home/FeaturedCourseSection'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCourseSection />
      <ValueProps />
    </main>
  )
}
