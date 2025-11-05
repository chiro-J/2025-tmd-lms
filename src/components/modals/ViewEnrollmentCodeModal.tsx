import { useState } from 'react'
import ModalBase from './ModalBase'
import { Key, Copy, Check } from 'lucide-react'

interface ViewEnrollmentCodeModalProps {
  open: boolean
  onClose: () => void
  enrollmentCode: string | null | undefined
}

export default function ViewEnrollmentCodeModal({
  open,
  onClose,
  enrollmentCode
}: ViewEnrollmentCodeModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (enrollmentCode) {
      navigator.clipboard.writeText(enrollmentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const footer = (
    <div className="flex justify-end space-x-3">
      {enrollmentCode && (
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>복사</span>
            </>
          )}
        </button>
      )}
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        닫기
      </button>
    </div>
  )

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="수강코드"
      footer={footer}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Key className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {enrollmentCode ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">이 강좌의 수강코드입니다</p>
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-700 font-mono tracking-wider">
                {enrollmentCode}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              수강생에게 이 코드를 공유하세요
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">수강코드가 아직 생성되지 않았습니다</p>
            <p className="text-xs text-gray-500">
              새로 생성된 강좌는 자동으로 수강코드가 부여됩니다
            </p>
          </div>
        )}
      </div>
    </ModalBase>
  )
}


