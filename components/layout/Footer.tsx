import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-cream-100">
      <Container className="flex flex-col gap-4 py-10 text-sm text-ink-900 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg text-forest-900">Osteo Academy</p>
        <nav className="flex gap-6">
          <Link href="/courses" className="hover:text-sage-500">Courses</Link>
          <Link href="/about" className="hover:text-sage-500">About</Link>
          <Link href="/contact" className="hover:text-sage-500">Contact</Link>
        </nav>
        <p className="text-xs text-ink-900/70">&copy; {year} Osteo Academy. All rights reserved.</p>
      </Container>
    </footer>
  )
}
