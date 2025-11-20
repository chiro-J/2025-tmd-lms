import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import type { ExamFormData } from '../../types/exam'

interface ExamFormSectionProps {
  formData: ExamFormData
  onInputChange: (field: keyof ExamFormData, value: string | number | boolean | string[] | undefined) => void
}

const toggleButtonClass = (isActive: boolean) =>
  `flex h-11 items-center justify-center rounded-xl border-2 px-5 text-sm font-medium transition-all ${
    isActive
      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
  }`

// datetime-local 형식 문자열을 Date 객체로 변환
const parseDateTime = (dateString: string): Date | null => {
  if (!dateString) return null
  try {
    return new Date(dateString)
  } catch {
    return null
  }
}

// Date 객체를 datetime-local 형식 문자열로 변환
const formatDateTime = (date: Date | null): string => {
  if (!date) return ''
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export default function ExamFormSection({ formData, onInputChange }: ExamFormSectionProps) {
  const [startDate, setStartDate] = useState<Date | null>(parseDateTime(formData.startDate))
  const [endDate, setEndDate] = useState<Date | null>(parseDateTime(formData.endDate))

  // formData가 외부에서 변경될 때 state 동기화
  useEffect(() => {
    setStartDate(parseDateTime(formData.startDate))
  }, [formData.startDate])

  useEffect(() => {
    setEndDate(parseDateTime(formData.endDate))
  }, [formData.endDate])

  return (
    <div className="space-y-8">
      {/* 시험 제목 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시험 제목
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="제목을 입력하세요."
          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 시작/종료 일자 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시작 일자 / 종료 일자
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">시작 일자</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date)
                onInputChange('startDate', formatDateTime(date))
              }}
              showTimeSelect
              timeIntervals={15}
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              timeFormat="HH:mm"
              locale={ko}
              wrapperClassName="w-full"
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholderText="시작 일자를 선택하세요"
              minDate={new Date()}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">종료 일자</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date)
                onInputChange('endDate', formatDateTime(date))
              }}
              showTimeSelect
              timeIntervals={15}
              dateFormat="yyyy년 MM월 dd일 HH:mm"
              timeFormat="HH:mm"
              locale={ko}
              wrapperClassName="w-full"
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholderText="종료 일자를 선택하세요"
              minDate={startDate || new Date()}
            />
          </div>
        </div>
      </div>

      {/* 시험 응시 시간 제한 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시험 응시 시간 제한
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={toggleButtonClass(!formData.hasTimeLimit)}
            onClick={() => onInputChange('hasTimeLimit', false)}
          >
            사용 안함
          </button>
          <button
            type="button"
            className={toggleButtonClass(formData.hasTimeLimit)}
            onClick={() => onInputChange('hasTimeLimit', true)}
          >
            사용
          </button>
        </div>
        {formData.hasTimeLimit && (
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">제한 시간 (분)</label>
            <input
              type="number"
              value={formData.timeLimit || ''}
              onChange={(e) => onInputChange('timeLimit', e.target.value)}
              min="1"
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* 채점 결과 공개 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          채점 결과 공개
        </label>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">시험 중</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={toggleButtonClass(formData.showResultsDuring === 'private')}
                onClick={() => onInputChange('showResultsDuring', 'private')}
              >
                비공개
              </button>
              <button
                type="button"
                className={toggleButtonClass(formData.showResultsDuring === 'public')}
                onClick={() => onInputChange('showResultsDuring', 'public')}
              >
                공개
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">시험 종료 후</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={toggleButtonClass(formData.showResultsAfter === 'private')}
                onClick={() => onInputChange('showResultsAfter', 'private')}
              >
                비공개
              </button>
              <button
                type="button"
                className={toggleButtonClass(formData.showResultsAfter === 'public')}
                onClick={() => onInputChange('showResultsAfter', 'public')}
              >
                공개
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 제출 현황에서 숨길 항목 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          제출 현황에서 숨길 항목
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hideCode}
              onChange={(e) => onInputChange('hideCode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">제출한 코드</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hideScore}
              onChange={(e) => onInputChange('hideScore', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">점수</span>
          </label>
        </div>
      </div>

      {/* 그룹 설정 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          그룹 설정
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={toggleButtonClass(!formData.useGroups)}
            onClick={() => onInputChange('useGroups', false)}
          >
            사용 안함
          </button>
          <button
            type="button"
            className={toggleButtonClass(formData.useGroups)}
            onClick={() => onInputChange('useGroups', true)}
          >
            사용
          </button>
        </div>
      </div>

      {/* 문제 선택 방식 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          문제 선택 방식
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={toggleButtonClass(formData.problemSelection === 'manual')}
            onClick={() => onInputChange('problemSelection', 'manual')}
          >
            직접 선택
          </button>
          <button
            type="button"
            className={toggleButtonClass(formData.problemSelection === 'conditional')}
            onClick={() => onInputChange('problemSelection', 'conditional')}
          >
            조건별 선택
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          기존에 만들었던 문제를 시험에 추가 할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
