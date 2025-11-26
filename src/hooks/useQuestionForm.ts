import { useState, useEffect, useRef } from 'react'
import type { QuestionData, QuestionType } from '../types/question'
import { createQuestion, updateQuestion } from '../core/api/questions'

export function useQuestionForm(
  selectedQuestion: QuestionData | undefined,
  savedQuestions: QuestionData[],
  setSavedQuestions: React.Dispatch<React.SetStateAction<QuestionData[]>>,
  courseId?: number,
  onSaveSuccess?: () => void,
  examId?: number | null
) {
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [lastSaved, setLastSaved] = useState<string>('')

  const [formData, setFormData] = useState<QuestionData>(
    selectedQuestion || {
      id: '',
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: '',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
  )

  // Update formData when selectedQuestion changes
  useEffect(() => {
    if (selectedQuestion) {
      setFormData(selectedQuestion)
    }
  }, [selectedQuestion])

  const handleInputChange = (field: string | number | symbol, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }))
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: prev.correctAnswer >= newOptions.length ? 0 : prev.correctAnswer
      }))
    }
  }

  const handleTypeChange = (type: QuestionType) => {
    setFormData({
      ...formData,
      type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: type === 'true-false' ? true : 0,
    })
  }

  // Auto-save function
  const autoSaveQuestion = (questionId: string) => {
    const now = new Date().toISOString().split('T')[0]
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

    setSavedQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...formData, updatedAt: now }
          : q
      )
    )
    setLastSaved(time)
  }

  // Auto-save effect (5 seconds after last change)
  useEffect(() => {
    if (!formData.id) return

    // Clear previous timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveQuestion(formData.id)
    }, 5000)

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const handleTempSave = async () => {
    if (!formData.question.trim()) {
      alert('문제 내용을 입력해주세요.')
      return
    }

    try {
      const now = new Date().toISOString().split('T')[0]
      const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

      // examId가 필수인지 확인
      if (!examId) {
        alert('시험 정보가 없습니다. 먼저 시험을 생성해주세요.')
        return
      }

      // 백엔드에 저장할 데이터 변환
      const questionData: any = {
        type: formData.type,
        question: formData.question,
        options: formData.type === 'multiple-choice' ? formData.options : undefined,
        correctAnswer: formData.correctAnswer,
        points: formData.points,
        explanation: formData.explanation || undefined,
        status: 'review',
        examId: examId, // examId 필수 포함
      }

      // 임시 ID인지 확인 (temp-로 시작하면 새 문제)
      const isNewQuestion = formData.id.startsWith('temp-')

      if (!isNewQuestion && formData.id && !isNaN(Number(formData.id))) {
        // 기존 문제 수정
        const updated = await updateQuestion(Number(formData.id), questionData)
        const updatedQuestion: QuestionData = {
          ...formData,
          id: updated.id.toString(),
          status: 'review',
          updatedAt: now,
        }
        setSavedQuestions(prev =>
          prev.map(q => (q.id === formData.id ? updatedQuestion : q))
        )
        setFormData(prev => ({ ...prev, status: 'review' }))
        setLastSaved(time)
        alert('검토 필요 상태로 저장되었습니다.')
        onSaveSuccess?.()
      } else {
        // 새 문제 생성
        const created = await createQuestion(questionData)
        const newQuestion: QuestionData = {
          ...formData,
          id: created.id.toString(),
          status: 'review',
          createdAt: now,
          updatedAt: now,
        }
        // 임시 문제를 실제 문제로 교체
        setSavedQuestions(prev =>
          prev.map(q => (q.id === formData.id ? newQuestion : q))
        )
        setFormData(newQuestion)
        setLastSaved(time)
        alert('검토 필요 상태로 저장되었습니다.')
        onSaveSuccess?.()
      }
    } catch (error) {
      console.error('문제 저장 실패:', error)
      alert('문제 저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleSaveQuestion = async () => {
    // Validation
    if (!formData.question.trim()) {
      alert('문제 내용을 입력해주세요.')
      return
    }

    if (formData.type === 'multiple-choice') {
      const hasEmptyOption = formData.options.some(opt => !opt.trim())
      if (hasEmptyOption) {
        alert('모든 선택지를 입력해주세요.')
        return
      }
      if (formData.correctAnswer === undefined || formData.correctAnswer === null) {
        alert('정답을 선택해주세요.')
        return
      }
    }

    if (formData.type === 'short-answer' && !formData.correctAnswer) {
      alert('모범 답안을 입력해주세요.')
      return
    }

    try {
      const now = new Date().toISOString().split('T')[0]
      const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

      // examId가 필수인지 확인
      if (!examId) {
        alert('시험 정보가 없습니다. 먼저 시험을 생성해주세요.')
        return
      }

      // 백엔드에 저장할 데이터 변환
      const questionData: any = {
        type: formData.type,
        question: formData.question,
        options: formData.type === 'multiple-choice' ? formData.options : undefined,
        correctAnswer: formData.correctAnswer,
        points: formData.points,
        explanation: formData.explanation || undefined,
        status: 'completed',
        examId: examId, // examId 필수 포함
      }

      // 임시 ID인지 확인 (temp-로 시작하면 새 문제)
      const isNewQuestion = formData.id.startsWith('temp-')

      if (!isNewQuestion && formData.id && !isNaN(Number(formData.id))) {
        // 기존 문제 수정
        const updated = await updateQuestion(Number(formData.id), questionData)
        const updatedQuestion: QuestionData = {
          ...formData,
          id: updated.id.toString(),
          status: 'completed',
          updatedAt: now,
        }
        setSavedQuestions(prev =>
          prev.map(q => (q.id === formData.id ? updatedQuestion : q))
        )
        setFormData(prev => ({ ...prev, status: 'completed' }))
        setLastSaved(time)
        alert('문제가 완료 상태로 저장되었습니다.')
        onSaveSuccess?.()
      } else {
        // 새 문제 생성
        const created = await createQuestion(questionData)
        const newQuestion: QuestionData = {
          ...formData,
          id: created.id.toString(),
          status: 'completed',
          createdAt: now,
          updatedAt: now,
        }
        // 임시 문제를 실제 문제로 교체
        setSavedQuestions(prev =>
          prev.map(q => (q.id === formData.id ? newQuestion : q))
        )
        setFormData(newQuestion)
        setLastSaved(time)
        alert('문제가 완료 상태로 저장되었습니다.')
        onSaveSuccess?.()
      }
    } catch (error) {
      console.error('문제 저장 실패:', error)
      alert('문제 저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleNewQuestion = () => {
    const now = new Date().toISOString().split('T')[0]
    // 새 문제는 임시 ID를 사용 (DB에 저장되기 전까지)
    const tempId = `temp-${Date.now()}`
    const newQuestion: QuestionData = {
      id: tempId,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: '',
      status: 'draft',
      createdAt: now,
      updatedAt: now
    }

    setSavedQuestions(prev => [newQuestion, ...prev])
    setFormData(newQuestion)
    setLastSaved('')

    return newQuestion.id
  }

  return {
    formData,
    lastSaved,
    setFormData,
    handleInputChange,
    handleOptionChange,
    addOption,
    removeOption,
    handleTypeChange,
    handleTempSave,
    handleSaveQuestion,
    handleNewQuestion
  }
}
