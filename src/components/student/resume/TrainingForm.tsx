import { useState } from 'react'
import { X, Save } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Training } from '../../../contexts/ProfileContext'

interface TrainingFormProps {
  training?: Training
  onSave: (data: Training) => void
  onCancel: () => void
}

export default function TrainingForm({ training, onSave, onCancel }: TrainingFormProps) {
  const [formData, setFormData] = useState<Training>(training || {
    id: Date.now().toString(),
    institution: '',
    content: '',
    startDate: '',
    endDate: ''
  })

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <div>
          <label className="label">교육 기관</label>
          <Input
            placeholder="예: 패스트캠퍼스"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          />
        </div>
        <div>
          <label className="label">교육 내용</label>
          <Input
            placeholder="예: 프론트엔드 부트캠프"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">시작일</label>
            <Input
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">종료일</label>
            <Input
              type="month"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
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
