import { useState } from 'react'
import { X } from 'lucide-react'
import Card from '../ui/Card'

interface AdditionalInfoFormProps {
  job: string
  language: string
  languages: string[]
  onJobChange: (job: string) => void
  onLanguageChange: (language: string) => void
  onAddLanguage: (lang: string) => void
  onRemoveLanguage: (lang: string) => void
}

const availableLanguages = ['C/C++', 'PYTHON', 'JAVASCRIPT', 'JAVA', 'GO', 'RUST', 'PHP', 'RUBY']

export default function AdditionalInfoForm({
  job,
  language,
  languages,
  onJobChange,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage
}: AdditionalInfoFormProps) {
  const [newLanguage, setNewLanguage] = useState('')

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      onAddLanguage(newLanguage)
      setNewLanguage('')
    }
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">추가 정보</h3>
        
        <div className="space-y-6">
          {/* Job */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">직업</label>
            <input
              type="text"
              value={job}
              onChange={(e) => onJobChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="직업을 입력하세요"
            />
          </div>

          {/* Language Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">언어 설정</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="한국어">한국어</option>
              <option value="English">English</option>
              <option value="日本語">日本語</option>
              <option value="中文">中文</option>
            </select>
          </div>

          {/* Programming Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">프로그래밍 언어</label>
            <div className="space-y-3">
              {/* Current Languages */}
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => onRemoveLanguage(lang)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Add New Language */}
              <div className="flex space-x-2">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">언어 선택</option>
                  {availableLanguages
                    .filter(lang => !languages.includes(lang))
                    .map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  disabled={!newLanguage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}




