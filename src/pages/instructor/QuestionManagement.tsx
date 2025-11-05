import { useState } from 'react'
import { Save, Plus, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import QuestionList from '../../components/question/QuestionList'
import QuestionEditor from '../../components/question/QuestionEditor'
import QuestionPreview from '../../components/question/QuestionPreview'
import { useQuestionForm } from '../../hooks/useQuestionForm'
import { mockQuestions } from '../../data/mockQuestions'
import { mockExamsInfo } from '../../data/mockExams'
import type { QuestionStatus } from '../../types/question'

export default function QuestionManagement() {
  const [savedQuestions, setSavedQuestions] = useState(mockQuestions)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>('1')
  const [filterStatus, setFilterStatus] = useState<'all' | QuestionStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const selectedQuestion = savedQuestions.find(q => q.id === selectedQuestionId)

  const {
    formData,
    lastSaved,
    handleInputChange: handleInputChangeRaw,
    handleOptionChange,
    addOption,
    removeOption,
    handleTypeChange,
    handleTempSave,
    handleSaveQuestion,
    handleNewQuestion
  } = useQuestionForm(selectedQuestion, savedQuestions, setSavedQuestions)

  const handleInputChange = (field: string | number | symbol, value: any) => {
    handleInputChangeRaw(field as keyof typeof formData, value)
  }

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId)
  }

  const onNewQuestion = () => {
    const newQuestionId = handleNewQuestion()
    setSelectedQuestionId(newQuestionId)
  }

  const rightActions = (
    <>
      <Button
        variant="outline"
        className="text-orange-600 border-orange-600 hover:bg-orange-50 rounded-xl"
        onClick={handleTempSave}
      >
        <Clock className="h-4 w-4 mr-1" />
        임시 저장
      </Button>
      <Button
        className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
        onClick={handleSaveQuestion}
      >
        <Save className="h-4 w-4 mr-1" />
        문제 저장
      </Button>
      <Button
        variant="outline"
        className="text-base-content/70 rounded-xl"
        onClick={onNewQuestion}
      >
        <Plus className="h-4 w-4 mr-1" />
        새 문제
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="문제 관리"
      rightActions={rightActions}
    >
      <div className="mb-4">
        <p className="text-sm text-base-content/70">
          저장된 문제를 선택하여 편집하거나 새로운 문제를 작성할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Question List */}
        <div className="col-span-3">
          <Card className="sticky top-6">
            <QuestionList
              questions={savedQuestions}
              selectedQuestionId={selectedQuestionId}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              onQuestionSelect={handleQuestionSelect}
              onFilterStatusChange={setFilterStatus}
              onSearchQueryChange={setSearchQuery}
              mockExams={mockExamsInfo}
            />
          </Card>
        </div>

        {/* Center Panel - Question Editor */}
        <div className="col-span-5">
          <Card>
            <QuestionEditor
              formData={formData}
              selectedQuestionId={selectedQuestionId}
              lastSaved={lastSaved}
              mockExams={mockExamsInfo}
              onInputChange={handleInputChange}
              onTypeChange={handleTypeChange}
              onOptionChange={handleOptionChange}
              onAddOption={addOption}
              onRemoveOption={removeOption}
            />
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="col-span-4">
          <Card>
            <QuestionPreview formData={formData} />
          </Card>
        </div>
      </div>
    </CoursePageLayout>
  )
}
