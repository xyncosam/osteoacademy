import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <main className="py-20">
      <Container className="max-w-2xl">
        <SectionHeading eyebrow="Get in Touch" title="Contact Osteo Academy" />
        <p className="mt-6 font-body text-base leading-relaxed text-ink-900">
          Questions about an upcoming workshop or an online course? Send us a message and we&apos;ll get back to you
          shortly.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </Container>
    </main>
  )
}
