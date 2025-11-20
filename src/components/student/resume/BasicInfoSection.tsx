import { User } from 'lucide-react'
import Card from '../../ui/Card'
import Input from '../../ui/Input'

interface BasicInfoSectionProps {
  email: string
  portfolioUrl?: string
  phone: string
  job: string
  address: string
  onUpdate: (field: string, value: string) => void
  isEditMode: boolean
}

export default function BasicInfoSection({
  email,
  portfolioUrl,
  phone,
  job,
  address,
  onUpdate,
  isEditMode
}: BasicInfoSectionProps) {
  return (
    <Card className="p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">기본정보</h3>
        </div>
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm font-medium">이메일</label>
            {isEditMode ? (
              <Input
                type="email"
                value={email}
                onChange={(e) => onUpdate('email', e.target.value)}
                className="input"
                placeholder="example@email.com"
              />
            ) : (
              <p className="text-base-content py-2">{email || '미등록'}</p>
            )}
          </div>

          <div>
            <label className="label text-sm font-medium">홈페이지</label>
            {isEditMode ? (
              <Input
                type="url"
                value={portfolioUrl || ''}
                onChange={(e) => onUpdate('portfolioUrl', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            ) : (
              <p className="text-base-content py-2">{portfolioUrl || '미등록'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-sm font-medium">전화번호</label>
            {isEditMode ? (
              <Input
                type="tel"
                value={phone}
                onChange={(e) => onUpdate('phone', e.target.value)}
                className="input"
                placeholder="010-0000-0000"
              />
            ) : (
              <p className="text-base-content py-2">{phone || '미등록'}</p>
            )}
          </div>

          <div>
            <label className="label text-sm font-medium">관심 직군</label>
            {isEditMode ? (
              <Input
                type="text"
                value={job}
                onChange={(e) => onUpdate('job', e.target.value)}
                className="input"
                placeholder="프론트엔드 개발자, 백엔드 개발자 등"
              />
            ) : (
              <p className="text-base-content py-2">{job || '미등록'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label text-sm font-medium">거주지</label>
          {isEditMode ? (
            <Input
              type="text"
              value={address}
              onChange={(e) => onUpdate('address', e.target.value)}
              className="input"
              placeholder="서울특별시 강남구..."
            />
          ) : (
            <p className="text-base-content py-2">{address || '미등록'}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
