import { useState, useMemo } from 'react'
import type { Exam, SortField, SortOrder } from '../types/exam'

export function useExamSort(exams: Exam[], initialField: SortField = 'startDate', initialOrder: SortOrder = 'desc') {
  const [sortField, setSortField] = useState<SortField>(initialField)
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle date sorting
      if (sortField === 'startDate' || sortField === 'endDate') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [exams, sortField, sortOrder])

  return {
    sortField,
    sortOrder,
    sortedExams,
    handleSort
  }
}
