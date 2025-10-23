import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Mail, MessageSquare, HelpCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { mockFAQ } from '../../mocks'
import type { FAQItem } from '../../types'

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFAQ = mockFAQ.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setContactForm({ name: '', email: '', subject: '', message: '' })
    alert('문의가 성공적으로 전송되었습니다!')
  }

  const categories = [...new Set(mockFAQ.map(item => item.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">도움말</h1>
          <p className="text-gray-600">자주 묻는 질문과 문의 방법을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card>
              <div className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="FAQ 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </Card>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map(item => {
                  const isExpanded = expandedItems.has(item.id)
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-blue-600">
                                {item.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.question}
                            </h3>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-gray-200">
                          <div className="pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })
              ) : (
                <Card>
                  <div className="p-12 text-center">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                    <p className="text-gray-500">
                      다른 키워드로 검색해보시거나 문의하기를 이용해주세요.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Form Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">문의하기</h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 *
                    </label>
                    <Input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일 *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제목 *
                    </label>
                    <Input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      문의 내용 *
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? '전송 중...' : '문의 전송'}
                  </Button>
                </form>
              </div>
            </Card>

            {/* Quick Links */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 링크</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:support@lms.com"
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-3 text-blue-600" />
                    <span>이메일 지원</span>
                  </a>
                  <a
                    href="tel:02-1234-5678"
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-3 text-green-600" />
                    <span>전화 지원</span>
                  </a>
                  <a
                    href="/student/help"
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HelpCircle className="h-5 w-5 mr-3 text-purple-600" />
                    <span>온라인 채팅</span>
                  </a>
                </div>
              </div>
            </Card>

            {/* FAQ Categories */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSearchQuery(category)}
                      className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}









