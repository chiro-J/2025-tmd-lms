import { useState } from 'react'
import { GraduationCap, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import TrainingForm from './TrainingForm'
import type { Training } from '../../../contexts/ProfileContext'

interface TrainingSectionProps {
  trainings: Training[]
  onAdd: (data: Training) => void
  onUpdate: (id: string, data: Training) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function TrainingSection({ trainings, onAdd, onUpdate, onDelete, isEditMode }: TrainingSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">교육</h3>
        </div>
        {isEditMode && (
          <Button
            onClick={() => setShowForm(true)}
            className="btn-primary btn-sm"
          >
            <Plus className="h-4 w-4" />
            추가
          </Button>
        )}
      </div>
      <div className="border-t border-base-300 mb-4" />

      <div className="space-y-3">
        {trainings.map((training) => (
          <div key={training.id} className="border border-base-300 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{training.institution}</p>
                <p className="text-sm text-base-content/70">{training.content}</p>
                {training.startDate && training.endDate && (
                  <p className="text-sm text-base-content/60">
                    {training.startDate} ~ {training.endDate}
                    {(() => {
                      const start = new Date(training.startDate + '-01')
                      const end = new Date(training.endDate + '-01')
                      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                      return months > 0 ? ` (${months}개월)` : ''
                    })()}
                  </p>
                )}
              </div>
              {isEditMode && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(training.id)
                      setShowForm(true)
                    }}
                    className="text-primary hover:text-primary-focus"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(training.id)}
                    className="text-error hover:text-error-focus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {trainings.length === 0 && (
          <p className="text-sm text-base-content/50 text-center py-4">등록된 교육이 없습니다</p>
        )}
      </div>

      {showForm && (
        <TrainingForm
          training={editingId ? trainings.find(t => t.id === editingId) : undefined}
          onSave={(data) => {
            if (editingId) {
              onUpdate(editingId, data)
              setEditingId(null)
            } else {
              onAdd(data)
            }
            setShowForm(false)
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingId(null)
          }}
        />
      )}
    </Card>
  )
}
