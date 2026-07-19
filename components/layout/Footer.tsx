import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SocialLinks } from '@/components/ui/SocialLinks'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-cream-100">
      <Container className="flex flex-col gap-6 py-10 text-sm text-ink-900 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image src="/logo/badge-glow.png" alt="" fill className="object-cover" />
          </span>
          <p className="font-display text-lg text-forest-900">Osteo Academy</p>
        </div>
        <nav className="flex gap-6">
          <Link href="/courses" className="hover:text-sage-500">Courses</Link>
          <Link href="/about" className="hover:text-sage-500">About</Link>
          <Link href="/contact" className="hover:text-sage-500">Contact</Link>
        </nav>
        <SocialLinks />
        <p className="text-xs text-ink-900/70">&copy; {year} Osteo Academy. All rights reserved.</p>
      </Container>
    </footer>
  )
}
