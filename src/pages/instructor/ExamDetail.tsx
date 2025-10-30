import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { mockExams } from '../../data/mockExams'

export default function ExamDetail() {
  const navigate = useNavigate()
  const { id: courseId, examId } = useParams()

  const exam = mockExams.find(e => e.id === String(examId))

  const rightActions = (
    <>
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
        onClick={() => navigate(`/instructor/course/${courseId}/create-exam?examId=${examId}`)}
      >
        <Edit className="h-4 w-4 mr-1" />
        편집
      </Button>
    </>
  )

  return (
    <CoursePageLayout currentPageTitle="시험 상세" rightActions={rightActions}>
      <div className="mb-4">
        <Link to={`/instructor/course/${courseId}/exams`} className="inline-flex items-center text-sm text-base-content/70 hover:text-base-content">
          <ArrowLeft className="h-4 w-4 mr-1" /> 뒤로가기
        </Link>
      </div>

      {!exam ? (
        <Card className="p-6">
          <p className="text-base-content/70">존재하지 않는 시험입니다.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${exam.type === '시험' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>{exam.type}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${exam.status === '진행중' ? 'bg-success/10 text-success' : exam.status === '대기' ? 'bg-warning/10 text-warning' : 'bg-base-300 text-base-content'}`}>{exam.status}</span>
              </div>
              <h1 className="text-2xl font-bold text-base-content mb-2">{exam.title}</h1>
              <p className="text-sm text-base-content/70">작성자: {exam.author} · 그룹: {exam.group}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-sm"><Calendar className="h-4 w-4 mr-2 text-base-content/60" /> 시작: {exam.startDate}</div>
                <div className="flex items-center text-sm"><Calendar className="h-4 w-4 mr-2 text-base-content/60" /> 종료: {exam.endDate}</div>
                {exam.timeLimit && (
                  <div className="flex items-center text-sm"><Clock className="h-4 w-4 mr-2 text-base-content/60" /> 제한 시간: {exam.timeLimit}분</div>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-base-content mb-3">작업</h3>
              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-content rounded-xl" onClick={() => navigate(`/instructor/course/${courseId}/create-exam?examId=${examId}`)}>시험 편집</Button>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate(`/instructor/course/${courseId}/results`)}>결과 보기</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </CoursePageLayout>
  )
}





