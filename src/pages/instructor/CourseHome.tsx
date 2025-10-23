import { ClipboardList, Users, ExternalLink, Edit3, Play, Star, AlertCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function CourseHome() {

  return (
    <CoursePageLayout 
      currentPageTitle="강좌 홈"
    >
      {/* Course Overview Card */}
      <Card className="p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {/* Course Image */}
            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/photo/Fullstack.png"
                alt="풀스택 과정"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Course Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">(1회차) 풀스택 과정</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">22명 수강</span>
                </div>
                <div className="text-sm text-gray-500">
                  최근편집 <span className="font-semibold text-gray-900">김강사</span> <span className="text-gray-400">|</span> 메인 강의자 <span className="text-gray-400">|</span> <span className="text-gray-500">25.09.02</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Edit3 className="h-4 w-4 mr-2" />
                  강좌 편집
                </Button>
                <Button variant="outline" className="text-gray-600 rounded-xl">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  미리보기
                </Button>
                <Button variant="outline" className="text-gray-600 rounded-xl">
                  <Play className="h-4 w-4 mr-2" />
                  강의 재생
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 수강생</p>
              <p className="text-2xl font-bold text-gray-900">22</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">완료율</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">평균 평점</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Ongoing Class */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">진행 중인 수업</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">1강. React 기초</h4>
                  <p className="text-sm text-gray-600">현재 진행 중</p>
                </div>
              </div>
              <Button variant="outline" className="text-blue-600 rounded-xl">
                수업 참여
              </Button>
            </div>
          </div>
        </Card>

        {/* Posted Announcements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">게시된 공지사항</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <h4 className="font-medium text-gray-900">중간고사 일정 안내</h4>
                  <p className="text-sm text-gray-600">2024.09.15</p>
                </div>
              </div>
              <Button variant="outline" className="text-gray-600 rounded-xl">
                자세히 보기
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Exams */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 시험</h3>
          <div className="h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ClipboardList className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs">등록된 시험이 없습니다.</p>
            </div>
          </div>
        </Card>
      </div>
    </CoursePageLayout>
  )
}