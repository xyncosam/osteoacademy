# Osteo Academy Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Osteo Academy marketing site (Home, Courses, About, Contact) plus the Functional Acupressure course detail page as a working, deployable Next.js app with the approved on-brand design. Accounts, payments, and the admin page are explicitly **out of scope** for this plan — they ship in a follow-on plan ("Plan B") once Appwrite/Stripe credentials exist.

**Architecture:** Next.js App Router + TypeScript + Tailwind CSS v4. A typed local data module (`lib/courses.ts`) stands in for the future Appwrite `workshops`/`workshopDates` collections — same shape, so Plan B swaps the data source without changing any component. Brevo's transactional email API powers the contact form.

**Tech Stack:** Next.js (App Router, latest), React, TypeScript, Tailwind CSS v4, Vitest + React Testing Library, `next/font/google` (Fraunces, Plus Jakarta Sans), Brevo transactional email API, `sharp` + `heic-convert` for the asset pipeline.

## Global Constraints

- **Palette** (exact hex, from the approved design brainstorm — "Herbal Olive"): `forest-900 #173A2C`, `olive-700 #3E5C3A`, `sage-500 #8A9A4E`, `cream-100 #EEEBDD`, `cream-50 #FBF8F1`, `ink-900 #2B2B22`, plus supporting `surface #FFFFFF` and `border #E3DFCF`.
- **Type:** display face Fraunces (headings only), body/UI face Plus Jakarta Sans (everything else). Always loaded via `next/font/google` — never a `<link>` tag in app code.
- **Signature element:** a 64px × 6px rounded accent bar in `sage-500`, placed directly under section eyebrows/headings — echoes the logo's O–A connecting arc. Implemented once in `SectionHeading`, reused everywhere a section title appears.
- **Home hero:** centered, text-forward layout with a 3-photo strip below the fold (approved layout "C" from the visual brainstorm).
- **Course detail page:** sticky sidebar (price + dates state), quiet (non-banner) "Dates Coming Soon" card, no email-capture/notify-me feature (explicitly out of scope).
- **No login/account/checkout/register CTA anywhere in this plan.** Those ship in Plan B. The course sidebar shows dates or the coming-soon card — never a dead-link button.
- **Money is stored and passed as integer cents** everywhere (`priceCents`), matching Stripe's convention for Plan B. Format for display only at render time via `formatPrice`.
- Source photography lives in the untracked top-level `images/`/`logo/` folders; only the processed output in `public/images/`/`public/logo/` is committed.
- Course/instructor copy in this plan is realistic placeholder text the user explicitly asked for (to review/replace before launch) — not a plan gap.
- Package manager: npm. Import alias: `@/*` → project root.

---

## File Structure

```
app/
  layout.tsx              Root layout: fonts, metadata, Header/Footer shell
  globals.css             Tailwind import + @theme design tokens
  page.tsx                Home
  not-found.tsx           Global 404
  about/page.tsx          About
  contact/page.tsx        Contact
  contact/actions.ts       Server action: validate + send contact message via Brevo
  courses/page.tsx        Courses list
  courses/[slug]/page.tsx  Course detail (Functional Acupressure today)

components/
  ui/            Button, Container, Card, Badge, SectionHeading (shared primitives)
  layout/        Header, Footer
  home/          Hero, PhotoStrip, ValueProps, FeaturedCourseSection
  about/         InstructorProfile (also reused on the course detail page)
  contact/       ContactForm
  courses/       CourseCard, CourseSidebar, DatesComingSoon, LearningObjectives

lib/
  types.ts                 Course/CourseDate/Instructor types
  courses.ts                Course data + getCourseBySlug/getFeaturedCourse/getPublishedDates
  format.ts                  formatPrice
  validateContactForm.ts       Contact form validation
  email.ts                     sendEmail() via Brevo

scripts/
  lib/filename.mjs        Pure filename-mapping helpers (unit tested)
  convert-images.mjs      Converts/compresses images/ + logo/ into public/

public/images/, public/logo/   Generated output (committed)
images/, logo/                  Raw sources (gitignored)
```

---

### Task 1: Project Scaffold & Tooling

**Files:**
- Create: full Next.js scaffold (`package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, ESLint config)
- Create: `vitest.config.ts`, `vitest.setup.ts`, `test/mocks/next-font-google.ts`
- Create: `app/layout.test.tsx`
- Modify: `.gitignore` (final authoritative version)

**Interfaces:**
- Produces: `app/layout.tsx` exporting `metadata` and a root layout that applies two CSS variables on `<html>`: `--font-fraunces` and `--font-plus-jakarta`. Every later task's typography depends on these two exact variable names.
- Produces: working `npm run dev`, `npm run build`, `npm run lint`, `npm test`.

- [ ] **Step 1: Scaffold Next.js into a temp dir, then move it into the project root**

The project root already contains `images/`, `logo/`, and a git repo, so `create-next-app` (which requires an empty target) can't run directly here. Scaffold into a temp dir and relocate:

```bash
set -e
PROJECT_DIR="$(pwd)"
SCAFFOLD_DIR="$(mktemp -d)"

npx --yes create-next-app@latest "$SCAFFOLD_DIR" \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --turbopack --use-npm

# Drop the scaffold's own git repo/node_modules — we keep our existing repo
# and do a clean install after moving.
rm -rf "$SCAFFOLD_DIR/.git" "$SCAFFOLD_DIR/node_modules"

shopt -s dotglob
mv "$SCAFFOLD_DIR"/* "$PROJECT_DIR"/
shopt -u dotglob
rm -rf "$SCAFFOLD_DIR"

cd "$PROJECT_DIR"
npm install
```

- [ ] **Step 2: Verify the scaffold builds**

Run: `npm run build`
Expected: succeeds with the default Next.js starter page.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Mock `next/font/google` for the test environment**

`next/font/google` requires the Next.js compiler and cannot be imported directly under Vitest — create a stub used only in tests:

```ts
// test/mocks/next-font-google.ts
export function Fraunces(_options: unknown) {
  return { className: 'mock-fraunces', variable: '--font-fraunces' }
}

export function Plus_Jakarta_Sans(_options: unknown) {
  return { className: 'mock-plus-jakarta', variable: '--font-plus-jakarta' }
}
```

- [ ] **Step 5: Configure Vitest**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'next/font/google': path.resolve(__dirname, './test/mocks/next-font-google.ts'),
    },
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: Add the test script**

Open `package.json` and add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 7: Write the failing metadata test**

```tsx
// app/layout.test.tsx
import { describe, it, expect } from 'vitest'
import { metadata } from './layout'

describe('root layout metadata', () => {
  it('sets the Osteo Academy site title', () => {
    expect(metadata.title).toBe('Osteo Academy | Continuing Education for Health Professionals')
  })

  it('sets a description mentioning health professionals', () => {
    expect(metadata.description).toContain('health professionals')
  })
})
```

Run: `npm test`
Expected: FAIL — the scaffold's default layout still has the "Create Next App" title.

- [ ] **Step 8: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

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
    'Hands-on workshops and online courses for health professionals. Learn. Understand. Apply. Transform.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 9: Replace `app/globals.css` (minimal for now — full theme in Task 2)**

```css
@import "tailwindcss";

html {
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-plus-jakarta), sans-serif;
}
```

- [ ] **Step 10: Replace `app/page.tsx` with a minimal placeholder (Task 5 replaces this fully)**

```tsx
export default function HomePage() {
  return (
    <main>
      <p>Osteo Academy — under construction.</p>
    </main>
  )
}
```

- [ ] **Step 11: Run the test again**

Run: `npm test`
Expected: PASS (2/2).

- [ ] **Step 12: Run lint and build**

Run: `npm run lint && npm run build`
Expected: both clean.

- [ ] **Step 13: Rewrite `.gitignore` with the final authoritative content**

```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# superpowers scratch (worktrees, brainstorm sessions, sdd progress ledger)
.superpowers/

# raw source photography — large/unprocessed, not needed at deploy time
/images/
/logo/
```

- [ ] **Step 14: Manual verification**

Run: `npm run dev`, open the site in a browser.
Expected: placeholder text renders, browser tab shows "Osteo Academy | Continuing Education for Health Professionals", no console errors. Stop the dev server.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, TypeScript, and Vitest"
```

---

### Task 2: Design Tokens & Shared UI Primitives

**Files:**
- Modify: `app/globals.css` (full `@theme` token block)
- Modify: `app/layout.tsx` (render `Header`/`Footer` around `{children}`)
- Create: `components/ui/Button.logic.ts`, `components/ui/Button.logic.test.ts`
- Create: `components/ui/Button.tsx`, `components/ui/Button.test.tsx`
- Create: `components/ui/Container.tsx`, `components/ui/Card.tsx`, `components/ui/Badge.tsx`, `components/ui/SectionHeading.tsx`
- Create: `components/layout/Header.tsx`, `components/layout/Header.test.tsx`, `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `--font-fraunces`/`--font-plus-jakarta` CSS variables from Task 1's layout.
- Produces: Tailwind color utilities (`bg-forest-900`, `text-sage-500`, `bg-cream-50`, `bg-cream-100`, `text-ink-900`, `bg-surface`, `border-border`) and font utilities (`font-display`, `font-body`) used by every later task. Produces `<Button variant="primary"|"outline" size="md"|"sm">`, `<Container>`, `<Card>`, `<Badge>`, `<SectionHeading eyebrow title align?>`.

- [ ] **Step 1: Full design-token theme**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-forest-900: #173A2C;
  --color-olive-700: #3E5C3A;
  --color-sage-500: #8A9A4E;
  --color-cream-100: #EEEBDD;
  --color-cream-50: #FBF8F1;
  --color-ink-900: #2B2B22;
  --color-surface: #FFFFFF;
  --color-border: #E3DFCF;

  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-plus-jakarta), Arial, sans-serif;
}

html {
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--color-cream-50);
  color: var(--color-ink-900);
  font-family: var(--font-body);
}
```

- [ ] **Step 2: Write the failing Button logic test**

```ts
// components/ui/Button.logic.test.ts
import { describe, it, expect } from 'vitest'
import { getButtonClasses } from './Button.logic'

describe('getButtonClasses', () => {
  it('defaults to primary/md', () => {
    const classes = getButtonClasses()
    expect(classes).toContain('bg-forest-900')
    expect(classes).toContain('px-5')
  })

  it('applies outline variant classes', () => {
    expect(getButtonClasses('outline')).toContain('border-forest-900')
  })

  it('applies sm size classes', () => {
    expect(getButtonClasses('primary', 'sm')).toContain('px-4')
  })
})
```

Run: `npm test -- Button.logic` — expect FAIL (module doesn't exist).

- [ ] **Step 3: Implement Button logic**

```ts
// components/ui/Button.logic.ts
export type ButtonVariant = 'primary' | 'outline'
export type ButtonSize = 'md' | 'sm'

const base =
  'inline-flex items-center justify-center rounded-md font-body font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-forest-900 text-cream-50 hover:bg-olive-700',
  outline: 'bg-transparent text-forest-900 border border-forest-900 hover:bg-cream-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
}

export function getButtonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return [base, variantClasses[variant], sizeClasses[size]].join(' ')
}
```

Run: `npm test -- Button.logic` — expect PASS.

- [ ] **Step 4: Write the failing Button component test**

```tsx
// components/ui/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders an anchor when href is provided', () => {
    render(<Button href="/courses">Explore Courses</Button>)
    const link = screen.getByRole('link', { name: 'Explore Courses' })
    expect(link).toHaveAttribute('href', '/courses')
  })

  it('renders a submit button when type="submit"', () => {
    render(<Button type="submit">Send</Button>)
    const button = screen.getByRole('button', { name: 'Send' })
    expect(button).toHaveAttribute('type', 'submit')
  })
})
```

Run: `npm test -- Button.test` — expect FAIL (module doesn't exist).

- [ ] **Step 5: Implement Button**

```tsx
// components/ui/Button.tsx
import Link from 'next/link'
import { getButtonClasses, type ButtonVariant, type ButtonSize } from './Button.logic'

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type Props =
  | (BaseProps & { href: string; type?: undefined; disabled?: undefined })
  | (BaseProps & { href?: undefined; type?: 'button' | 'submit'; disabled?: boolean })

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const classes = `${getButtonClasses(variant, size)} ${className}`.trim()

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={props.type ?? 'button'} disabled={props.disabled} className={classes}>
      {children}
    </button>
  )
}
```

Run: `npm test -- Button.test` — expect PASS.

- [ ] **Step 6: Implement the remaining presentational primitives**

```tsx
// components/ui/Container.tsx
export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`.trim()}>{children}</div>
}
```

```tsx
// components/ui/Card.tsx
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-6 ${className}`.trim()}>
      {children}
    </div>
  )
}
```

```tsx
// components/ui/Badge.tsx
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-olive-700">
      {children}
    </span>
  )
}
```

```tsx
// components/ui/SectionHeading.tsx
export function SectionHeading({
  eyebrow,
  title,
  align = 'left',
}: {
  eyebrow: string
  title: string
  align?: 'left' | 'center'
}) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-medium text-forest-900 md:text-4xl">{title}</h2>
      <span className="mt-4 h-1.5 w-16 rounded-full bg-sage-500" aria-hidden="true" />
    </div>
  )
}
```

- [ ] **Step 7: Write the failing Header test**

```tsx
// components/layout/Header.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

describe('Header', () => {
  it('renders the primary nav links', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: 'Courses' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0)
  })

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })
})
```

Run: `npm test -- Header.test` — expect FAIL.

- [ ] **Step 8: Implement Header**

```tsx
// components/layout/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
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
        <Link href="/" className="font-display text-xl font-semibold text-forest-900">
          Osteo Academy
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
```

Run: `npm test -- Header.test` — expect PASS.

- [ ] **Step 9: Implement Footer**

```tsx
// components/layout/Footer.tsx
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
```

- [ ] **Step 10: Wire Header/Footer into the root layout**

In `app/layout.tsx`, add the imports and update the body:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
```

```tsx
<body>
  <Header />
  {children}
  <Footer />
</body>
```

- [ ] **Step 11: Run full checks**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 12: Manual verification**

Run: `npm run dev`. Confirm the header (with working mobile menu at a narrow viewport width) and footer render around the Task 1 placeholder text, in the cream/forest-green/sage palette with Fraunces on the "Osteo Academy" wordmark.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and shared UI primitives"
```

---

### Task 3: Asset Pipeline

**Files:**
- Create: `scripts/lib/filename.mjs`, `scripts/lib/filename.test.mjs`
- Create: `scripts/convert-images.mjs`
- Modify: `package.json` (add `sharp`, `heic-convert`; add `images:convert` script)

**Interfaces:**
- Produces: `public/images/*.jpg` and `public/logo/*.jpg`, named via `outputFileNameFor()` (lowercase, non-alphanumeric runs collapsed to `-`, always `.jpg`). Task 4's instructor photo path and Task 5's photo strip paths depend on this exact naming.

- [ ] **Step 1: Write the failing filename-mapping tests**

```js
// scripts/lib/filename.test.mjs
import { describe, it, expect } from 'vitest'
import { isDuplicateFile, outputFileNameFor } from './filename.mjs'

describe('isDuplicateFile', () => {
  it('flags OS-style duplicate suffixes', () => {
    expect(isDuplicateFile('IMG_2163(1).HEIC')).toBe(true)
  })

  it('does not flag normal filenames', () => {
    expect(isDuplicateFile('IMG_2163.HEIC')).toBe(false)
  })
})

describe('outputFileNameFor', () => {
  it('lowercases and normalizes an IMG_ style name to .jpg', () => {
    expect(outputFileNameFor('IMG_2777.JPG')).toBe('img-2777.jpg')
  })

  it('normalizes a camera-style name to .jpg', () => {
    expect(outputFileNameFor('6F1A9503.jpeg')).toBe('6f1a9503.jpg')
  })

  it('normalizes a HEIC name to .jpg', () => {
    expect(outputFileNameFor('IMG_2058.HEIC')).toBe('img-2058.jpg')
  })
})
```

Run: `npm test -- filename` — expect FAIL (module doesn't exist).

- [ ] **Step 2: Implement the filename helpers**

```js
// scripts/lib/filename.mjs
const DUPLICATE_SUFFIX = /\(\d+\)(?=\.[^.]+$)/

export function isDuplicateFile(fileName) {
  return DUPLICATE_SUFFIX.test(fileName)
}

export function outputFileNameFor(sourceFileName) {
  const dotIndex = sourceFileName.lastIndexOf('.')
  const base = sourceFileName.slice(0, dotIndex)
  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${normalized}.jpg`
}
```

Run: `npm test -- filename` — expect PASS.

- [ ] **Step 3: Install image processing dependencies**

```bash
npm install sharp heic-convert
```

- [ ] **Step 4: Implement the conversion script**

```js
// scripts/convert-images.mjs
#!/usr/bin/env node
import { readdir, mkdir, readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'
import convert from 'heic-convert'
import { isDuplicateFile, outputFileNameFor } from './lib/filename.mjs'

const MAX_WIDTH = 2400
const JPEG_QUALITY = 82

const SOURCES = [
  { srcDir: 'images', outDir: 'public/images' },
  { srcDir: 'logo', outDir: 'public/logo' },
]

async function convertOne(srcPath, outPath) {
  const ext = extname(srcPath).toLowerCase()
  const inputBuffer = await readFile(srcPath)

  const jpegBuffer =
    ext === '.heic'
      ? Buffer.from(await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 }))
      : inputBuffer

  await sharp(jpegBuffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath)
}

async function processDir({ srcDir, outDir }) {
  await mkdir(outDir, { recursive: true })
  const entries = await readdir(srcDir)

  let converted = 0
  let skipped = 0

  for (const fileName of entries) {
    if (isDuplicateFile(fileName)) {
      skipped += 1
      continue
    }

    const srcPath = join(srcDir, fileName)
    const info = await stat(srcPath)
    if (!info.isFile()) continue

    const outPath = join(outDir, outputFileNameFor(fileName))
    await convertOne(srcPath, outPath)
    converted += 1
    console.log(`converted ${fileName} -> ${outPath}`)
  }

  console.log(`${srcDir}: converted ${converted}, skipped ${skipped} duplicate(s)`)
}

for (const source of SOURCES) {
  await processDir(source)
}
```

- [ ] **Step 5: Add the npm script**

Add to `package.json` `"scripts"`:

```json
"images:convert": "node scripts/convert-images.mjs"
```

- [ ] **Step 6: Run the pipeline for real**

Run: `npm run images:convert`
Expected: `public/images/` and `public/logo/` populate with `.jpg` files; console shows converted/skipped counts for both source directories.

- [ ] **Step 7: Spot-check the output**

Open two or three generated files (including one that was originally `.HEIC`) to confirm they're valid, correctly oriented, and well under 500KB each given the 2400px width cap and quality 82 setting.

- [ ] **Step 8: Run full checks**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 9: Commit**

This commits the generated `public/images/`/`public/logo/` output (intended — see Global Constraints).

```bash
git add -A
git commit -m "feat: add image conversion pipeline and generate optimized assets"
```

---

### Task 4: Course Data Layer & Shared Utilities

**Files:**
- Create: `lib/types.ts`
- Create: `lib/courses.ts`, `lib/courses.test.ts`
- Create: `lib/format.ts`, `lib/format.test.ts`

**Interfaces:**
- Consumes: `public/images/6f1a9503.jpg` etc. from Task 3's naming convention.
- Produces: `Course`, `CourseDate`, `Instructor` types; `COURSES`, `getCourseBySlug(slug)`, `getFeaturedCourse()`, `getPublishedDates(course)`, `formatPrice(cents)` — used by every page task from here on.

- [ ] **Step 1: Write the failing course data tests**

```ts
// lib/courses.test.ts
import { describe, it, expect } from 'vitest'
import { getCourseBySlug, getFeaturedCourse, getPublishedDates } from './courses'

describe('getCourseBySlug', () => {
  it('finds the Functional Acupressure course', () => {
    expect(getCourseBySlug('functional-acupressure')?.title).toBe('Functional Acupressure')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getCourseBySlug('does-not-exist')).toBeUndefined()
  })
})

describe('getFeaturedCourse', () => {
  it('returns the Functional Acupressure course', () => {
    expect(getFeaturedCourse().slug).toBe('functional-acupressure')
  })
})

describe('getPublishedDates', () => {
  it('returns an empty array when no dates are published', () => {
    expect(getPublishedDates(getFeaturedCourse())).toEqual([])
  })

  it('filters out unpublished dates', () => {
    const course = {
      ...getFeaturedCourse(),
      dates: [
        { id: '1', date: '2026-09-01', location: 'Denver, CO', published: true },
        { id: '2', date: '2026-10-01', location: 'Austin, TX', published: false },
      ],
    }
    expect(getPublishedDates(course)).toHaveLength(1)
    expect(getPublishedDates(course)[0].id).toBe('1')
  })
})
```

Run: `npm test -- courses` — expect FAIL (module doesn't exist).

- [ ] **Step 2: Implement types and course data**

```ts
// lib/types.ts
export type CourseFormat = 'in-person' | 'online'

export type CourseDate = {
  id: string
  date: string
  location: string
  published: boolean
}

export type Instructor = {
  name: string
  credentials: string
  bio: string
  photo: string
}

export type Course = {
  slug: string
  title: string
  tagline: string
  format: CourseFormat
  priceCents: number
  description: string[]
  learningObjectives: string[]
  instructor: Instructor
  dates: CourseDate[]
}
```

```ts
// lib/courses.ts
import type { Course, CourseDate } from './types'

export const COURSES: Course[] = [
  {
    slug: 'functional-acupressure',
    title: 'Functional Acupressure',
    tagline: 'Hands-on technique for real functional outcomes',
    format: 'in-person',
    priceCents: 49500,
    description: [
      'Functional Acupressure is a one-day, hands-on workshop designed for licensed health professionals who want to add a precise, evidence-informed acupressure technique to their clinical toolkit.',
      'Rather than treating acupressure as an isolated modality, this course frames each technique within a functional movement context — connecting point selection to the assessment findings you already use every day.',
      "Through guided practice, case-based discussion, and instructor feedback, you'll leave with a repeatable framework you can apply in your very next patient session.",
    ],
    learningObjectives: [
      'Assess common functional movement restrictions relevant to acupressure technique',
      'Apply core acupressure points with correct depth, angle, and sequencing',
      "Build a session-length treatment sequence tailored to a patient's presentation",
      'Integrate acupressure technique alongside existing manual therapy approaches',
      'Recognize contraindications and safety considerations for acupressure practice',
    ],
    instructor: {
      name: 'Dr. Alex Rivera, DO',
      credentials: 'Osteopathic Physician',
      bio: 'Dr. Alex Rivera is a licensed osteopathic physician with over a decade of clinical experience integrating manual therapy and functional movement assessment into patient care. Alex has taught continuing education workshops across the country, focused on making manual technique clinically practical and immediately applicable.',
      photo: '/images/6f1a9503.jpg',
    },
    dates: [],
  },
]

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug)
}

export function getFeaturedCourse(): Course {
  return COURSES[0]
}

export function getPublishedDates(course: Course): CourseDate[] {
  return course.dates.filter((date) => date.published)
}
```

Run: `npm test -- courses` — expect PASS.

> Placeholder content note: title, description, learning objectives, instructor name/bio, and price are realistic drafts for the user to review and replace — not final copy.

- [ ] **Step 3: Write the failing formatPrice tests**

```ts
// lib/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats a whole-dollar amount without cents', () => {
    expect(formatPrice(49500)).toBe('$495')
  })

  it('formats an amount with cents', () => {
    expect(formatPrice(4999)).toBe('$49.99')
  })

  it('formats zero as $0', () => {
    expect(formatPrice(0)).toBe('$0')
  })
})
```

Run: `npm test -- format` — expect FAIL.

- [ ] **Step 4: Implement formatPrice**

```ts
// lib/format.ts
export function formatPrice(cents: number): string {
  const dollars = cents / 100
  const hasCents = cents % 100 !== 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(dollars)
}
```

Run: `npm test -- format` — expect PASS.

- [ ] **Step 5: Run full checks and commit**

```bash
npm test && npm run lint && npm run build
git add -A
git commit -m "feat: add course data layer and formatting utilities"
```

---

### Task 5: Home Page

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/PhotoStrip.tsx`, `components/home/ValueProps.tsx`, `components/home/FeaturedCourseSection.tsx`
- Modify: `app/page.tsx`
- Create: `app/page.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedCourse`, `formatPrice` (Task 4); `Button`, `Container`, `Card`, `Badge`, `SectionHeading` (Task 2); `public/images/6f1a9503.jpg`, `6f1a9529.jpg`, `6f1a9506.jpg` (Task 3).

- [ ] **Step 1: Write the failing Home page test**

```tsx
// app/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  it('renders the hero headline', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Learn. Understand. Apply. Transform.' })).toBeInTheDocument()
  })

  it('links to the Functional Acupressure course from the featured section', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: 'View Course Details' })).toHaveAttribute(
      'href',
      '/courses/functional-acupressure',
    )
  })

  it('shows the featured course price', () => {
    render(<HomePage />)
    expect(screen.getByText('$495')).toBeInTheDocument()
  })
})
```

Run: `npm test -- app/page` — expect FAIL.

- [ ] **Step 2: Implement Hero**

```tsx
// components/home/Hero.tsx
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
```

- [ ] **Step 3: Implement PhotoStrip**

```tsx
// components/home/PhotoStrip.tsx
import Image from 'next/image'

const PHOTOS = [
  { src: '/images/6f1a9503.jpg', alt: 'Instructor demonstrating a cervical technique on a client' },
  { src: '/images/6f1a9529.jpg', alt: 'Instructor demonstrating a hip-focused technique on a client' },
  { src: '/images/6f1a9506.jpg', alt: 'Hands-on practice during an Osteo Academy workshop' },
]

export function PhotoStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {PHOTOS.map((photo) => (
        <div key={photo.src} className="relative h-64 overflow-hidden rounded-lg">
          <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Implement ValueProps**

```tsx
// components/home/ValueProps.tsx
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'

const VALUE_PROPS = [
  { title: 'Taught by practitioners', body: 'Every course is built and taught by professionals who use these techniques in real clinical practice.' },
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
```

- [ ] **Step 5: Implement FeaturedCourseSection**

```tsx
// components/home/FeaturedCourseSection.tsx
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { getFeaturedCourse } from '@/lib/courses'

export function FeaturedCourseSection() {
  const course = getFeaturedCourse()

  return (
    <section className="bg-cream-100 py-20">
      <Container>
        <SectionHeading eyebrow="Featured Workshop" title={course.title} />
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <p className="max-w-xl font-body text-base leading-relaxed text-ink-900">{course.tagline}</p>
          <div className="flex items-center gap-4">
            <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
            <span className="font-display text-2xl text-forest-900">{formatPrice(course.priceCents)}</span>
          </div>
        </div>
        <div className="mt-8">
          <Button href={`/courses/${course.slug}`}>View Course Details</Button>
        </div>
      </Container>
    </section>
  )
}
```

- [ ] **Step 6: Compose the Home page**

```tsx
// app/page.tsx
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
```

Run: `npm test -- app/page` — expect PASS.

- [ ] **Step 7: Run full checks**

Run: `npm test && npm run lint && npm run build`

- [ ] **Step 8: Manual verification**

Run: `npm run dev`. Confirm the centered hero, the 3-photo strip (real converted photos, not broken images), the featured Functional Acupressure section, and the value props grid all render correctly at mobile/tablet/desktop widths.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build the Home page"
```

---

### Task 6: About Page

**Files:**
- Create: `components/about/InstructorProfile.tsx`
- Create: `app/about/page.tsx`, `app/about/page.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedCourse` (Task 4); `Container`, `SectionHeading` (Task 2).
- Produces: `<InstructorProfile instructor={...} />` — Task 8's course detail page reuses this exact component.

- [ ] **Step 1: Write the failing About page test**

```tsx
// app/about/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from './page'

describe('AboutPage', () => {
  it('renders the mission statement heading', () => {
    render(<AboutPage />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Practical continuing education, built by practitioners' }),
    ).toBeInTheDocument()
  })

  it("renders the featured course's instructor name", () => {
    render(<AboutPage />)
    expect(screen.getByText('Dr. Alex Rivera, DO')).toBeInTheDocument()
  })
})
```

Run: `npm test -- app/about` — expect FAIL.

- [ ] **Step 2: Implement InstructorProfile**

```tsx
// components/about/InstructorProfile.tsx
import Image from 'next/image'
import type { Instructor } from '@/lib/types'

export function InstructorProfile({ instructor }: { instructor: Instructor }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full">
        <Image src={instructor.photo} alt={instructor.name} fill className="object-cover" />
      </div>
      <div>
        <h3 className="font-display text-2xl text-forest-900">{instructor.name}</h3>
        <p className="mt-1 font-body text-sm font-semibold uppercase tracking-wide text-sage-500">
          {instructor.credentials}
        </p>
        <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-ink-900">{instructor.bio}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Implement the About page**

```tsx
// app/about/page.tsx
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { InstructorProfile } from '@/components/about/InstructorProfile'
import { getFeaturedCourse } from '@/lib/courses'

export default function AboutPage() {
  const { instructor } = getFeaturedCourse()

  return (
    <main className="py-20">
      <Container>
        <SectionHeading eyebrow="About Osteo Academy" title="Practical continuing education, built by practitioners" />
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-900">
          Osteo Academy exists to help licensed health professionals build real, applicable clinical skill — through
          hands-on in-person workshops today, and self-paced online courses soon. Every course is designed around a
          simple idea: learn it, understand why it works, apply it with a real patient, and let it transform your
          practice.
        </p>

        <div className="mt-16">
          <SectionHeading eyebrow="Meet the Instructor" title="Your instructor" />
          <div className="mt-8">
            <InstructorProfile instructor={instructor} />
          </div>
        </div>
      </Container>
    </main>
  )
}
```

Run: `npm test -- app/about` — expect PASS.

- [ ] **Step 4: Run full checks**

Run: `npm test && npm run lint && npm run build`

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open `/about`, confirm the mission copy and instructor profile (photo, name, credentials, bio) render correctly.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: build the About page"
```

---

### Task 7: Contact Page + Brevo Email

**Files:**
- Create: `lib/validateContactForm.ts`, `lib/validateContactForm.test.ts`
- Create: `lib/email.ts`, `lib/email.test.ts`
- Create: `app/contact/actions.ts`, `app/contact/actions.test.ts`
- Create: `components/contact/ContactForm.tsx`
- Create: `app/contact/page.tsx`, `app/contact/page.test.tsx`
- Create: `.env.example`

**Interfaces:**
- Produces: `submitContactForm(prevState, formData)` server action returning `{ status: 'idle'|'success'|'error', errors, message? }`, consumed by `ContactForm`.
- Requires env vars at runtime (not build time): `BREVO_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. These are supplied later, at the credentials checkpoint — all tests in this task mock the network call, so nothing here requires real credentials to pass.

- [ ] **Step 1: Write the failing validation tests**

```ts
// lib/validateContactForm.test.ts
import { describe, it, expect } from 'vitest'
import { validateContactForm } from './validateContactForm'

describe('validateContactForm', () => {
  it('returns no errors for valid input', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' })).toEqual({})
  })

  it('requires a name', () => {
    expect(validateContactForm({ name: '', email: 'jamie@example.com', message: 'Hi' }).name).toBeDefined()
  })

  it('requires a valid email format', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'not-an-email', message: 'Hi' }).email).toBeDefined()
  })

  it('requires a message', () => {
    expect(validateContactForm({ name: 'Jamie', email: 'jamie@example.com', message: '' }).message).toBeDefined()
  })
})
```

Run: `npm test -- validateContactForm` — expect FAIL.

- [ ] **Step 2: Implement validation**

```ts
// lib/validateContactForm.ts
export type ContactFormInput = {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormInput, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(input: ContactFormInput): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Please enter your name.'
  }

  if (!input.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!input.message.trim()) {
    errors.message = 'Please enter a message.'
  }

  return errors
}
```

Run: `npm test -- validateContactForm` — expect PASS.

- [ ] **Step 3: Write the failing email tests**

```ts
// lib/email.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendEmail } from './email'

describe('sendEmail', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_KEY', 'test-key')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'no-reply@osteoacademy.test')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('posts to the Brevo transactional email endpoint with the expected payload', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 201 }))

    await sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' })

    expect(fetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'api-key': 'test-key' }),
      }),
    )
  })

  it('throws when Brevo responds with a non-OK status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('bad request', { status: 400 }))

    await expect(
      sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' }),
    ).rejects.toThrow('Brevo request failed')
  })

  it('throws when required env vars are missing', async () => {
    vi.stubEnv('BREVO_API_KEY', '')

    await expect(
      sendEmail({ to: 'hello@osteoacademy.test', subject: 'New message', html: '<p>Hi</p>' }),
    ).rejects.toThrow('Email is not configured')
  })
})
```

Run: `npm test -- email` — expect FAIL.

- [ ] **Step 4: Implement sendEmail**

```ts
// lib/email.ts
type SendEmailInput = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    throw new Error('Email is not configured: missing BREVO_API_KEY or CONTACT_FROM_EMAIL.')
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { name: 'Osteo Academy Website', email: fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo request failed (${response.status}): ${body}`)
  }
}
```

Run: `npm test -- email` — expect PASS.

- [ ] **Step 5: Write the failing server action tests**

```ts
// app/contact/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContactForm, type ContactFormState } from './actions'
import { sendEmail } from '@/lib/email'

vi.mock('@/lib/email', () => ({ sendEmail: vi.fn() }))

const initialState: ContactFormState = { status: 'idle', errors: {} }

function formData(fields: Record<string, string>) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe('submitContactForm', () => {
  beforeEach(() => {
    vi.mocked(sendEmail).mockReset()
    vi.stubEnv('CONTACT_TO_EMAIL', 'hello@osteoacademy.test')
  })

  it('returns validation errors without sending an email', async () => {
    const result = await submitContactForm(initialState, formData({ name: '', email: '', message: '' }))
    expect(result.status).toBe('error')
    expect(result.errors.name).toBeDefined()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('sends an email and returns success for valid input', async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined)
    const result = await submitContactForm(
      initialState,
      formData({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' }),
    )
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'hello@osteoacademy.test', subject: 'New contact form message from Jamie' }),
    )
    expect(result.status).toBe('success')
  })

  it('returns an error state when sendEmail throws', async () => {
    vi.mocked(sendEmail).mockRejectedValue(new Error('network down'))
    const result = await submitContactForm(
      initialState,
      formData({ name: 'Jamie', email: 'jamie@example.com', message: 'Hello!' }),
    )
    expect(result.status).toBe('error')
  })
})
```

Run: `npm test -- app/contact/actions` — expect FAIL.

- [ ] **Step 6: Implement the server action**

```ts
// app/contact/actions.ts
'use server'

import { validateContactForm, type ContactFormErrors } from '@/lib/validateContactForm'
import { sendEmail } from '@/lib/email'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors: ContactFormErrors
  message?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const input = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  const errors = validateContactForm(input)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors }
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  if (!toEmail) {
    return { status: 'error', errors: {}, message: 'This form is not fully configured yet — please email us directly.' }
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `New contact form message from ${input.name}`,
      html: `<p><strong>From:</strong> ${input.name} (${input.email})</p><p>${input.message}</p>`,
    })
  } catch {
    return { status: 'error', errors: {}, message: 'Something went wrong sending your message. Please try again shortly.' }
  }

  return { status: 'success', errors: {} }
}
```

Run: `npm test -- app/contact/actions` — expect PASS.

- [ ] **Step 7: Implement ContactForm and the Contact page**

```tsx
// components/contact/ContactForm.tsx
'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitContactForm, type ContactFormState } from '@/app/contact/actions'

const initialState: ContactFormState = { status: 'idle', errors: {} }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  if (state.status === 'success') {
    return <p className="font-body text-base text-forest-900">Thanks for reaching out — we&apos;ll get back to you soon.</p>
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="font-body text-sm font-medium text-ink-900">Name</label>
        <input id="name" name="name" type="text" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.name && <p className="mt-1 text-sm text-red-700">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="font-body text-sm font-medium text-ink-900">Email</label>
        <input id="email" name="email" type="email" className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.email && <p className="mt-1 text-sm text-red-700">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="font-body text-sm font-medium text-ink-900">Message</label>
        <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2 font-body text-sm" />
        {state.errors.message && <p className="mt-1 text-sm text-red-700">{state.errors.message}</p>}
      </div>

      {state.message && <p className="font-body text-sm text-red-700">{state.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

```tsx
// app/contact/page.tsx
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
```

```tsx
// app/contact/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage from './page'

describe('ContactPage', () => {
  it('renders the contact form fields', () => {
    render(<ContactPage />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Document required env vars**

```
# .env.example
BREVO_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

- [ ] **Step 9: Run full checks**

Run: `npm test && npm run lint && npm run build`

- [ ] **Step 10: Manual verification**

Run: `npm run dev`, open `/contact`. Submit the form empty and confirm validation errors appear. Submit valid input — since no `.env.local` exists yet, confirm the graceful "not fully configured yet" message appears rather than a crash. Live sending is verified later, once real Brevo credentials are supplied at the checkpoint.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: build the Contact page with Brevo email integration"
```

---

### Task 8: Courses List Page + Functional Acupressure Detail Page

**Files:**
- Create: `components/courses/CourseCard.tsx`, `components/courses/DatesComingSoon.tsx`, `components/courses/CourseSidebar.tsx`, `components/courses/LearningObjectives.tsx`
- Create: `app/courses/page.tsx`, `app/courses/page.test.tsx`
- Create: `app/courses/[slug]/page.tsx`, `app/courses/[slug]/page.test.tsx`
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: `COURSES`, `getCourseBySlug`, `getPublishedDates` (Task 4); `InstructorProfile` (Task 6); `Badge`, `Button`, `Card`, `Container`, `SectionHeading` (Task 2).

- [ ] **Step 1: Write the failing Courses list test**

```tsx
// app/courses/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoursesPage from './page'

describe('CoursesPage', () => {
  it('lists the Functional Acupressure course with a link to its detail page', () => {
    render(<CoursesPage />)
    const link = screen.getByRole('link', { name: /Functional Acupressure/ })
    expect(link).toHaveAttribute('href', '/courses/functional-acupressure')
  })
})
```

Run: `npm test -- app/courses/page` — expect FAIL.

- [ ] **Step 2: Implement CourseCard and the Courses list page**

```tsx
// components/courses/CourseCard.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/format'
import type { Course } from '@/lib/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
        <h3 className="mt-4 font-display text-2xl text-forest-900">{course.title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink-900">{course.tagline}</p>
        <p className="mt-4 font-display text-lg text-forest-900">{formatPrice(course.priceCents)}</p>
      </Card>
    </Link>
  )
}
```

```tsx
// app/courses/page.tsx
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CourseCard } from '@/components/courses/CourseCard'
import { COURSES } from '@/lib/courses'

export default function CoursesPage() {
  return (
    <main className="py-20">
      <Container>
        <SectionHeading eyebrow="Courses" title="Workshops and courses for health professionals" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Container>
    </main>
  )
}
```

Run: `npm test -- app/courses/page` — expect PASS.

- [ ] **Step 3: Write the failing course detail test**

```tsx
// app/courses/[slug]/page.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CourseDetailPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('CourseDetailPage', () => {
  it('renders the Functional Acupressure course content', async () => {
    const Page = await CourseDetailPage({ params: Promise.resolve({ slug: 'functional-acupressure' }) })
    render(Page)

    expect(screen.getByRole('heading', { level: 1, name: 'Functional Acupressure' })).toBeInTheDocument()
    expect(screen.getByText('Dates Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('Dr. Alex Rivera, DO')).toBeInTheDocument()
  })

  it('calls notFound for an unknown slug', async () => {
    await expect(CourseDetailPage({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })
})
```

Run: `npm test -- app/courses/\[slug\]` — expect FAIL.

- [ ] **Step 4: Implement the remaining course-detail components**

```tsx
// components/courses/DatesComingSoon.tsx
export function DatesComingSoon() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-cream-100 p-4">
      <p className="font-body text-sm font-bold text-forest-900">Dates Coming Soon</p>
      <p className="mt-1 font-body text-sm leading-relaxed text-ink-900">
        New workshop dates are posted here as soon as they&apos;re confirmed — check back soon.
      </p>
    </div>
  )
}
```

```tsx
// components/courses/CourseSidebar.tsx
import { DatesComingSoon } from './DatesComingSoon'
import { formatPrice } from '@/lib/format'
import { getPublishedDates } from '@/lib/courses'
import type { Course } from '@/lib/types'

export function CourseSidebar({ course }: { course: Course }) {
  const dates = getPublishedDates(course)

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="font-display text-3xl font-semibold text-forest-900">{formatPrice(course.priceCents)}</p>
      <p className="mt-1 font-body text-xs text-ink-900/70">
        per attendee &middot; {course.format === 'in-person' ? 'in-person' : 'online'}
      </p>

      <div className="mt-5">
        {dates.length === 0 ? (
          <DatesComingSoon />
        ) : (
          <ul className="flex flex-col gap-3">
            {dates.map((date) => (
              <li key={date.id} className="rounded-md border border-border p-3">
                <p className="font-body text-sm font-semibold text-forest-900">{date.date}</p>
                <p className="font-body text-xs text-ink-900/70">{date.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 font-body text-xs text-ink-900/70">Instructor: {course.instructor.name}</p>
    </div>
  )
}
```

Note: no "Register"/"Notify me" button is rendered here even when dates are empty — real registration requires accounts + Stripe, which ship in Plan B. A disabled or dead-link button here would be a half-finished feature.

```tsx
// components/courses/LearningObjectives.tsx
export function LearningObjectives({ objectives }: { objectives: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {objectives.map((objective) => (
        <li key={objective} className="flex gap-3 font-body text-sm leading-relaxed text-ink-900">
          <span className="mt-1 text-sage-500" aria-hidden="true">&#10003;</span>
          <span>{objective}</span>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Implement the course detail page and the global 404**

```tsx
// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { LearningObjectives } from '@/components/courses/LearningObjectives'
import { CourseSidebar } from '@/components/courses/CourseSidebar'
import { InstructorProfile } from '@/components/about/InstructorProfile'
import { COURSES, getCourseBySlug } from '@/lib/courses'

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }))
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  return (
    <main className="py-20">
      <Container className="flex flex-col gap-12 md:flex-row md:items-start">
        <div className="flex-1">
          <Badge>{course.format === 'in-person' ? 'In-Person Workshop' : 'Online Course'}</Badge>
          <h1 className="mt-4 font-display text-4xl font-medium text-forest-900">{course.title}</h1>
          <p className="mt-3 font-body text-base text-ink-900">{course.tagline}</p>

          <div className="mt-10 flex flex-col gap-4">
            {course.description.map((paragraph, index) => (
              <p key={index} className="font-body text-base leading-relaxed text-ink-900">{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <SectionHeading eyebrow="Curriculum" title="What you'll learn" />
            <div className="mt-6">
              <LearningObjectives objectives={course.learningObjectives} />
            </div>
          </div>

          <div className="mt-10">
            <SectionHeading eyebrow="Your Instructor" title="Meet your instructor" />
            <div className="mt-6">
              <InstructorProfile instructor={course.instructor} />
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 md:shrink-0">
          <div className="md:sticky md:top-8">
            <CourseSidebar course={course} />
          </div>
        </div>
      </Container>
    </main>
  )
}
```

```tsx
// app/not-found.tsx
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="py-32 text-center">
      <Container className="flex flex-col items-center">
        <h1 className="font-display text-3xl text-forest-900">Page not found</h1>
        <p className="mt-4 font-body text-base text-ink-900">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </Container>
    </main>
  )
}
```

Run: `npm test -- app/courses` — expect PASS.

- [ ] **Step 6: Run full checks**

Run: `npm test && npm run lint && npm run build`

- [ ] **Step 7: Manual verification**

Run: `npm run dev`. Visit `/courses`, confirm the Functional Acupressure card, click through to `/courses/functional-acupressure`. Confirm the sticky sidebar behavior while scrolling, the quiet "Dates Coming Soon" card, the learning objectives checklist, and the instructor bio with photo. Visit `/courses/nope` and confirm the custom 404 page renders. Check mobile width — sidebar should stack below the main content.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: build the Courses list and Functional Acupressure detail page"
```

---

### Task 9: Final Integration Pass

**Files:** none new — verification and any small fixes surfaced by the walkthrough.

- [ ] **Step 1: Full automated check**

Run: `npm test && npm run lint && npm run build`
Expected: all clean.

- [ ] **Step 2: Full manual walkthrough**

Run: `npm run dev` and click through: Home → Courses → Functional Acupressure detail page → About → Contact (submit invalid data, then valid data and confirm the graceful not-configured message) → an invalid course URL (404 page). Confirm no console errors/warnings at any step.

- [ ] **Step 3: Responsive check**

Using the browser's device toolbar, check Home, Courses list, and the course detail page (sidebar stacking) at mobile, tablet, and desktop widths. Confirm the header's mobile menu opens/closes correctly.

- [ ] **Step 4: Fix anything found**

Address any issues surfaced above; re-run the relevant automated checks and the affected part of the walkthrough.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: final integration pass for the foundation site"
```
