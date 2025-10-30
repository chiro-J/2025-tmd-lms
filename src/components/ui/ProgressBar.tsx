import type { ProgressBarProps } from '../../types'

export default function ProgressBar({ value, max = 100, className = '', showLabel = true, label = 'Progress' }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-neutral-700">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
