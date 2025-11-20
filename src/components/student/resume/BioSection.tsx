import { useRef, useEffect } from 'react'
import { User } from 'lucide-react'
import Card from '../../ui/Card'

interface BioSectionProps {
  bio: string
  onUpdate: (bio: string) => void
  isEditMode: boolean
}

export default function BioSection({ bio, onUpdate, isEditMode }: BioSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [bio])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">자기소개</h3>
        </div>
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div>
        {isEditMode ? (
          <>
            <textarea
              ref={textareaRef}
              placeholder="자신을 소개하는 글을 작성해주세요..."
              value={bio}
              onChange={(e) => onUpdate(e.target.value)}
              className="input w-full resize-none overflow-hidden min-h-[120px] text-lg"
              style={{ height: 'auto' }}
            />
            {bio && (
              <div className="mt-2 text-sm text-base-content/70">
                {bio.length} / 1000자
              </div>
            )}
          </>
        ) : (
          <p className="text-base-content py-2 whitespace-pre-wrap min-h-[120px]">
            {bio || '자기소개가 없습니다.'}
          </p>
        )}
      </div>
    </Card>
  )
}
