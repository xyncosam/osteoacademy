export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-olive-700">
      {children}
    </span>
  )
}
