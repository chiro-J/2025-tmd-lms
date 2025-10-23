import { useState } from 'react'
import { ArrowLeft, Check, Mail, Key, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function InviteStudents() {
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'code' | null>(null)
  const navigate = useNavigate()

  const rightActions = (
    <Link to="/instructor/course/1/students">
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로가기
      </Button>
    </Link>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="수강생 추가하기"
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
          <span className="text-base-content/70">수강생 추가하기</span>
        </nav>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-content" />
            </div>
            <span className="text-sm font-medium text-primary">추가 방법 선택</span>
          </div>
          <ArrowRight className="h-4 w-4 text-base-content/40" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-base-300 rounded-full flex items-center justify-center">
              <Mail className="h-4 w-4 text-base-content/40" />
            </div>
            <span className="text-sm text-base-content/50">초대 메일 발송</span>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content">추가 방법 선택하기</h1>
      </div>

      {/* Method Selection Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Invitation Card */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-200 ${
              selectedMethod === 'email' 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedMethod('email')}
          >
            <div className="relative">
              {selectedMethod === 'email' && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-content" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-base-content mb-4">초대 메일 발송</h3>
                
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <p className="text-base-content/70 text-sm leading-relaxed">
                  초대 메일을 발송하여 수강생을 현재 강좌에 초대합니다
                </p>
              </div>
            </div>
          </Card>

          {/* Course Code Card */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-200 ${
              selectedMethod === 'code' 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedMethod('code')}
          >
            <div className="relative">
              {selectedMethod === 'code' && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-content" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-base-content mb-4">수강 코드 전달</h3>
                
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-base-300 to-base-300/80 rounded-2xl flex items-center justify-center">
                    <div className="w-16 h-16 bg-base-100 rounded-xl flex items-center justify-center shadow-sm">
                      <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-primary-content text-xs font-mono">****</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-base-content/70 text-sm leading-relaxed">
                  강좌 고유 수강 코드를 수강생에게 전달하여 강좌에 초대합니다.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <Button 
            className={`px-8 py-3 rounded-xl ${
              selectedMethod 
                ? 'bg-primary hover:bg-primary/90 text-primary-content' 
                : 'bg-base-300 text-base-content/50 cursor-not-allowed'
            }`}
            disabled={!selectedMethod}
            onClick={() => {
              if (selectedMethod === 'email') {
                navigate('/instructor/course/1/invite-email')
              } else if (selectedMethod === 'code') {
                navigate('/instructor/course/1/invite-code')
              }
            }}
          >
            <span>다음</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </CoursePageLayout>
  )
}
