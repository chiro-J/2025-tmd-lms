import { useState } from 'react'
import { Settings, Save, Eye, EyeOff, Users, Calendar, Lock, Globe } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function CourseSettings() {
  const [settings, setSettings] = useState({
    courseName: '(1회차) 풀스택 과정',
    description: '풀스택 개발을 위한 종합 강의입니다.',
    isPublic: false,
    maxStudents: 50,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    allowEnrollment: true,
    requireApproval: false
  })

  const handleSave = () => {
    console.log('설정 저장:', settings)
    // 실제 저장 로직 구현
  }

  const rightActions = (
    <>
      <Button className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl" onClick={handleSave}>
        <Save className="h-4 w-4 mr-1" />
        저장
      </Button>
    </>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="강좌 설정"
      rightActions={rightActions}
    >
      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <div className="px-3 py-2 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">기본 정보</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">강좌명</label>
              <Input
                value={settings.courseName}
                onChange={(e) => setSettings({...settings, courseName: e.target.value})}
                placeholder="강좌명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">강좌 설명</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                className="w-full px-3 py-2 border border-base-300 rounded-lg bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="강좌 설명을 입력하세요"
              />
            </div>
          </div>
        </Card>

        {/* 공개 설정 */}
        <Card>
          <div className="px-3 py-2 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">공개 설정</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-base-content/70" />
                <div>
                  <div className="text-sm font-medium text-base-content">공개 강좌</div>
                  <div className="text-xs text-base-content/70">모든 사용자가 볼 수 있습니다</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isPublic}
                  onChange={(e) => setSettings({...settings, isPublic: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-base-content/70" />
                <div>
                  <div className="text-sm font-medium text-base-content">승인 필요</div>
                  <div className="text-xs text-base-content/70">수강 신청 시 승인이 필요합니다</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({...settings, requireApproval: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* 수강 설정 */}
        <Card>
          <div className="px-3 py-2 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">수강 설정</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">최대 수강생 수</label>
                <Input
                  type="number"
                  value={settings.maxStudents}
                  onChange={(e) => setSettings({...settings, maxStudents: parseInt(e.target.value)})}
                  placeholder="50"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-base-content/70" />
                  <div>
                    <div className="text-sm font-medium text-base-content">수강 신청 허용</div>
                    <div className="text-xs text-base-content/70">새로운 수강 신청을 받습니다</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowEnrollment}
                    onChange={(e) => setSettings({...settings, allowEnrollment: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">시작일</label>
                <Input
                  type="date"
                  value={settings.startDate}
                  onChange={(e) => setSettings({...settings, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">종료일</label>
                <Input
                  type="date"
                  value={settings.endDate}
                  onChange={(e) => setSettings({...settings, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CoursePageLayout>
  )
}




