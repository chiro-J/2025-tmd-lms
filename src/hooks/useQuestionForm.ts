import { useState, useEffect, useRef } from 'react'
import type { QuestionData, QuestionType } from '../types/question'

export function useQuestionForm(
  selectedQuestion: QuestionData | undefined,
  savedQuestions: QuestionData[],
  setSavedQuestions: React.Dispatch<React.SetStateAction<QuestionData[]>>
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

  const handleTempSave = () => {
    if (!formData.question.trim()) {
      alert('문제 내용을 입력해주세요.')
      return
    }

    const now = new Date().toISOString().split('T')[0]
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

    if (formData.id) {
      setSavedQuestions(prev =>
        prev.map(q =>
          q.id === formData.id
            ? { ...formData, status: 'review', updatedAt: now }
            : q
        )
      )
      setFormData(prev => ({ ...prev, status: 'review' }))
      setLastSaved(time)
      alert('검토 필요 상태로 저장되었습니다.')
    }
  }

  const handleSaveQuestion = () => {
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
    }

    if (formData.type === 'short-answer' && !formData.correctAnswer) {
      alert('모범 답안을 입력해주세요.')
      return
    }

    const now = new Date().toISOString().split('T')[0]
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

    if (formData.id) {
      setSavedQuestions(prev =>
        prev.map(q =>
          q.id === formData.id
            ? { ...formData, status: 'completed', updatedAt: now }
            : q
        )
      )
      setFormData(prev => ({ ...prev, status: 'completed' }))
      setLastSaved(time)
      alert('문제가 완료 상태로 저장되었습니다.')
    }
  }

  const handleNewQuestion = () => {
    const now = new Date().toISOString().split('T')[0]
    const newQuestion: QuestionData = {
      id: Date.now().toString(),
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
