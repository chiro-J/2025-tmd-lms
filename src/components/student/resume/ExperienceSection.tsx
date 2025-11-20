import { useState } from 'react'
import { Briefcase, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import ExperienceForm from './ExperienceForm'
import type { Experience } from '../../../contexts/ProfileContext'

interface ExperienceSectionProps {
  experiences: Experience[]
  onAdd: (data: Experience) => void
  onUpdate: (id: string, data: Experience) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function ExperienceSection({ experiences, onAdd, onUpdate, onDelete, isEditMode }: ExperienceSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">경력</h3>
        </div>
        {isEditMode && (
          <Button onClick={() => setShowForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        )}
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div className="space-y-4">
        {showForm && (
          <ExperienceForm
            onSave={(data) => {
              onAdd(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {experiences.map((exp) => (
          <div key={exp.id}>
            {editingId === exp.id ? (
              <ExperienceForm
                experience={exp}
                onSave={(data) => {
                  onUpdate(exp.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Card className="p-4 bg-base-100 border border-base-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content">{exp.company}</h4>
                    <p className="text-sm text-base-content/70">{exp.position}</p>
                    <p className="text-sm text-base-content/70">
                      {exp.startDate} ~ {exp.current ? '재직 중' : exp.endDate}
                    </p>
                    <p className="text-sm text-base-content/70 mt-2 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(exp.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(exp.id)}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        ))}

        {experiences.length === 0 && !showForm && (
          <p className="text-center text-base-content/50 py-8">경력 정보를 추가해주세요</p>
        )}
      </div>
    </Card>
  )
}
