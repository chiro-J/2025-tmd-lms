import { useState, useEffect } from 'react'
import { ChevronDown, Mail, MessageSquare, HelpCircle, Search, Send, CheckCircle, BookOpen, Clock, ArrowRight, Shield, Zap, FileText, Eye, X, Upload, XCircle, Image as ImageIcon, Download, File } from 'lucide-react'
import { getDownloadUrl } from '../../utils/download'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import type { FAQItem } from '../../types'
import * as adminApi from '../../core/api/admin'
import { uploadFile } from '../../core/api/upload'
import { useAuth } from '../../contexts/AuthContext'

export default function Help() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [loadingFAQ, setLoadingFAQ] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    courseName: '',
    courseNumber: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [myInquiries, setMyInquiries] = useState<adminApi.Inquiry[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<adminApi.Inquiry | null>(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState<Array<{ courseId: number; courseName: string; courseNumber: string }>>([])
  const [selectedCourse, setSelectedCourse] = useState<{ courseName: string; courseNumber: string } | null>(null)
  const [attachments, setAttachments] = useState<Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }>>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadFAQ = async () => {
      setLoadingFAQ(true)
      try {
        const { getFAQ } = await import('../../core/api/faq')
        const faq = await getFAQ('student')
        setFaqItems(faq)
      } catch (error) {
        console.error('FAQ 로드 실패:', error)
        setFaqItems([])
      } finally {
        setLoadingFAQ(false)
      }
    }
    loadFAQ()
  }, [])

  const filteredFAQ = faqItems.filter(item =>
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

  // 수강 코스 정보 로드
  useEffect(() => {
    if (user?.email) {
      const enrolledCoursesKey = `enrolledCourses_${user.email}`
      const courses = JSON.parse(
        localStorage.getItem(enrolledCoursesKey) || '[]'
      ) as Array<{ courseId: number; courseName: string; courseNumber: string }>
      setEnrolledCourses(courses)

      // 첫 번째 코스를 기본 선택
      if (courses.length > 0 && !selectedCourse) {
        setSelectedCourse(courses[0])
        setContactForm(prev => ({
          ...prev,
          courseName: courses[0].courseName,
          courseNumber: courses[0].courseNumber
        }))
      }
    }
  }, [user?.email])

  // 내 문의사항 로드
  useEffect(() => {
    const loadMyInquiries = async () => {
      if (!user?.email) return
      setLoadingInquiries(true)
      try {
        const data = await adminApi.getMyInquiries()
        setMyInquiries(data)
      } catch (error) {
        console.error('내 문의사항 로드 실패:', error)
        setMyInquiries([])
      } finally {
        setLoadingInquiries(false)
      }
    }
    loadMyInquiries()
  }, [user?.email])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('파일 크기는 100MB를 초과할 수 없습니다.');
      return;
    }

    setUploading(true);
    try {
      let fileType: 'pdf' | 'image' | 'video' = 'image';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type.startsWith('image/')) {
        fileType = 'image';
      }

      const result = await uploadFile(file, fileType, 'inquiry');
      setAttachments(prev => [...prev, result]);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      await adminApi.createInquiry({
        title: contactForm.subject,
        content: contactForm.message,
        courseName: contactForm.courseName || undefined,
        courseNumber: contactForm.courseNumber || undefined,
        attachments: attachments.length > 0 ? attachments : null
      })

      setSubmitSuccess(true)
      setContactForm({
        subject: '',
        message: '',
        courseName: selectedCourse?.courseName || '',
        courseNumber: selectedCourse?.courseNumber || ''
      })
      setAttachments([])

      // 문의사항 목록 새로고침
      if (user?.email) {
        const data = await adminApi.getMyInquiries()
        setMyInquiries(data)
      }

      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('문의사항 제출 실패:', error)
      alert('문의사항 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [...new Set(faqItems.map(item => item.category))]

  // 카테고리별로 FAQ 그룹화
  const faqByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredFAQ.filter(item => item.category === category)
    return acc
  }, {} as Record<string, FAQItem[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <div className="container-page py-6">
        {/* 헤더 섹션 - 제목, 설명, 검색창을 하나의 박스로 */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <div className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 mb-1">도움말 센터</h1>
                <p className="text-base text-gray-600">자주 묻는 질문을 확인하거나 관리자에게 직접 문의하세요</p>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <div className="pl-4 pr-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="질문을 검색해보세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus:ring-0 text-base py-3"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 내 문의사항 섹션 - 문의 내역이 있을 때만 표시 */}
            {!loadingInquiries && myInquiries.length > 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">내 문의사항</h2>
                  </div>

                  <div className="space-y-3">
                    {myInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedInquiry(inquiry)
                          setShowInquiryModal(true)
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-gray-900 truncate">{inquiry.title}</h3>
                              <span className={`px-2 py-1 text-base font-medium rounded-full flex-shrink-0 ${
                                inquiry.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {inquiry.status === 'completed' ? '완료' : '대기'}
                              </span>
                            </div>
                            <p className="text-base text-gray-600 line-clamp-2 mb-2">{inquiry.content}</p>
                            <div className="flex items-center gap-3">
                              <p className="text-base text-gray-400">{inquiry.createdDate}</p>
                              {inquiry.attachments && inquiry.attachments.length > 0 && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <File className="h-4 w-4" />
                                  <span className="text-sm">첨부파일 {inquiry.attachments.length}개</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Eye className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">자주하는 질문</h2>
                </div>

                {/* 카테고리 필터 */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                      searchQuery === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    전체
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSearchQuery(category)}
                      className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                        searchQuery === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* 카테고리별 FAQ 그룹 */}
                <div className="space-y-4">
                  {filteredFAQ.length > 0 ? (
                    Object.entries(faqByCategory).map(([category, items]) => {
                      if (items.length === 0) return null
                      return (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* 카테고리 헤더 */}
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">{category}</h3>
                          </div>
                          {/* 카테고리별 FAQ 아이템들 */}
                          <div className="divide-y divide-gray-100">
                            {items.map(item => {
                              const isExpanded = expandedItems.has(item.id)
                              return (
                                <div key={item.id} className="bg-white">
                                  <button
                                    onClick={() => toggleExpanded(item.id)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
                                  >
                                    <span className={`text-base font-medium flex-1 ${
                                      isExpanded ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                      {item.question}
                                    </span>
                                    <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`} />
                                  </button>
                                  {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                                      <p className="text-base text-gray-700 leading-relaxed pt-3 whitespace-pre-wrap">
                                        {item.answer}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-base text-gray-500 mb-4">검색 결과가 없습니다</p>
                      <Button
                        onClick={() => setSearchQuery('')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-base px-5 py-2"
                      >
                        전체 보기
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">문의하기</h2>
                    <p className="text-base text-gray-600">관리자에게 직접 문의하세요</p>
                  </div>
                </div>

                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-base text-green-700 font-medium">문의가 성공적으로 전송되었습니다!</p>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {enrolledCourses.length > 0 && (
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        수강 코스
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCourse ? `${selectedCourse.courseName}_${selectedCourse.courseNumber}` : ''}
                          onChange={(e) => {
                            const [courseName, courseNumber] = e.target.value.split('_')
                            const course = enrolledCourses.find(c => c.courseName === courseName && c.courseNumber === courseNumber)
                            if (course) {
                              setSelectedCourse(course)
                              setContactForm(prev => ({
                                ...prev,
                                courseName: course.courseName,
                                courseNumber: course.courseNumber
                              }))
                            }
                          }}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base appearance-none bg-white cursor-pointer"
                        >
                          <option value="">코스를 선택하세요 (선택사항)</option>
                          {enrolledCourses.map((course, index) => (
                            <option key={index} value={`${course.courseName}_${course.courseNumber}`}>
                              {course.courseName} - {course.courseNumber}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      제목 *
                    </label>
                    <Input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                      placeholder="문의 제목을 입력하세요"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      문의 내용 *
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none transition-all text-base"
                      rows={4}
                      required
                      placeholder="문의 내용을 자세히 입력해주세요"
                    />
                  </div>

                  {/* 첨부파일 */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      첨부파일 (선택사항)
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center space-y-1">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {uploading ? '업로드 중...' : '파일을 선택하세요'}
                          </span>
                          <span className="text-xs text-gray-500">이미지, PDF, 동영상 (최대 100MB)</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*,application/pdf,video/*"
                          disabled={uploading}
                        />
                      </label>

                      {/* 첨부파일 목록 */}
                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          {attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                {attachment.mimetype.startsWith('image/') ? (
                                  <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.originalname}</p>
                                  <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveAttachment(index)}
                                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="삭제"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="h-5 w-5 animate-spin" />
                        전송 중...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        문의 전송
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-lg bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">빠른 링크</h3>
                </div>
                <div className="space-y-3">
                  <a
                    href="mailto:support@lms.com"
                    className="flex items-center justify-between p-4 text-gray-700 hover:bg-purple-50 rounded-lg transition-all border border-transparent hover:border-purple-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <span className="text-base font-semibold">이메일 지원</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </a>
                  <a
                    href="tel:02-1234-5678"
                    className="flex items-center justify-between p-4 text-gray-700 hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-green-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span className="text-base font-semibold">전화 지원</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 문의사항 상세 모달 */}
      {showInquiryModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">문의사항 상세</h2>
                </div>
                <button
                  onClick={() => {
                    setShowInquiryModal(false)
                    setSelectedInquiry(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 문의 정보 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-base font-bold text-gray-900">{selectedInquiry.title}</h3>
                    <span className={`px-2 py-1 text-base font-semibold rounded-full ${
                      selectedInquiry.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedInquiry.status === 'completed' ? '답변 완료' : '답변 대기'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-base text-gray-600 mb-2">문의일: {selectedInquiry.createdDate}</p>
                    <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">{selectedInquiry.content}</p>

                    {/* 첨부파일 */}
                    {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">첨부파일:</p>
                        <div className="space-y-3">
                          {selectedInquiry.attachments.map((attachment, index) => {
                            // attachment가 문자열인지 객체인지 확인
                            const isString = typeof attachment === 'string';
                            const attachmentUrl = isString ? attachment : attachment.url;
                            const attachmentName = isString
                              ? attachment.split('/').pop() || `첨부파일 ${index + 1}`
                              : attachment.originalname || attachment.filename || `첨부파일 ${index + 1}`;
                            const attachmentSize = isString ? null : attachment.size;
                            const attachmentMimeType = isString
                              ? (attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? 'image/' : '')
                              : attachment.mimetype || '';

                            const isImage = attachmentMimeType.startsWith('image/') ||
                                           /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(attachmentUrl);

                            // 다운로드 URL 생성
                            const downloadUrl = isString
                              ? attachmentUrl
                              : getDownloadUrl(attachment);

                            // 이미지 미리보기 URL
                            const imageUrl = downloadUrl;

                            return (
                              <div key={index} className="space-y-2">
                                <a
                                  href={downloadUrl}
                                  download
                                  className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    {isImage ? (
                                      <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{attachmentName}</p>
                                      {attachmentSize && (
                                        <p className="text-xs text-gray-500">{(attachmentSize / 1024).toFixed(2)} KB</p>
                                      )}
                                    </div>
                                  </div>
                                  <Download className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                                </a>
                                {/* 이미지 미리보기 */}
                                {isImage && (
                                  <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                                    <img
                                      src={imageUrl}
                                      alt={attachmentName}
                                      className="w-full max-w-md h-auto rounded-lg border border-gray-200 object-contain mx-auto"
                                      onError={(e) => {
                                        console.error('이미지 로드 실패:', imageUrl);
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 답변 */}
                {selectedInquiry.response ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h3 className="text-base font-bold text-gray-900">관리자 답변</h3>
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedInquiry.response}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="text-base text-yellow-700">아직 답변이 등록되지 않았습니다. 답변은 평일 기준 1-2일 내에 등록됩니다.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => {
                    setShowInquiryModal(false)
                    setSelectedInquiry(null)
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-base px-5 py-2"
                >
                  닫기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

