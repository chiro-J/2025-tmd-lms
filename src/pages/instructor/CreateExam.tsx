import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Save, X, Plus, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import ExamFormSection from '../../components/exam/ExamFormSection'
import ExamPreview from '../../components/exam/ExamPreview'
import QuestionEditor from '../../components/question/QuestionEditor'
import QuestionList from '../../components/question/QuestionList'
import QuestionPreview from '../../components/question/QuestionPreview'
import { useExamForm } from '../../hooks/useExamForm'
import { useQuestionForm } from '../../hooks/useQuestionForm'
import { createExam, updateExam, getExam } from '../../core/api/exams'
import { getQuestions, getExamsInfo } from '../../core/api/questions'
import { useAuth } from '../../contexts/AuthContext'
import type { QuestionData, QuestionStatus } from '../../types/question'

export default function CreateExam() {
  const { id: courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('examId')
  const { user } = useAuth()
  const { formData, handleInputChange } = useExamForm()
  const [availableQuestions, setAvailableQuestions] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState<'exam' | 'questions'>('exam')
  const [createdExamId, setCreatedExamId] = useState<number | null>(null)
  const [savedQuestions, setSavedQuestions] = useState<QuestionData[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [examsInfo, setExamsInfo] = useState<Record<string, { id: string; title: string; type: string }>>({})
  const [filterStatus, setFilterStatus] = useState<'all' | QuestionStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadQuestions = async () => {
    if (!courseId) return
    try {
      const [questions, examsInfoData] = await Promise.all([
        getQuestions(Number(courseId)),
        getExamsInfo(Number(courseId)),
      ])
      setSavedQuestions(questions)
      setAvailableQuestions(questions)
      setExamsInfo(examsInfoData)
    } catch (error) {
      console.error('문제 목록 로드 실패:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return

      try {
        setLoading(true)
        // 문제 목록 로드
        await loadQuestions()

        // 수정 모드인 경우 시험 정보 로드
        if (examId) {
          const exam = await getExam(Number(courseId), Number(examId))
          setCreatedExamId(exam.id)
          // Exam 타입을 ExamFormData로 변환
          handleInputChange('title', exam.title)
          handleInputChange('type', 'exam')
          handleInputChange('startDate', new Date(exam.startDate).toISOString().slice(0, 16))
          handleInputChange('endDate', new Date(exam.endDate).toISOString().slice(0, 16))
          if (exam.timeLimit) {
            handleInputChange('hasTimeLimit', true)
            handleInputChange('timeLimit', exam.timeLimit.toString())
          }
          // 수정 모드에서는 문제 생성 단계로 바로 이동
          setCurrentStep('questions')
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [courseId, examId])

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('시험 제목을 입력해주세요.')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      alert('시작 일자와 종료 일자를 입력해주세요.')
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('종료 일자는 시작 일자보다 늦어야 합니다.')
      return
    }

    if (!courseId) {
      alert('강좌 정보를 찾을 수 없습니다.')
      return
    }

    setSaving(true)
    try {
      const examData = {
        title: formData.title,
        type: '시험' as '시험' | '과제',
        startDate: formData.startDate.split('T')[0], // YYYY-MM-DD 형식
        endDate: formData.endDate.split('T')[0],
        timeLimit: formData.hasTimeLimit && formData.timeLimit ? parseInt(formData.timeLimit) : undefined,
        authorId: user?.id ? (typeof user.id === 'number' ? user.id : parseInt(user.id)) : undefined,
        group: formData.useGroups ? '전체' : undefined,
        totalQuestions: formData.selectedQuestions.length,
      }

      if (examId) {
        await updateExam(Number(courseId), Number(examId), examData)
        alert('시험이 수정되었습니다.')
        setCreatedExamId(Number(examId))
        setCurrentStep('questions')
      } else {
        const createdExam = await createExam(Number(courseId), examData)
        alert('시험이 생성되었습니다. 이제 문제를 추가할 수 있습니다.')
        setCreatedExamId(createdExam.id)
        setCurrentStep('questions')
        await loadQuestions()
      }
    } catch (error) {
      console.error('시험 저장 실패:', error)
      alert('시험 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/instructor/course/${courseId}/exams`)
  }

  const selectedQuestion = savedQuestions.find(q => q.id === selectedQuestionId)

  const {
    formData: questionFormData,
    lastSaved,
    handleInputChange: handleQuestionInputChangeRaw,
    handleOptionChange,
    addOption,
    removeOption,
    handleTypeChange,
    handleTempSave,
    handleSaveQuestion,
    handleNewQuestion
  } = useQuestionForm(selectedQuestion, savedQuestions, setSavedQuestions, Number(courseId), loadQuestions, createdExamId)

  const handleQuestionInputChange = (field: string | number | symbol, value: any) => {
    handleQuestionInputChangeRaw(field as keyof typeof questionFormData, value)
  }

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId)
  }

  const onNewQuestion = () => {
    const newQuestionId = handleNewQuestion()
    setSelectedQuestionId(newQuestionId)
  }

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle={examId ? '시험 수정' : '시험 생성'}>
        <Card className="p-6">
          <p className="text-base-content/70">로딩 중...</p>
        </Card>
      </CoursePageLayout>
    )
  }

  // 문제 생성 단계
  if (currentStep === 'questions') {
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
        currentPageTitle="시험 문제 작성"
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
                examsInfo={examsInfo}
              />
            </Card>
          </div>

          {/* Center Panel - Question Editor */}
          <div className="col-span-5">
            <Card>
              <QuestionEditor
                formData={questionFormData}
                selectedQuestionId={selectedQuestionId}
                lastSaved={lastSaved}
                examsInfo={examsInfo}
                onInputChange={handleQuestionInputChange}
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
              <QuestionPreview formData={questionFormData} />
            </Card>
          </div>
        </div>
      </CoursePageLayout>
    )
  }

  // 시험 생성 단계
  return (
    <CoursePageLayout currentPageTitle={examId ? '시험 수정' : '시험 생성'}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <ExamFormSection formData={formData} onInputChange={handleInputChange} />
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">미리보기</h3>
              <ExamPreview formData={formData} availableQuestions={availableQuestions} />
            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? '저장 중...' : examId ? '수정하기' : '생성하기'}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-1" />
                취소
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </CoursePageLayout>
  )
}
