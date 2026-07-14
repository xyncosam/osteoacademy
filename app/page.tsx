import { Hero } from '@/components/home/Hero'
import { PhotoStrip } from '@/components/home/PhotoStrip'
import { ValueProps } from '@/components/home/ValueProps'
import { FeaturedCourseSection } from '@/components/home/FeaturedCourseSection'
import { Container } from '@/components/ui/Container'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Container>
        <PhotoStrip />
      </Container>
      <FeaturedCourseSection />
      <ValueProps />
    </main>
  )
}
