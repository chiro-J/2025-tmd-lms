import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react'
import type { SortField, SortOrder } from '../../types/exam'

interface ExamTableHeaderProps {
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

export default function ExamTableHeader({ sortField, sortOrder, onSort }: ExamTableHeaderProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 inline ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  return (
    <thead className="bg-base-200">
      <tr>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('type')}
        >
          분류 <SortIcon field="type" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('title')}
        >
          제목 <SortIcon field="title" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('author')}
        >
          작성자 <SortIcon field="author" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('group')}
        >
          그룹 <SortIcon field="group" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('status')}
        >
          상태 <SortIcon field="status" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('startDate')}
        >
          시작 날짜 <SortIcon field="startDate" />
        </th>
        <th
          className="group px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-300"
          onClick={() => onSort('endDate')}
        >
          종료 날짜 <SortIcon field="endDate" />
        </th>
        <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
          관리
        </th>
      </tr>
    </thead>
  )
}






