import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalBase from './ModalBase'
import { getCourseByEnrollmentCode, enrollInCourse } from '../../core/api/courses'
import { useAuth } from '../../contexts/AuthContext'

interface EnrollCodeModalProps {
  open: boolean
  onClose: () => void
  onEnrollSuccess?: () => void // 등록 성공 시 콜백
}

export default function EnrollCodeModal({ open, onClose, onEnrollSuccess }: EnrollCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 수강코드로 강좌 조회
      const course = await getCourseByEnrollmentCode(code.trim().toUpperCase())

      if (!course) {
        setError('유효하지 않은 수강 코드입니다.')
        setIsLoading(false)
        return
      }

      if (!user?.id) {
        setError('로그인이 필요합니다.')
        setIsLoading(false)
        return
      }

      // DB에 수강 등록
      const courseId = Number(course.id)
      await enrollInCourse(courseId, user.id)

      // localStorage 동기화 (백업용)
      const enrolledCourseIds = JSON.parse(
        localStorage.getItem('enrolledCourseIds') || '[]'
      ) as number[]
      if (!enrolledCourseIds.includes(courseId)) {
        enrolledCourseIds.push(courseId)
        localStorage.setItem('enrolledCourseIds', JSON.stringify(enrolledCourseIds))
      }

      setIsLoading(false)
      onClose()
      setCode('')

      // 등록 성공 콜백 호출 (부모 컴포넌트에서 강좌 목록 새로고침)
      if (onEnrollSuccess) {
        onEnrollSuccess()
      }

      // 강좌 상세 페이지로 이동
      navigate(`/student/course/${course.id}`)
    } catch (error) {
      console.error('수강코드 등록 실패:', error)
      setError('수강 코드 확인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
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
