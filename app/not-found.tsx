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
