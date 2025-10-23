import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalBase from './ModalBase'

interface EnrollCodeModalProps {
  open: boolean
  onClose: () => void
}

export default function EnrollCodeModal({ open, onClose }: EnrollCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (code === 'ABCD-1234') {
        setIsLoading(false)
        onClose()
        navigate('/student/course/1')
      } else {
        setError('유효하지 않은 수강 코드입니다.')
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleClose = () => {
    setCode('')
    setError('')
    onClose()
  }

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={handleClose}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        취소
      </button>
      <button
        type="submit"
        form="enroll-form"
        disabled={isLoading || !code.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        {isLoading ? '등록 중...' : '등록'}
      </button>
    </div>
  )

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      title="수강 코드 입력"
      footer={footer}
    >
      <form id="enroll-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="enroll-code" className="block text-sm font-medium text-gray-700 mb-2">
            수강 코드
          </label>
          <input
            id="enroll-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="수강 코드를 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:outline-none"
            autoFocus
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </form>
    </ModalBase>
  )
}