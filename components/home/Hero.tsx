import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { HeroSlideshow } from './HeroSlideshow'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 text-center">
      <HeroSlideshow />
      <Container className="flex flex-col items-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
          Continuing Education for Health Professionals
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium text-cream-50 md:text-5xl">
          Learn. Understand. Apply. Transform.
        </h1>
        <span className="mt-4 h-1.5 w-16 rounded-full bg-sage-500" aria-hidden="true" />
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-cream-100">
          Hands-on workshops and online courses that build real clinical skill, taught by practicing professionals.
        </p>
        <div className="mt-8">
          <Button href="/courses" variant="inverse">Explore Courses</Button>
        </div>
        <p className="mt-10 font-body text-sm text-cream-100">
          Follow along on Instagram, Facebook &amp; YouTube for tips, techniques, and behind-the-scenes.
        </p>
        <SocialLinks variant="light" className="mt-3 justify-center" />
      </Container>
    </section>
  )
}
