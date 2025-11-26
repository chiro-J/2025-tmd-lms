import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Users, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import Card from '../../components/ui/Card'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourseEnrollments, type CourseEnrollment } from '../../core/api/courses'
import { getExamsByCourse } from '../../core/api/exams'

interface StudentScore {
  studentId: number
  studentName: string
  studentEmail: string
  scores: {
    examId: number
    examTitle: string
    score: number | null
    totalPoints: number | null
    submittedAt: string | null
  }[]
}

export default function ResultsAnalysis() {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [loading, setLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [studentScores, setStudentScores] = useState<StudentScore[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // 수강자 목록 조회
        const enrollmentsData = await getCourseEnrollments(courseId)
        setEnrollments(enrollmentsData)

        // 시험 목록 조회
        const examsData = await getExamsByCourse(courseId)
        setExams(examsData)

        // 첫 번째 시험을 기본 선택
        if (examsData.length > 0 && !selectedExamId) {
          setSelectedExamId(examsData[0].id)
        }

        // TODO: 추후 백엔드 API 연동
        // 각 수강자별 시험 점수 조회
        // const scores = await getExamScoresByCourse(courseId)
        // setStudentScores(scores)

        // 임시: mock 데이터 구조 (추후 API로 교체)
        const mockScores: StudentScore[] = enrollmentsData.map((enrollment) => {
          // 수강자 이름: name > username > email 순으로 사용
          const studentName = enrollment.user.name || enrollment.user.username || enrollment.user.email.split('@')[0] || '수강자'

          return {
            studentId: enrollment.user.id,
            studentName,
            studentEmail: enrollment.user.email,
            scores: examsData.map((exam) => ({
              examId: exam.id,
              examTitle: exam.title,
              score: null, // 추후 API에서 가져올 점수
              totalPoints: exam.questions?.reduce((sum: number, q: any) => sum + (q.points || 10), 0) || 0,
              submittedAt: null, // 추후 API에서 가져올 제출 시간
            })),
          }
        })
        setStudentScores(mockScores)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [courseId])

  // 선택한 시험의 점수 데이터 준비 및 정렬
  const sortedStudentScores = useMemo(() => {
    if (!selectedExamId) return []

    const scoresWithData = studentScores.map(student => {
      const score = student.scores.find(s => s.examId === selectedExamId)
      return {
        ...student,
        scoreData: score || null
      }
    })

    // 점수별 정렬 (null은 맨 뒤로)
    return scoresWithData.sort((a, b) => {
      const scoreA = a.scoreData?.score ?? -1
      const scoreB = b.scoreData?.score ?? -1

      if (scoreA === -1 && scoreB === -1) return 0
      if (scoreA === -1) return 1
      if (scoreB === -1) return -1

      return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB
    })
  }, [studentScores, selectedExamId, sortOrder])

  // 제출한 사람 수 계산
  const submittedCount = useMemo(() => {
    return sortedStudentScores.filter(student => student.scoreData?.score !== null).length
  }, [sortedStudentScores])

  const selectedExam = exams.find(exam => exam.id === selectedExamId)

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle="시험 점수 조회">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </CoursePageLayout>
    )
  }

  const rightActions = exams.length > 0 && (
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-700 font-medium">시험 선택:</label>
      <div className="relative">
        <select
          value={selectedExamId || ''}
          onChange={(e) => setSelectedExamId(Number(e.target.value))}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  )

  return (
    <CoursePageLayout currentPageTitle="시험 점수 조회" rightActions={rightActions}>
      <Card>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedExam ? `${selectedExam.title} 점수` : '시험 점수 조회'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {selectedExamId ? `${submittedCount}명 / ${enrollments.length}명` : `${enrollments.length}명`}
            </span>
            {selectedExamId && (
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title={sortOrder === 'desc' ? '내림차순 (높은 점수 순)' : '오름차순 (낮은 점수 순)'}
              >
                {sortOrder === 'desc' ? (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    <span>내림차순</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    <span>오름차순</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {studentScores.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">수강자가 없습니다.</p>
          </div>
        ) : !selectedExamId ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">시험을 선택해주세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    수강자
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    점수
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    제출일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStudentScores.map((student) => {
                  const score = student.scoreData
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                              {student.studentName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                            <div className="text-sm text-gray-500">{student.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {score && score.score !== null ? (
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {score.score}점
                            </span>
                            {score.totalPoints && (
                              <span className="text-gray-500"> / {score.totalPoints}점</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">미제출</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {score && score.submittedAt ? (
                          <span className="text-sm text-gray-600">
                            {new Date(score.submittedAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </CoursePageLayout>
  )
}
