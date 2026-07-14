import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function Hero() {
  return (
    <section className="py-20 text-center">
      <Container className="flex flex-col items-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
          Continuing Education for Health Professionals
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium text-forest-900 md:text-5xl">
          Learn. Understand. Apply. Transform.
        </h1>
        <span className="mt-5 h-1.5 w-16 rounded-full bg-sage-500" aria-hidden="true" />
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-ink-900">
          Hands-on workshops and online courses that build real clinical skill, taught by practicing professionals.
        </p>
        <div className="mt-8">
          <Button href="/courses">Explore Courses</Button>
        </div>
      </Container>
    </section>
  )
}
