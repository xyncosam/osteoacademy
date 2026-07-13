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
