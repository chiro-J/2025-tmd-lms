import { useState } from 'react'
import { Save, Eye } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CourseSidebar from '../../components/instructor/CourseSidebar'
import CourseHeader from '../../components/instructor/CourseHeader'
import ExamFormSection from '../../components/exam/ExamFormSection'
import ExamPreview from '../../components/exam/ExamPreview'
import { useExamForm } from '../../hooks/useExamForm'
import { availableQuestions } from '../../data/mockQuestions'

export default function CreateExam() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Mock current course data
  const currentCourse = {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '비공개'
  }

  const { formData, handleInputChange, toggleQuestionSelection } = useExamForm()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseHeader
        currentCourse={currentCourse}
        currentPageTitle="시험/과제 생성"
      />

      <div className="flex">
        <CourseSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentCourse={currentCourse}
        />

        <div className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">시험/과제 생성</h1>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Save className="h-4 w-4 mr-1" />
              저장
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div>
              <Card className="p-6">
                <ExamFormSection
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card className="p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">미리보기</h2>
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>

                <ExamPreview
                  formData={formData}
                  availableQuestions={availableQuestions}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
