import type { SectionProps } from '../../types'

export default function Section({ children, title, className = '' }: SectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      {children}
    </section>
  )
}