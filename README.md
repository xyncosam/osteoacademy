# Osteo Academy

Marketing site and course platform for Osteo Academy, a continuing-education
site for health professionals. Flagship offering is **Dynamic Acupressure**,
a self-paced online course taught by Alexey Soshalskiy. There are no
in-person workshops.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4 (`@theme` tokens in `app/globals.css`)
- Vitest + React Testing Library
- Brevo for transactional email (contact form, course enrollment-interest capture)
- Hosted on Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in:

- `BREVO_API_KEY` — Brevo transactional email API key
- `CONTACT_FROM_EMAIL` — sender address for outgoing emails
- `CONTACT_TO_EMAIL` — inbox that receives contact form submissions and
  course "notify me" signups

Without these set, the contact form and course notify-me form still render
and validate correctly, but return a friendly "not configured yet" message
instead of sending.

## Scripts

```bash
npm test              # vitest
npm run lint           # eslint
npm run build           # next build
npm run images:convert  # convert/compress source images in images/ into public/
```

## Deployment

Cloudflare Workers Builds auto-deploys on every push to `main` via GitHub
integration — there is no local `wrangler deploy` step in the normal
workflow. (Local Wrangler/OpenNext preview and deploy are unsupported on
Windows ARM64, since there's no `workerd` build for that target; `npm run
preview` / `npm run deploy` work from a supported platform if ever needed.)

## Project structure

- `app/` — routes (Home, Courses, course detail, About, Contact) and server actions
- `components/` — UI primitives (`ui/`) and page-section components, grouped by area
- `lib/` — domain types, course data, validation, email sending
- `images/`, `logo/` — original source assets; `npm run images:convert` processes these into `public/`
