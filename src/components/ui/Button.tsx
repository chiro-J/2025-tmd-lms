import { forwardRef } from 'react'
import { cn } from '../../core/utils/classNames'
import { COMMON_STYLES } from '../../core/constants/styles'
import type { ButtonProps } from '../../types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  ...props
}, ref) => {
  const variantClasses = {
    primary: COMMON_STYLES.button.primary,
    outline: COMMON_STYLES.button.secondary,
    secondary: COMMON_STYLES.button.secondary,
    ghost: COMMON_STYLES.button.ghost,
    danger: COMMON_STYLES.button.danger,
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const buttonClasses = cn(
    COMMON_STYLES.button.base,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  if (asChild && typeof children === 'object' && children !== null && 'type' in children) {
    return (
      <div className={buttonClasses}>
        {children}
      </div>
    )
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
