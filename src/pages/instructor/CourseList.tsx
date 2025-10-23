import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Edit3, Eye, MoreVertical, Star, Users, Calendar, ArrowLeft } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { myCourses, jointCourses, searchCourses } from '../../data/courses'

export default function CourseList() {
  const [activeTab, setActiveTab] = useState('my-courses')
  const [searchTerm, setSearchTerm] = useState('')

  // 검색 기능이 적용된 강좌 목록
  const filteredCourses = searchTerm 
    ? searchCourses(searchTerm).filter(course => 
        activeTab === 'my-courses' 
          ? myCourses.some(myCourse => myCourse.id === course.id)
          : jointCourses.some(jointCourse => jointCourse.id === course.id)
      )
    : (activeTab === 'my-courses' ? myCourses : jointCourses)


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/instructor/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                강의자 홈
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">강좌 관리</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-gray-600 rounded-xl">
                <Filter className="h-4 w-4 mr-1" />
                필터
              </Button>
              <Link to="/instructor/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-1" />
                  강좌 만들기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              내가 개설한 강좌 ({myCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('co-courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'co-courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              공동 제작중인 강좌 ({jointCourses.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="강좌명으로 검색"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <Link 
            key={course.id} 
            to={`/instructor/course/${course.id}/home`}
            className="block"
            onClick={() => console.log('Navigating to course:', course.id)}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Course Image */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === '공개' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                      {activeTab === 'co-courses' && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {course.myRole}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students}명 수강</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>최근편집 {course.lastEdited}</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" className="text-blue-600 rounded-xl">
                    <Eye className="h-4 w-4 mr-1" />
                    강좌 홈
                  </Button>
                  <Button variant="outline" className="text-gray-600 rounded-xl">
                    <Edit3 className="h-4 w-4 mr-1" />
                    편집
                  </Button>
                  <Button variant="outline" className="text-gray-600 rounded-xl">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'my-courses' ? '아직 개설한 강좌가 없습니다' : '공동 제작중인 강좌가 없습니다'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'my-courses' 
              ? '첫 번째 강좌를 만들어보세요!' 
              : '다른 강의자와 함께 강좌를 제작해보세요!'
            }
          </p>
          <div className="space-y-4">
            <Link to="/instructor/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Plus className="h-4 w-4 mr-1" />
                강좌 만들기
              </Button>
            </Link>
          </div>
        </Card>
      )}
      </div>
    </div>
  )
}
