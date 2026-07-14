export function SectionHeading({
  eyebrow,
  title,
  align = 'left',
  as: Heading = 'h2',
}: {
  eyebrow: string
  title: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">{eyebrow}</p>
      <Heading className="mt-3 font-display text-3xl font-medium text-forest-900 md:text-4xl">{title}</Heading>
      <span className="mt-4 h-1.5 w-16 rounded-full bg-sage-500" aria-hidden="true" />
    </div>
  )
}
