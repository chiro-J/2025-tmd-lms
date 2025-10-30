import { useState } from 'react'
import type { ExamFormData } from '../types/exam'

export function useExamForm() {
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    type: 'exam',
    startDate: '',
    endDate: '',
    hasTimeLimit: false,
    timeLimit: '',
    showResultsDuring: 'private',
    showResultsAfter: 'private',
    hideCode: false,
    hideScore: false,
    useGroups: false,
    problemSelection: 'manual',
    selectedQuestions: []
  })

  const handleInputChange = (field: keyof ExamFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleQuestionSelection = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }))
  }

  return {
    formData,
    handleInputChange,
    toggleQuestionSelection
  }
}






