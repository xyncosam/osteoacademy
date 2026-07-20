import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'

const VALUE_PROPS = [
  { title: 'Taught by a practitioner', body: 'Every course is built and taught by a working clinician who uses these techniques in real patient care every day.' },
  { title: 'Built for busy schedules', body: "Focused, hands-on workshops and self-paced online courses designed around a working clinician's time." },
  { title: 'Skills you apply immediately', body: 'Every course centers on a repeatable framework you can bring into your very next patient session.' },
]

export function ValueProps() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Why Osteo Academy" title="Education built for practice, not just theory" align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <Card key={prop.title}>
              <h3 className="font-display text-xl text-forest-900">{prop.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-900">{prop.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
