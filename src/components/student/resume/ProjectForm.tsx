import { useState } from 'react'
import { X, Save } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Project } from '../../../contexts/ProfileContext'

interface ProjectFormProps {
  project?: Project
  onSave: (data: Project) => void
  onCancel: () => void
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project || {
    id: Date.now().toString(),
    name: '',
    description: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    techStack: [],
    url: ''
  })

  const [techInput, setTechInput] = useState('')

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] })
      setTechInput('')
    }
  }

  const removeTech = (index: number) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) })
  }

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <Input
          placeholder="프로젝트명"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="역할"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Input
            type="url"
            placeholder="URL (선택)"
            value={formData.url || ''}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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
            <span className="text-sm">진행 중</span>
          </label>
        </div>
        <textarea
          placeholder="프로젝트 설명"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="input"
        />
        <div>
          <label className="label">기술 스택</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="기술 입력 후 Enter"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
            />
            <Button onClick={addTech} className="btn-outline">추가</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map((tech, index) => (
              <span key={index} className="badge badge-primary gap-2">
                {tech}
                <button onClick={() => removeTech(index)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
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
