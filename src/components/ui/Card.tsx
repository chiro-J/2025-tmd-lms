import { cn } from '../../core/utils/classNames'
import { COMMON_STYLES } from '../../core/constants/styles'
import type { CardProps } from '../../types'

export default function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const cardClasses = cn(
    COMMON_STYLES.card.base,
    paddingClasses[padding],
    onClick ? COMMON_STYLES.card.interactive : COMMON_STYLES.card.hover,
    className
  )

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  )
}