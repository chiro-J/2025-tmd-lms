import { useState } from 'react'
import { FolderGit2, Plus, Edit2, Trash2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import ProjectForm from './ProjectForm'
import type { Project } from '../../../contexts/ProfileContext'

interface ProjectSectionProps {
  projects: Project[]
  onAdd: (data: Project) => void
  onUpdate: (id: string, data: Project) => void
  onDelete: (id: string) => void
  isEditMode: boolean
}

export default function ProjectSection({ projects, onAdd, onUpdate, onDelete, isEditMode }: ProjectSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">프로젝트</h3>
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
          <ProjectForm
            onSave={(data) => {
              onAdd(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {projects.map((proj) => (
          <div key={proj.id}>
            {editingId === proj.id ? (
              <ProjectForm
                project={proj}
                onSave={(data) => {
                  onUpdate(proj.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Card className="p-4 bg-base-100 border border-base-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content">{proj.name}</h4>
                    <p className="text-sm text-base-content/70">{proj.role}</p>
                    <p className="text-sm text-base-content/70">
                      {proj.startDate} ~ {proj.current ? '진행 중' : proj.endDate}
                    </p>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {proj.url}
                      </a>
                    )}
                    <p className="text-sm text-base-content/70 mt-2 whitespace-pre-wrap">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="badge badge-primary badge-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(proj.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(proj.id)}
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

        {projects.length === 0 && !showForm && (
          <p className="text-center text-base-content/50 py-8">프로젝트 정보를 추가해주세요</p>
        )}
      </div>
    </Card>
  )
}
