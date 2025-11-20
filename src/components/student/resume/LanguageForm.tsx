import { useState } from 'react'
import { X, Save, ChevronDown } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Language } from '../../../contexts/ProfileContext'

interface LanguageFormProps {
  language?: Language
  onSave: (data: Language) => void
  onCancel: () => void
}

export default function LanguageForm({ language, onSave, onCancel }: LanguageFormProps) {
  const [formData, setFormData] = useState<Language>(language || {
    id: Date.now().toString(),
    language: '',
    certificate: '',
    certificateDate: '',
    level: 'conversational'
  })

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">언어</label>
            <Input
              placeholder="예: English"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />
          </div>
          <div>
            <label className="label">수준</label>
            <div className="relative">
              <select
                className="input appearance-none pr-10"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as Language['level'] })}
              >
                <option value="basic">기초</option>
                <option value="conversational">일상회화</option>
                <option value="business">비즈니스</option>
                <option value="native">원어민</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">자격증 (선택)</label>
            <Input
              placeholder="예: TOEIC"
              value={formData.certificate || ''}
              onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">취득일 (선택)</label>
            <Input
              type="month"
              value={formData.certificateDate || ''}
              onChange={(e) => setFormData({ ...formData, certificateDate: e.target.value })}
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
