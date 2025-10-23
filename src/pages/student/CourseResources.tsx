import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download, FileText, Image, Code, Link, Search, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { mockResources } from '../../mocks'
import type { Resource } from '../../types'

export default function CourseResources() {
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<Resource['type'] | 'all'>('all')

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || resource.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />
      case 'slide':
        return <Image className="h-5 w-5 text-blue-600" />
      case 'code':
        return <Code className="h-5 w-5 text-green-600" />
      case 'link':
        return <Link className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF'
      case 'slide':
        return '슬라이드'
      case 'code':
        return '코드'
      case 'link':
        return '링크'
      default:
        return '파일'
    }
  }

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'slide':
        return 'bg-blue-100 text-blue-800'
      case 'code':
        return 'bg-green-100 text-green-800'
      case 'link':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (resource: Resource) => {
    // Mock download
    console.log('Downloading:', resource.title)
    // In real app, this would trigger actual download
  }

  const resourceTypes: { value: Resource['type'] | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'pdf', label: 'PDF' },
    { value: 'slide', label: '슬라이드' },
    { value: 'code', label: '코드' },
    { value: 'link', label: '링크' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">강의 자료</h1>
          <p className="text-gray-600">강의에 필요한 자료들을 다운로드하세요</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="자료 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex space-x-2">
                {resourceTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(resource.type)}
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {resource.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                          {getTypeLabel(resource.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {resource.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>업로드: {new Date(resource.uploadedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    {resource.fileSize && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span>크기: {formatFileSize(resource.fileSize)}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDownload(resource)}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">자료가 없습니다</h3>
              <p className="text-gray-500">
                {searchQuery || selectedType !== 'all' 
                  ? '검색 조건에 맞는 자료가 없습니다.' 
                  : '아직 업로드된 자료가 없습니다.'}
              </p>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{mockResources.length}</div>
              <div className="text-sm text-gray-500">총 자료</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockResources.filter(r => r.type === 'pdf').length}
              </div>
              <div className="text-sm text-gray-500">PDF</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockResources.filter(r => r.type === 'slide').length}
              </div>
              <div className="text-sm text-gray-500">슬라이드</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockResources.filter(r => r.type === 'code').length}
              </div>
              <div className="text-sm text-gray-500">코드</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}











