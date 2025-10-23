import { useState } from 'react'
import { ArrowLeft, Mail, Plus, X, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function InviteByEmail() {
  const [emails, setEmails] = useState<string[]>([''])
  const [subject, setSubject] = useState('강좌 초대 메일')
  const [message, setMessage] = useState('안녕하세요!\n\n강좌에 초대해드립니다.\n\n아래 링크를 클릭하여 강좌에 참여해주세요.')

  const addEmailField = () => {
    setEmails([...emails, ''])
  }

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleSend = () => {
    const validEmails = emails.filter(email => email.trim() !== '')
    console.log('발송할 이메일들:', validEmails)
    console.log('제목:', subject)
    console.log('내용:', message)
    // 실제 메일 발송 로직 구현
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
      currentPageTitle="초대 메일 발송"
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
          <span className="text-base-content/70">초대 메일 발송</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Email Recipients */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-base-content">수신자 이메일</h3>
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-primary-content"
              onClick={addEmailField}
            >
              <Plus className="h-4 w-4 mr-1" />
              이메일 추가
            </Button>
          </div>
          
          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="w-full px-4 py-2 border border-base-300 rounded-lg bg-base-100 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    variant="outline"
                    className="text-error border-error hover:bg-error hover:text-error-content"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Email Content */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">메일 내용</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                제목
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-base-300 rounded-lg bg-base-100 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                메시지
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-base-300 rounded-lg bg-base-100 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="초대 메시지를 입력하세요..."
              />
            </div>
          </div>
        </Card>

        {/* Send Button */}
        <div className="flex justify-end">
          <Button 
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
            onClick={handleSend}
          >
            <Send className="h-4 w-4 mr-2" />
            초대 메일 발송
          </Button>
        </div>
      </div>
    </CoursePageLayout>
  )
}




