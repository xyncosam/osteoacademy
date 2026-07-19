export type ButtonVariant = 'primary' | 'outline' | 'inverse'
export type ButtonSize = 'md' | 'sm'

const base =
  'inline-flex items-center justify-center rounded-md font-body font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-forest-900 text-cream-50 hover:bg-olive-700',
  outline: 'bg-transparent text-forest-900 border border-forest-900 hover:bg-cream-100',
  inverse: 'bg-cream-50 text-forest-900 hover:bg-cream-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
}

export function getButtonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return [base, variantClasses[variant], sizeClasses[size]].join(' ')
}
