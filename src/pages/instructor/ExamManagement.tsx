import { Plus, Eye, Edit, Trash2, Upload } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function ExamManagement() {
  // Mock exam data - will be replaced with actual data later
  const exams = [
    {
      id: 1,
      title: '중간고사',
      type: '시험',
      status: '진행중',
      startDate: '2024-10-15',
      endDate: '2024-10-20',
      participants: 25,
      totalQuestions: 50
    },
    {
      id: 2,
      title: '과제 1',
      type: '과제',
      status: '완료',
      startDate: '2024-10-01',
      endDate: '2024-10-10',
      participants: 25,
      totalQuestions: 0
    }
  ]

  const rightActions = (
    <>
      <Button className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl">
        <Plus className="h-4 w-4 mr-1" />
        시험/과제 생성
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Upload className="h-4 w-4 mr-1" />
        시험 가져오기
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Eye className="h-4 w-4 mr-1" />
        미리보기
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Edit className="h-4 w-4 mr-1" />
        편집하기
      </Button>
      <Button variant="outline" className="text-error rounded-xl">
        <Trash2 className="h-4 w-4 mr-1" />
        삭제
      </Button>
    </>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="전체 시험"
      rightActions={rightActions}
    >

        {/* Info Message */}
        <div className="mb-4">
          <p className="text-sm text-base-content/70">
            강좌에 시험과 과제를 추가할 수 있습니다. 이 강좌에 시험과 과제를 추가하여 학생들의 성취도를 측정해보세요.
          </p>
        </div>

        {/* Exams Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-300">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    분류
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    그룹
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    시작 날짜
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    종료 날짜
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center">
                      <div className="text-base-content/70">
                        <p className="text-lg font-medium mb-2">No data available in table</p>
                        <p className="text-sm">시험과 과제를 추가해보세요.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-base-200">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content">
                        {exam.type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content">
                        {exam.type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-base-content">
                        {exam.title}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
                        김강사
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-base-content/70">
                        전체
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          exam.status === '진행중' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-base-300 text-base-content/70'
                        }`}>
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
                          <button className="text-primary hover:text-primary/80">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-base-content/70 hover:text-base-content">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-error hover:text-error/80">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-base-100 px-3 py-2 flex items-center justify-between border-t border-base-300">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-base-content/70 bg-base-100 hover:bg-base-200">
                «
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-base-content/70 bg-base-100 hover:bg-base-200">
                »
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-base-content/70">10 개씩 보기</span>
              </div>
            </div>
          </div>
        </Card>
    </CoursePageLayout>
  )
}
