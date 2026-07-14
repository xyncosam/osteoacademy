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
