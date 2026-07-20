import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Osteo Academy',
  description: 'Questions about an upcoming workshop? Get in touch with Osteo Academy.',
}

export default function ContactPage() {
  return (
    <main className="py-20">
      <Container className="max-w-2xl">
        <SectionHeading as="h1" eyebrow="Get in Touch" title="Contact Osteo Academy" />
        <p className="mt-6 font-body text-base leading-relaxed text-ink-900">
          Questions about an upcoming workshop? Send us a message and we&apos;ll get back to you within 1-2 business
          days.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </Container>
    </main>
  )
}
