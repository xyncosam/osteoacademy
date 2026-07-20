import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Osteo Academy | Continuing Education for Health Professionals',
  description:
    'Hands-on workshops for health professionals, with online courses coming soon. Learn. Understand. Apply. Transform.',
  openGraph: {
    title: 'Osteo Academy | Continuing Education for Health Professionals',
    description: 'Hands-on workshops for health professionals, with online courses coming soon.',
    type: 'website',
    siteName: 'Osteo Academy',
  },
  twitter: {
    card: 'summary',
    title: 'Osteo Academy | Continuing Education for Health Professionals',
    description: 'Hands-on workshops for health professionals, with online courses coming soon.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
