import { useState } from 'react'
import { X, Save, ChevronDown } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Education } from '../../../contexts/ProfileContext'

interface EducationFormProps {
  education?: Education
  onSave: (data: Education) => void
  onCancel: () => void
}

export default function EducationForm({ education, onSave, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState<Education>(education || {
    id: Date.now().toString(),
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    status: 'enrolled',
    gpa: ''
  })

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="학교명"
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          />
          <Input
            placeholder="전공"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <select
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="input appearance-none pr-10"
            >
              <option value="">학위 선택</option>
              <option value="고등학교">고등학교</option>
              <option value="전문학사">전문학사</option>
              <option value="학사">학사</option>
              <option value="석사">석사</option>
              <option value="박사">박사</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="input appearance-none pr-10"
            >
              <option value="enrolled">재학 중</option>
              <option value="graduated">졸업</option>
              <option value="dropped">중퇴</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="month"
            placeholder="시작일"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            type="month"
            placeholder="종료일"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Input
            placeholder="학점 (선택)"
            value={formData.gpa || ''}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel} className="btn-outline">
            <X className="h-4 w-4" />
            취소
          </Button>
          <Button onClick={() => onSave(formData)} className="btn-primary">
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </div>
    </Card>
  )
}
