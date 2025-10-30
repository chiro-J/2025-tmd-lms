import { useState, useMemo } from 'react'
import type { Exam, ExamType, ExamStatus } from '../types/exam'

export function useExamFilters(exams: Exam[]) {
  const [filterType, setFilterType] = useState<'all' | ExamType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | ExamStatus>('all')
  const [filterAuthor, setFilterAuthor] = useState<string>('all')
  const [filterGroup, setFilterGroup] = useState<string>('all')

  const uniqueAuthors = useMemo(
    () => ['all', ...Array.from(new Set(exams.map(e => e.author)))],
    [exams]
  )

  const uniqueGroups = useMemo(
    () => ['all', ...Array.from(new Set(exams.map(e => e.group)))],
    [exams]
  )

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      if (filterType !== 'all' && exam.type !== filterType) return false
      if (filterStatus !== 'all' && exam.status !== filterStatus) return false
      if (filterAuthor !== 'all' && exam.author !== filterAuthor) return false
      if (filterGroup !== 'all' && exam.group !== filterGroup) return false
      return true
    })
  }, [exams, filterType, filterStatus, filterAuthor, filterGroup])

  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || filterAuthor !== 'all' || filterGroup !== 'all'

  const clearFilters = () => {
    setFilterType('all')
    setFilterStatus('all')
    setFilterAuthor('all')
    setFilterGroup('all')
  }

  return {
    filterType,
    filterStatus,
    filterAuthor,
    filterGroup,
    uniqueAuthors,
    uniqueGroups,
    filteredExams,
    hasActiveFilters,
    setFilterType,
    setFilterStatus,
    setFilterAuthor,
    setFilterGroup,
    clearFilters
  }
}






