import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, MessageSquare, CheckCircle, ThumbsUp, Search, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { mockQnA } from '../../mocks'
import type { QnAItem } from '../../types'
import AskQuestionModal from '../../components/modals/AskQuestionModal'

export default function CourseQnA() {
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSolved, setFilterSolved] = useState<'all' | 'solved' | 'unsolved'>('all')
  const [showAskModal, setShowAskModal] = useState(false)

  const filteredQnA = mockQnA.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSolved = filterSolved === 'all' || 
                         (filterSolved === 'solved' && item.isSolved) ||
                         (filterSolved === 'unsolved' && !item.isSolved)
    return matchesSearch && matchesSolved
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}일 전`
    return formatDate(dateString)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">질문과 답변</h1>
              <p className="text-gray-600">강의 관련 질문을 하고 답변을 받아보세요</p>
            </div>
            <Button onClick={() => setShowAskModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              질문하기
            </Button>
          </div>
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
                    placeholder="질문 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterSolved('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterSolved === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterSolved('solved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterSolved === 'solved'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  해결됨
                </button>
                <button
                  onClick={() => setFilterSolved('unsolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterSolved === 'unsolved'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  미해결
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Q&A List */}
        {filteredQnA.length > 0 ? (
          <div className="space-y-4">
            {filteredQnA.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                          {item.question}
                        </h3>
                        {item.isSolved && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            해결됨
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{item.courseTitle}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>작성자: {item.author}</span>
                        <span>{getTimeAgo(item.createdAt)}</span>
                        <span>답변 {item.answers.length}개</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Answers Preview */}
                  {item.answers.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        {item.answers.slice(0, 2).map(answer => (
                          <div key={answer.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{answer.author}</span>
                                {answer.isAccepted && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    채택됨
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">{getTimeAgo(answer.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-2">{answer.content}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{answer.upvotes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {item.answers.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{item.answers.length - 2}개의 답변 더 보기
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">질문이 없습니다</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterSolved !== 'all' 
                  ? '검색 조건에 맞는 질문이 없습니다.' 
                  : '아직 등록된 질문이 없습니다.'}
              </p>
              <Button onClick={() => setShowAskModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                첫 질문하기
              </Button>
            </div>
          </Card>
        )}

        {/* Ask Question Modal */}
        {showAskModal && (
          <AskQuestionModal
            courseId={id || '1'}
            courseTitle="(1회차) 풀스택 과정"
            onClose={() => setShowAskModal(false)}
          />
        )}
      </div>
    </div>
  )
}












