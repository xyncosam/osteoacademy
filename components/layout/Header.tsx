'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-cream-50">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image src="/logo/badge-glow.png" alt="" fill className="object-cover" priority />
          </span>
          <span className="font-display text-xl font-semibold text-forest-900">Osteo Academy</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="font-body text-sm font-medium text-ink-900 hover:text-sage-500">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="font-body text-sm font-medium text-forest-900">Menu</span>
        </button>
      </Container>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-cream-50 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 font-body text-sm font-medium text-ink-900"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
