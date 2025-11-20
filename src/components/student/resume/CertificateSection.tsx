import { useState } from 'react'
import { Award, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import CertificateForm from './CertificateForm'
import type { Certificate } from '../../../contexts/ProfileContext'

interface CertificateSectionProps {
  certificates: Certificate[]
  onAdd: (data: Certificate) => void
  onUpdate: (id: string, data: Certificate) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function CertificateSection({ certificates, onAdd, onUpdate, onDelete, isEditMode }: CertificateSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">자격증</h3>
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
          <CertificateForm
            onSave={(data) => {
              onAdd(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {certificates.map((cert) => (
          <div key={cert.id}>
            {editingId === cert.id ? (
              <CertificateForm
                certificate={cert}
                onSave={(data) => {
                  onUpdate(cert.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Card className="p-4 bg-base-100 border border-base-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content">{cert.name}</h4>
                    <p className="text-sm text-base-content/70">{cert.issuer}</p>
                    <p className="text-sm text-base-content/70">
                      취득일: {cert.issueDate}
                      {cert.expiryDate && ` · 만료일: ${cert.expiryDate}`}
                    </p>
                    {cert.credentialId && (
                      <p className="text-sm text-base-content/70">자격번호: {cert.credentialId}</p>
                    )}
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(cert.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(cert.id)}
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

        {certificates.length === 0 && !showForm && (
          <p className="text-center text-base-content/50 py-8">자격증 정보를 추가해주세요</p>
        )}
      </div>
    </Card>
  )
}
