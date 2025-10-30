import { useState } from 'react'
import { Camera, Mic, MicOff, Video, VideoOff, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function RealtimeProctoring() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  // Mock data
  const students = [
    {
      id: 1,
      name: '김학생',
      email: 'student1@example.com',
      status: 'online',
      videoEnabled: true,
      audioEnabled: true,
      suspiciousActivity: false,
      lastActivity: '2분 전'
    },
    {
      id: 2,
      name: '이학생',
      email: 'student2@example.com',
      status: 'online',
      videoEnabled: false,
      audioEnabled: true,
      suspiciousActivity: true,
      lastActivity: '1분 전'
    },
    {
      id: 3,
      name: '박학생',
      email: 'student3@example.com',
      status: 'offline',
      videoEnabled: false,
      audioEnabled: false,
      suspiciousActivity: false,
      lastActivity: '5분 전'
    },
    {
      id: 4,
      name: '최학생',
      email: 'student4@example.com',
      status: 'online',
      videoEnabled: true,
      audioEnabled: false,
      suspiciousActivity: false,
      lastActivity: '30초 전'
    }
  ]

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Settings className="h-4 w-4 mr-1" />
        감독 설정
      </Button>
      <Button
        className={`rounded-xl ${
          isMonitoring
            ? 'bg-error hover:bg-error/90 text-error-content'
            : 'bg-success hover:bg-success/90 text-success-content'
        }`}
        onClick={() => setIsMonitoring(!isMonitoring)}
      >
        {isMonitoring ? (
          <>
            <EyeOff className="h-4 w-4 mr-1" />
            감독 중지
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1" />
            감독 시작
          </>
        )}
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="실시간 감독"
      rightActions={rightActions}
    >
      {/* 감독 상태 카드 */}
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                isMonitoring ? 'bg-success' : 'bg-base-content/40'
              }`}></div>
              <div>
                <h3 className="text-lg font-semibold text-base-content">
                  {isMonitoring ? '감독 중' : '감독 대기'}
                </h3>
                <p className="text-sm text-base-content/70">
                  {isMonitoring ? '실시간으로 학생들을 모니터링하고 있습니다' : '감독을 시작하려면 버튼을 클릭하세요'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-base-content">
                {students.filter(s => s.status === 'online').length}
              </div>
              <div className="text-sm text-base-content/70">온라인 학생</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 학생 목록 */}
      <Card className="overflow-hidden">
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">학생 모니터링</h2>
          <span className="text-sm text-base-content/70">{students.length}명</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  학생
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  비디오
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  오디오
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  활동
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-base-200">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium text-base-content">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-base-content">{student.name}</div>
                        <div className="text-sm text-base-content/70">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'online'
                        ? 'bg-success/10 text-success'
                        : 'bg-base-300 text-base-content/70'
                    }`}>
                      {student.status === 'online' ? '온라인' : '오프라인'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.videoEnabled ? (
                        <Video className="h-4 w-4 text-success" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-base-content/40" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.audioEnabled ? (
                        <Mic className="h-4 w-4 text-success" />
                      ) : (
                        <MicOff className="h-4 w-4 text-base-content/40" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.suspiciousActivity ? (
                        <AlertTriangle className="h-4 w-4 text-error" />
                      ) : (
                        <div className="h-4 w-4"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary/80">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-base-content/70 hover:text-base-content">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-base-100 px-3 py-2 flex items-center justify-between border-t border-base-300">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-base-content/70">1</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-base-content/70">10개씩 보기</span>
          </div>
        </div>
      </Card>
    </CoursePageLayout>
  )
}
