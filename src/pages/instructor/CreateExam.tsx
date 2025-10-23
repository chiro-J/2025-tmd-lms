import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, Calendar, Clock, Users, Settings, Plus, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CourseSidebar from '../../components/instructor/CourseSidebar'
import CourseHeader from '../../components/instructor/CourseHeader'

export default function CreateExam() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Mock current course data
  const currentCourse = {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '비공개'
  }
  const [formData, setFormData] = useState({
    title: '',
    type: 'exam', // 'exam' or 'assignment'
    startDate: '',
    endDate: '',
    hasTimeLimit: false,
    timeLimit: '',
    showResultsDuring: 'private', // 'private' or 'public'
    showResultsAfter: 'private', // 'private' or 'public'
    hideCode: false,
    hideScore: false,
    useGroups: false,
    problemSelection: 'manual', // 'manual' or 'conditional'
    problems: []
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseHeader 
        currentCourse={currentCourse}
        currentPageTitle="시험 문제"
      />

      <div className="flex">
        <CourseSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentCourse={currentCourse}
        />
        
        <div className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">시험 문제</h1>
          </div>

          <Card className="p-6">
          <div className="space-y-8">
            {/* 시험/과제 제목 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                시험/과제 제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
                    onChange={(e) => handleInputChange('type', e.target.value)}
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
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">과제</span>
                </label>
              </div>
            </div>

            {/* 시작/종료 일자 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                시작 일자 / 종료 일자 / 시간 제한 없음
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="startTime"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="startTime" className="text-sm text-gray-700">특정 시간</label>
                  </div>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="endTime"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="endTime" className="text-sm text-gray-700">특정 시간</label>
                  </div>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    onChange={() => handleInputChange('hasTimeLimit', false)}
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
                    onChange={() => handleInputChange('hasTimeLimit', true)}
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
                        onChange={(e) => handleInputChange('showResultsDuring', e.target.value)}
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
                        onChange={(e) => handleInputChange('showResultsDuring', e.target.value)}
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
                        onChange={(e) => handleInputChange('showResultsAfter', e.target.value)}
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
                        onChange={(e) => handleInputChange('showResultsAfter', e.target.value)}
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
                    onChange={(e) => handleInputChange('hideCode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">제출한 코드</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hideScore}
                    onChange={(e) => handleInputChange('hideScore', e.target.checked)}
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
                    onChange={() => handleInputChange('useGroups', false)}
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
                    onChange={() => handleInputChange('useGroups', true)}
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
                    onChange={(e) => handleInputChange('problemSelection', e.target.value)}
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
                    onChange={(e) => handleInputChange('problemSelection', e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">조건별 선택</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                기존에 만들었던 문제를 시험에 추가 할 수 있습니다.
              </p>
              <Button variant="outline" className="mt-3 text-gray-600 rounded-xl">
                문제 선택 하기
              </Button>
            </div>

            {/* 추가된 문제 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">추가된 문제</h3>
                <span className="text-sm text-gray-500">총점: 0</span>
              </div>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제목
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          점수(0)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          제한 횟수
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium mb-2">No data available in table</p>
                            <p className="text-sm">문제를 추가해보세요.</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  )
}
