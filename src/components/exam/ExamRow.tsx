import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { Exam } from '../../types/exam'
import { getStatusColor } from '../../utils/examUtils'
import { deleteExam } from '../../core/api/exams'

interface ExamRowProps {
  exam: Exam
  courseId: string
  onDelete?: () => void
}

export default function ExamRow({ exam, courseId, onDelete }: ExamRowProps) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`"${exam.title}" 시험을 삭제하시겠습니까?`)) {
      return
    }

    setDeleting(true)
    try {
      await deleteExam(Number(courseId), exam.id)
      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('시험 삭제 실패:', error)
      alert('시험 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="hover:bg-base-200">
      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          exam.type === '시험' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'
        }`}>
          {exam.type}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-base-content">
        <Link
          to={`/instructor/course/${courseId}/exam/${exam.id}`}
          className="text-primary hover:text-primary/80 hover:underline"
        >
          {exam.title}
        </Link>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
        {exam.author}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
        {exam.group}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
          {exam.status}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
        {exam.startDate}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
        {exam.endDate}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-primary hover:text-primary/80" title="미리보기">
            <Eye className="h-4 w-4" />
          </button>
          <Link
            to={`/instructor/course/${courseId}/create-exam?examId=${exam.id}`}
            className="text-base-content/70 hover:text-base-content"
            title="편집"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            className="text-error hover:text-error/80 disabled:opacity-50"
            title="삭제"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
