import { useState } from 'react'
import { GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import EducationForm from './EducationForm'
import type { Education } from '../../../contexts/ProfileContext'

interface EducationSectionProps {
  educations: Education[]
  onAdd: (data: Education) => void
  onUpdate: (id: string, data: Education) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function EducationSection({ educations, onAdd, onUpdate, onDelete, isEditMode }: EducationSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">학력</h3>
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
          <EducationForm
            onSave={(data) => {
              onAdd(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {educations.map((edu) => (
          <div key={edu.id}>
            {editingId === edu.id ? (
              <EducationForm
                education={edu}
                onSave={(data) => {
                  onUpdate(edu.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Card className="p-4 bg-base-100 border border-base-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content">{edu.school}</h4>
                    <p className="text-sm text-base-content/70">{edu.major} · {edu.degree}</p>
                    <p className="text-sm text-base-content/70">
                      {edu.startDate} ~ {edu.endDate} · {edu.status === 'graduated' ? '졸업' : edu.status === 'enrolled' ? '재학 중' : '중퇴'}
                    </p>
                    {edu.gpa && <p className="text-sm text-base-content/70">학점: {edu.gpa}</p>}
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(edu.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(edu.id)}
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

        {educations.length === 0 && !showForm && (
          <p className="text-center text-base-content/50 py-8">학력 정보를 추가해주세요</p>
        )}
      </div>
    </Card>
  )
}
