import { Link, useNavigate } from 'react-router-dom'
import UserInfoCard from '../../components/student/UserInfoCard'
import EnrollBanner from '../../components/enroll/EnrollBanner'
import { mockRecent, mockUser, mockUserStats } from '../../mocks'

export default function StudentDashboard() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero Banner with Course Code Input - Full Screen */}
      <EnrollBanner
        bgImage="/photo/Fullstack.png"
        title="LMS 테스트 페이지"
        subtitle="수강코드를 입력하여 강의에 참여"
        buttonText="수강코드 입력"
        onSubmit={(code) => {
          console.log('입력된 코드:', code);
          // TODO: 실제 수강코드 검증 및 강좌 이동 로직 구현
        }}
      />

      <div className="min-h-screen bg-base-200">
        <main className="container-page py-8">
        <div className="space-y-8">
          {/* User Info Card - Full Width */}
          <UserInfoCard user={mockUser} stats={mockUserStats} />

          {/* Recent Learning Section */}
          <section className="card-panel p-6 border border-gray-300">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-base-content">최근 학습 강좌</h2>
            </div>
            <div className="space-y-4">
              {mockRecent.slice(1, 2).map((course) => (
                <div 
                  key={course.id} 
                  className="card-panel p-6 cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Course Thumbnail - 배너와 같은 이미지 사용 */}
                    <div 
                      className="w-40 h-24 rounded-lg relative overflow-hidden flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('/photo/Fullstack.png')` }}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-base-content mb-1">{course.title}</h3>
                      <p className="text-sm text-base-content/70 mb-1">마지막 수강 강의: 타입스크립트</p>
                      <p className="text-sm text-base-content/70 mb-3">마지막 학습 일자: 2025.10.13</p>
                    </div>
                    
                    {/* Action Button - 화살표 제거, 하늘색 계열, 가로길이 늘림 */}
                    <Link 
                      to={`/student/learning/${course.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-8 py-3"
                    >
                      이어하기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Learning Now Section - 작은 가로 카드들 */}
          <section className="card-panel p-6 border border-gray-300">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-base-content">수강중인 강좌(1)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockRecent.slice(0, 3).map((course) => (
                <div 
                  key={course.id} 
                  className="card-panel p-4 cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  <div className="space-y-3">
                    {/* Course Thumbnail - 배너와 같은 이미지 사용 */}
                    <div 
                      className="w-full h-24 rounded-lg relative overflow-hidden bg-cover bg-center"
                      style={{ backgroundImage: `url('/photo/Fullstack.png')` }}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-base-content line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-base-content/70">강의자: {course.instructor}</p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-base-content/70">진행률</span>
                          <span className="text-base-content/80 font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>


        </div>
        </main>
      </div>
    </>
  )
}