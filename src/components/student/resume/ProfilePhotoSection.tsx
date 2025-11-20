import { User, Upload, X } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'

interface ProfilePhotoSectionProps {
  photoUrl?: string
  onUploadClick: () => void
  onRemoveClick: () => void
  isEditMode: boolean
}

export default function ProfilePhotoSection({ photoUrl, onUploadClick, onRemoveClick, isEditMode }: ProfilePhotoSectionProps) {
  return (
    <Card className="p-6 w-fit">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">이력서 사진</h3>
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div className="relative group">
        <div className="w-48 h-64 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-base-300">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="이력서 사진"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center px-4">
              <User className="h-16 w-16 text-base-content/30 mx-auto mb-2" />
              <p className="text-sm text-base-content/50">사진 없음</p>
              <p className="text-xs text-base-content/30 mt-1">720x960</p>
            </div>
          )}
        </div>

        {isEditMode && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex flex-col gap-2">
              <Button
                onClick={onUploadClick}
                className="btn-primary btn-sm flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {photoUrl ? '사진 변경' : '사진 업로드'}
              </Button>
              {photoUrl && (
                <Button
                  onClick={onRemoveClick}
                  className="btn-primary btn-sm flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  사진 제거
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
