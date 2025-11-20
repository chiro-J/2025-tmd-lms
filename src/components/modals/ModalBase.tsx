import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalBaseProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export default function ModalBase({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg'
}: ModalBaseProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Handle animation lifecycle
  useEffect(() => {
    if (open) {
      // Start rendering the modal
      setShouldRender(true)
      // Trigger enter animation after a small delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })

      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else if (shouldRender) {
      // Trigger exit animation
      setIsAnimating(false)

      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)

        // Restore body scroll
        document.body.style.overflow = 'unset'

        // Return focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus()
        }
      }, 200) // Match animation duration

      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open, shouldRender])

  // Focus modal when animation starts
  useEffect(() => {
    if (isAnimating && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isAnimating])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!shouldRender) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop - 전체화면으로 어둡게 */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ease-out ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-hidden focus:outline-none z-10 transition-all duration-200 ease-out ${
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg p-1"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
