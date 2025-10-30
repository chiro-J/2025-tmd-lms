import { Calendar } from 'lucide-react'
import type { ExamFormData } from '../../types/exam'

interface ExamFormSectionProps {
  formData: ExamFormData
  onInputChange: (field: keyof ExamFormData, value: any) => void
}

export default function ExamFormSection({ formData, onInputChange }: ExamFormSectionProps) {
  return (
    <div className="space-y-8">
      {/* 시험/과제 제목 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시험/과제 제목
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="제목을 입력하세요."
          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 분류 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          분류
        </label>
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="exam"
              checked={formData.type === 'exam'}
              onChange={(e) => onInputChange('type', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">시험</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="assignment"
              checked={formData.type === 'assignment'}
              onChange={(e) => onInputChange('type', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">과제</span>
          </label>
        </div>
      </div>

      {/* 시작/종료 일자 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시작 일자 / 종료 일자
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">시작 일자</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => onInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">종료 일자</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => onInputChange('endDate', e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 시험 응시 시간 제한 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          시험 응시 시간 제한
        </label>
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="timeLimit"
              value="none"
              checked={!formData.hasTimeLimit}
              onChange={() => onInputChange('hasTimeLimit', false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">사용 안함</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="timeLimit"
              value="use"
              checked={formData.hasTimeLimit}
              onChange={() => onInputChange('hasTimeLimit', true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">사용</span>
          </label>
        </div>
      </div>

      {/* 채점 결과 공개 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          채점 결과 공개
        </label>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">시험 중</h4>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="showDuring"
                  value="private"
                  checked={formData.showResultsDuring === 'private'}
                  onChange={(e) => onInputChange('showResultsDuring', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">비공개</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="showDuring"
                  value="public"
                  checked={formData.showResultsDuring === 'public'}
                  onChange={(e) => onInputChange('showResultsDuring', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">공개</span>
              </label>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">시험 종료 후</h4>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="showAfter"
                  value="private"
                  checked={formData.showResultsAfter === 'private'}
                  onChange={(e) => onInputChange('showResultsAfter', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">비공개</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="showAfter"
                  value="public"
                  checked={formData.showResultsAfter === 'public'}
                  onChange={(e) => onInputChange('showResultsAfter', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">공개</span>
              </label>
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
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="groups"
              value="none"
              checked={!formData.useGroups}
              onChange={() => onInputChange('useGroups', false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">사용 안함</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="groups"
              value="use"
              checked={formData.useGroups}
              onChange={() => onInputChange('useGroups', true)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">사용</span>
          </label>
        </div>
      </div>

      {/* 문제 선택 방식 */}
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          문제 선택 방식
        </label>
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="problemSelection"
              value="manual"
              checked={formData.problemSelection === 'manual'}
              onChange={(e) => onInputChange('problemSelection', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">직접 선택</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="problemSelection"
              value="conditional"
              checked={formData.problemSelection === 'conditional'}
              onChange={(e) => onInputChange('problemSelection', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">조건별 선택</span>
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          기존에 만들었던 문제를 시험에 추가 할 수 있습니다.
        </p>
      </div>
    </div>
  )
}






