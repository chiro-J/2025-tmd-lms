import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface AccountDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function AccountDeleteModal({ isOpen, onClose, onConfirm }: AccountDeleteModalProps) {
  const [inputValue, setInputValue] = useState('')
  const CONFIRM_TEXT = '회원탈퇴'

  if (!isOpen) return null

  const handleConfirm = () => {
    if (inputValue === CONFIRM_TEXT) {
      onConfirm()
      setInputValue('')
    }
  }

  const handleClose = () => {
    setInputValue('')
    onClose()
  }

  const isValid = inputValue === CONFIRM_TEXT

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300 bg-error/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <h2 className="text-xl font-bold text-error">회원 탈퇴</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-base-content/70 hover:text-base-content transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <h3 className="font-semibold text-base-content mb-2">⚠️ 탈퇴 전 반드시 확인해주세요</h3>
            <ul className="text-sm text-base-content/80 space-y-1.5 list-disc list-inside">
              <li>회원 탈퇴 시 <strong>모든 개인정보 및 학습 데이터가 영구 삭제</strong>됩니다.</li>
              <li>수강 중인 강의 정보가 모두 삭제되며 <strong>복구할 수 없습니다</strong>.</li>
              <li>작성한 게시글, 댓글은 삭제되지 않으며 '탈퇴 회원'으로 표시됩니다.</li>
              <li>동일한 이메일로 재가입이 가능하나, <strong>기존 데이터는 복구되지 않습니다</strong>.</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              탈퇴를 진행하시려면 아래 입력란에 '<span className="text-error font-bold">{CONFIRM_TEXT}</span>'를 정확히 입력해주세요.
            </label>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={CONFIRM_TEXT}
              className="input"
              autoFocus
            />
            {inputValue && !isValid && (
              <p className="text-xs text-error mt-1">
                '{CONFIRM_TEXT}'를 정확히 입력해주세요.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-base-300 bg-base-200">
          <Button
            onClick={handleClose}
            className="btn-outline flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 ${isValid ? 'btn-error' : 'btn-disabled'}`}
          >
            회원 탈퇴
          </Button>
        </div>
      </div>
    </div>
  )
}
