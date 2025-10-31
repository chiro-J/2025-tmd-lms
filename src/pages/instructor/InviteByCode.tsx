import { useState } from 'react'
import { ArrowLeft, Copy, Check, Key, Users, Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function InviteByCode() {
  const [copied, setCopied] = useState(false)
  const courseCode = 'LMS2024-001'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(courseCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 복사 실패 처리
    }
  }

  const rightActions = (
    <Link to="/instructor/course/1/invite-students">
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로가기
      </Button>
    </Link>
  )

  return (
    <CoursePageLayout
      currentPageTitle="수강 코드 전달"
      rightActions={rightActions}
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Link
            to="/instructor/course/1/students"
            className="px-3 py-1 bg-base-200 text-base-content/70 rounded-lg hover:bg-base-300 transition-colors"
          >
            수강자 관리 홈
          </Link>
          <span className="text-base-content/50">/</span>
          <Link
            to="/instructor/course/1/invite-students"
            className="px-3 py-1 bg-base-200 text-base-content/70 rounded-lg hover:bg-base-300 transition-colors"
          >
            수강생 추가하기
          </Link>
          <span className="text-base-content/50">/</span>
          <span className="text-base-content/70">수강 코드 전달</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Course Code Card */}
        <Card className="p-8 mb-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="h-10 w-10 text-primary-content" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">강좌 수강 코드</h2>
            <p className="text-base-content/70">아래 코드를 수강생에게 전달해주세요</p>
          </div>

          <div className="bg-base-200 rounded-xl p-6 mb-6">
            <div className="text-4xl font-mono font-bold text-primary mb-2 tracking-wider">
              {courseCode}
            </div>
            <div className="text-sm text-base-content/60">
              이 코드를 입력하면 강좌에 자동으로 등록됩니다
            </div>
          </div>

          <Button
            className={`px-8 py-3 rounded-xl ${
              copied
                ? 'bg-success hover:bg-success/90 text-success-content'
                : 'bg-primary hover:bg-primary/90 text-primary-content'
            }`}
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                복사 완료!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                코드 복사하기
              </>
            )}
          </Button>
        </Card>

        {/* Course Information */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">강좌 정보</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">강좌명</div>
                <div className="font-medium text-base-content">풀스택 웹 개발 과정</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">수강 기간</div>
                <div className="font-medium text-base-content">2024.01.01 - 2024.12.31</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">총 강의 수</div>
                <div className="font-medium text-base-content">26강</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-base-content/70">수강 코드</div>
                <div className="font-medium text-base-content font-mono">{courseCode}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">사용 방법</h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="font-medium text-base-content mb-1">수강 코드 복사</div>
                <div className="text-sm text-base-content/70">위의 "코드 복사하기" 버튼을 클릭하여 수강 코드를 클립보드에 복사합니다.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="font-medium text-base-content mb-1">수강생에게 전달</div>
                <div className="text-sm text-base-content/70">복사한 수강 코드를 메신저, 이메일, 문자 등을 통해 수강생에게 전달합니다.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="font-medium text-base-content mb-1">수강생 등록</div>
                <div className="text-sm text-base-content/70">수강생이 LMS 사이트에서 해당 코드를 입력하면 자동으로 강좌에 등록됩니다.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </CoursePageLayout>
  )
}















