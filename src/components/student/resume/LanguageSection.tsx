import { useState } from 'react'
import { Code, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import LanguageForm from './LanguageForm'
import type { Language } from '../../../contexts/ProfileContext'

interface LanguageSectionProps {
  languages: Language[]
  onAdd: (data: Language) => void
  onUpdate: (id: string, data: Language) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function LanguageSection({ languages, onAdd, onUpdate, onDelete, isEditMode }: LanguageSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">외국어</h3>
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
        {languages.map((lang) => (
          <div key={lang.id} className="border border-base-300 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{lang.language}</p>
                <p className="text-sm text-base-content/70">
                  수준: {lang.level === 'native' ? '원어민' : lang.level === 'business' ? '비즈니스' : lang.level === 'conversational' ? '일상회화' : '기초'}
                </p>
                {lang.certificate && (
                  <p className="text-sm text-base-content/70">
                    자격증: {lang.certificate} {lang.certificateDate && `(${lang.certificateDate})`}
                  </p>
                )}
              </div>
              {isEditMode && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(lang.id)
                      setShowForm(true)
                    }}
                    className="text-primary hover:text-primary-focus"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lang.id)}
                    className="text-error hover:text-error-focus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {languages.length === 0 && (
          <p className="text-sm text-base-content/50 text-center py-4">등록된 외국어가 없습니다</p>
        )}
      </div>

      {showForm && (
        <LanguageForm
          language={editingId ? languages.find(l => l.id === editingId) : undefined}
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
