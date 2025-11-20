import { useState } from 'react'
import { Code, Plus, X } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'

interface SkillsSectionProps {
  skills: string[]
  onAdd: (skill: string) => void
  onRemove: (skill: string) => void
  isEditMode: boolean
}

export default function SkillsSection({ skills, onAdd, onRemove, isEditMode }: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState('')

  const handleAdd = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      onAdd(skillInput.trim())
      setSkillInput('')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">보유 기술</h3>
        </div>
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div className="space-y-4">
        {isEditMode && (
          <div className="flex gap-2">
            <Input
              placeholder="기술 스택 입력 (예: React, TypeScript, Node.js)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              className="flex-1"
            />
            <Button onClick={handleAdd} className="btn-primary">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="badge badge-primary gap-2 py-3 px-4"
              >
                {skill}
                {isEditMode && (
                  <button onClick={() => onRemove(skill)}>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))
          ) : (
            <p className="text-center text-base-content/50 py-8 w-full">보유 기술을 추가해주세요</p>
          )}
        </div>
      </div>
    </Card>
  )
}
