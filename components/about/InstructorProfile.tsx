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
        {instructor.credentials && (
          <p className="mt-1 font-body text-sm font-semibold uppercase tracking-wide text-sage-500">
            {instructor.credentials}
          </p>
        )}
        <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-ink-900">{instructor.bio}</p>
      </div>
    </div>
  )
}
