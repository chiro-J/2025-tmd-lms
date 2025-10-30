import { X } from 'lucide-react'
import type { ExamType, ExamStatus } from '../../types/exam'

interface ExamFiltersProps {
  filterType: 'all' | ExamType
  filterStatus: 'all' | ExamStatus
  filterAuthor: string
  filterGroup: string
  uniqueAuthors: string[]
  uniqueGroups: string[]
  hasActiveFilters: boolean
  onFilterTypeChange: (value: 'all' | ExamType) => void
  onFilterStatusChange: (value: 'all' | ExamStatus) => void
  onFilterAuthorChange: (value: string) => void
  onFilterGroupChange: (value: string) => void
  onClearFilters: () => void
}

export default function ExamFilters({
  filterType,
  filterStatus,
  filterAuthor,
  filterGroup,
  uniqueAuthors,
  uniqueGroups,
  hasActiveFilters,
  onFilterTypeChange,
  onFilterStatusChange,
  onFilterAuthorChange,
  onFilterGroupChange,
  onClearFilters
}: ExamFiltersProps) {
  return (
    <div className="px-6 py-4 bg-base-200 border-b border-base-300">
      {hasActiveFilters && (
        <div className="flex items-center justify-end mb-3">
          <button
            onClick={onClearFilters}
            className="flex items-center text-xs text-error hover:text-error/80"
          >
            <X className="h-3 w-3 mr-1" />
            필터 초기화
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Type Filter */}
        <div>
          <label className="block text-xs text-base-content/70 mb-1">분류</label>
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value as typeof filterType)}
            className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="시험">시험</option>
            <option value="과제">과제</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs text-base-content/70 mb-1">상태</label>
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value as typeof filterStatus)}
            className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">전체</option>
            <option value="예정">예정</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
          </select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-xs text-base-content/70 mb-1">작성자</label>
          <select
            value={filterAuthor}
            onChange={(e) => onFilterAuthorChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>
                {author === 'all' ? '전체' : author}
              </option>
            ))}
          </select>
        </div>

        {/* Group Filter */}
        <div>
          <label className="block text-xs text-base-content/70 mb-1">그룹</label>
          <select
            value={filterGroup}
            onChange={(e) => onFilterGroupChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {uniqueGroups.map(group => (
              <option key={group} value={group}>
                {group === 'all' ? '전체' : group}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}





