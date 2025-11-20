import { useState, useEffect, useMemo } from 'react'
import { Plus, Upload, FileText, AlertCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import ExamFilters from '../../components/exam/ExamFilters'
import ExamTableHeader from '../../components/exam/ExamTableHeader'
import ExamRow from '../../components/exam/ExamRow'
import { useExamFilters } from '../../hooks/useExamFilters'
import { useExamSort } from '../../hooks/useExamSort'
import type { Exam } from '../../types/exam'

export default function ExamManagement() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  const loadExams = async () => {
    if (!courseId) {
      setLoading(false)
      return
    }
    try {
      const { getExamsByCourse } = await import('../../core/api/exams')
      const response = await getExamsByCourse(Number(courseId))
      setExams(response)
    } catch (error) {
      console.error('시험 목록 로드 실패:', error)
      setExams([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExams()
  }, [courseId])

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Separate today's exams and other exams
  const todayExams = useMemo(() => exams.filter(exam => exam.startDate === today), [exams, today])
  const otherExams = useMemo(() => exams.filter(exam => exam.startDate !== today), [exams, today])

  // Today's exams filters and sorting
  const todayFiltersState = useExamFilters(todayExams)
  const todaySortState = useExamSort(todayFiltersState.filteredExams, 'startDate', 'desc')

  // All exams filters and sorting
  const filtersState = useExamFilters(otherExams)
  const sortState = useExamSort(filtersState.filteredExams, 'startDate', 'desc')

  const rightActions = (
    <>
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
        onClick={() => navigate(`/instructor/course/${courseId}/create-exam`)}
      >
        <Plus className="h-4 w-4 mr-1" />
        시험/과제 생성
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Upload className="h-4 w-4 mr-1" />
        시험 가져오기
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="시험/과제 관리"
      rightActions={rightActions}
    >
      {/* Info Message */}
      <div className="mb-4">
        <p className="text-sm text-base-content/70">
          강좌에 시험과 과제를 추가할 수 있습니다. 이 강좌에 시험과 과제를 추가하여 학생들의 성취도를 측정해보세요.
        </p>
      </div>

      {/* Today's Exams Highlight Section */}
      {todayExams.length > 0 && (
        <Card className="mb-6 overflow-hidden border-2 border-warning bg-warning/5">
          <div className="px-6 py-4 bg-warning/10 border-b border-warning/20">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-warning mr-2" />
              <h3 className="text-lg font-semibold text-base-content">
                오늘 시작하는 시험/과제
              </h3>
              <span className="ml-2 px-2 py-0.5 bg-warning text-warning-content text-xs font-bold rounded-full">
                {todayExams.length}
              </span>
            </div>
          </div>

          {/* Today's Filters */}
          <ExamFilters
            filterType={todayFiltersState.filterType}
            filterStatus={todayFiltersState.filterStatus}
            filterAuthor={todayFiltersState.filterAuthor}
            filterGroup={todayFiltersState.filterGroup}
            uniqueAuthors={todayFiltersState.uniqueAuthors}
            uniqueGroups={todayFiltersState.uniqueGroups}
            hasActiveFilters={todayFiltersState.hasActiveFilters}
            onFilterTypeChange={todayFiltersState.setFilterType}
            onFilterStatusChange={todayFiltersState.setFilterStatus}
            onFilterAuthorChange={todayFiltersState.setFilterAuthor}
            onFilterGroupChange={todayFiltersState.setFilterGroup}
            onClearFilters={todayFiltersState.clearFilters}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-300">
              <ExamTableHeader
                sortField={todaySortState.sortField}
                sortOrder={todaySortState.sortOrder}
                onSort={todaySortState.handleSort}
              />
              <tbody className="bg-base-100 divide-y divide-base-300">
                {todaySortState.sortedExams.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center">
                      <div className="text-base-content/70">
                        <p className="text-lg font-medium mb-2">필터 조건에 맞는 항목이 없습니다</p>
                        <button
                          onClick={todayFiltersState.clearFilters}
                          className="text-sm text-primary hover:text-primary/80 underline"
                        >
                          필터 초기화
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  todaySortState.sortedExams.map((exam) => (
                    <ExamRow
                      key={exam.id}
                      exam={exam}
                      courseId={courseId!}
                      onDelete={loadExams}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* All Exams Table */}
      <Card className="overflow-hidden">
        {/* Filters */}
        <ExamFilters
          filterType={filtersState.filterType}
          filterStatus={filtersState.filterStatus}
          filterAuthor={filtersState.filterAuthor}
          filterGroup={filtersState.filterGroup}
          uniqueAuthors={filtersState.uniqueAuthors}
          uniqueGroups={filtersState.uniqueGroups}
          hasActiveFilters={filtersState.hasActiveFilters}
          onFilterTypeChange={filtersState.setFilterType}
          onFilterStatusChange={filtersState.setFilterStatus}
          onFilterAuthorChange={filtersState.setFilterAuthor}
          onFilterGroupChange={filtersState.setFilterGroup}
          onClearFilters={filtersState.clearFilters}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <ExamTableHeader
              sortField={sortState.sortField}
              sortOrder={sortState.sortOrder}
              onSort={sortState.handleSort}
            />
            <tbody className="bg-base-100 divide-y divide-base-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center">
                    <div className="text-base-content/70">
                      <p className="text-lg font-medium mb-2">로딩 중...</p>
                    </div>
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center">
                    <div className="text-base-content/70">
                      <p className="text-lg font-medium mb-2">시험/과제가 없습니다</p>
                      <p className="text-sm">시험과 과제를 추가해보세요.</p>
                    </div>
                  </td>
                </tr>
              ) : sortState.sortedExams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center">
                    <div className="text-base-content/70">
                      <p className="text-lg font-medium mb-2">필터 조건에 맞는 항목이 없습니다</p>
                      <button
                        onClick={filtersState.clearFilters}
                        className="text-sm text-primary hover:text-primary/80 underline"
                      >
                        필터 초기화
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortState.sortedExams.map((exam) => (
                  <ExamRow
                    key={exam.id}
                    exam={exam}
                    courseId={courseId!}
                    onDelete={loadExams}
                  />
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
              <span className="text-sm text-base-content/70">
                {filtersState.hasActiveFilters ? (
                  <>총 {exams.length}개 중 {sortState.sortedExams.length}개 표시</>
                ) : (
                  <>총 {exams.length}개 항목</>
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </CoursePageLayout>
  )
}
