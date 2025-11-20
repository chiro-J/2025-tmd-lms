import { useState } from 'react'
import { X, Save } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Certificate } from '../../../contexts/ProfileContext'

interface CertificateFormProps {
  certificate?: Certificate
  onSave: (data: Certificate) => void
  onCancel: () => void
}

export default function CertificateForm({ certificate, onSave, onCancel }: CertificateFormProps) {
  const [formData, setFormData] = useState<Certificate>(certificate || {
    id: Date.now().toString(),
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: ''
  })

  return (
    <Card className="p-4 bg-base-100 border border-base-300">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="자격증명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="발급기관"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="month"
            placeholder="취득일"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
          <Input
            type="month"
            placeholder="만료일 (선택)"
            value={formData.expiryDate || ''}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
          <Input
            placeholder="자격번호 (선택)"
            value={formData.credentialId || ''}
            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
          />
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
