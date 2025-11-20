import { useState } from 'react'
import { X, Save } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Experience } from '../../../contexts/ProfileContext'

interface ExperienceFormProps {
  experience?: Experience
  onSave: (data: Experience) => void
  onCancel: () => void
}

export default function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Experience>(experience || {
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="회사명"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Input
            placeholder="직책/직위"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
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
            disabled={formData.current}
          />
          <label className="flex items-center space-x-2 px-3 py-2">
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm">재직 중</span>
          </label>
        </div>
        <textarea
          placeholder="업무 설명"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="input"
        />
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
