import { Link } from 'react-router-dom'
import { ChevronLeft, Sparkles, Check, Eye, Calendar, Clock, Tag, Users, Play, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useCourseCreation } from '../../contexts/CourseCreationContext'

export default function CoursePreview() {
  const { courseData } = useCourseCreation()

  // Format category display
  const categoryDisplay = `${courseData.category1} > ${courseData.category2}`

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Enhanced Markdown to HTML converter
  const renderMarkdown = (text: string) => {
    if (!text) return ''

    let html = text

    // Code blocks with language syntax (```language ... ```)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'code'
      const languageColors: {[key: string]: string} = {
        'python': 'bg-blue-50 border-blue-200',
        'javascript': 'bg-yellow-50 border-yellow-200',
        'js': 'bg-yellow-50 border-yellow-200',
        'c': 'bg-purple-50 border-purple-200',
        'java': 'bg-orange-50 border-orange-200',
        'cpp': 'bg-indigo-50 border-indigo-200',
        'html': 'bg-red-50 border-red-200',
        'css': 'bg-pink-50 border-pink-200',
        'sql': 'bg-green-50 border-green-200',
        'bash': 'bg-gray-50 border-gray-200',
        'json': 'bg-teal-50 border-teal-200'
      }
      const colorClass = languageColors[language.toLowerCase()] || 'bg-gray-50 border-gray-200'
      return `<div class="my-4 rounded-lg overflow-hidden border ${colorClass}">
        <div class="px-3 py-1 text-xs font-semibold text-gray-600 border-b ${colorClass}">${language}</div>
        <pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-gray-800">${code.trim()}</code></pre>
      </div>`
    })

    // Horizontal Rule
    html = html.replace(/^---$/gm, '<hr class="my-8 border-t-2 border-gray-300" />')

    // Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // Inline code `code` (after code blocks)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

    // Blockquote
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-300 pl-4 py-2 my-4 text-gray-700 italic bg-blue-50/30">$1</blockquote>')

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-base-content mt-8 mb-4">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-base-content mt-10 mb-5">$1</h1>')

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')

    // Underline
    html = html.replace(/<u>(.+?)<\/u>/g, '<u>$1</u>')

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-gray-500">$1</del>')

    // Bullet lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 my-1 list-disc">$1</li>')

    // Numbered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 my-1 list-decimal">$1</li>')

    // Line breaks
    html = html.replace(/\n/g, '<br />')

    return html
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Minimalist Top Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                to="/instructor/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                강의자 홈
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">강좌 만들기</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/instructor/create/introduction">
                <Button
                  variant="outline"
                  className="text-sm px-4 py-2 border-gray-200 hover:border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  이전
                </Button>
              </Link>
              <Link to="/instructor/course/1/home">
                <Button className="text-sm px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm">
                  강좌 생성 완료
                  <Check className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Progress Indicator */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2 opacity-60">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">필수 설정</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2 opacity-60">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">강좌 소개</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                3
              </div>
              <span className="text-sm font-medium text-gray-900">미리 보기</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-base-content">
              미리 보기
            </h1>
          </div>
          <p className="text-gray-600">
            수강생들이 보게 될 강좌 소개 페이지를 확인해보세요
          </p>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Thumbnail Section */}
          <div className="relative h-80 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center">
            {courseData.thumbnail ? (
              <img src={courseData.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-white">
                <Play className="h-20 w-20 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-medium">강좌 썸네일 또는 소개 영상</p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-12">
            {/* Title & Meta */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {categoryDisplay}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  courseData.difficulty === '쉬움'
                    ? 'bg-emerald-100 text-emerald-700'
                    : courseData.difficulty === '보통'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  난이도: {courseData.difficulty}
                </span>
                {courseData.isPublic && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    공개 강좌
                  </span>
                )}
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {courseData.title || '강좌 제목을 입력해주세요'}
              </h2>

              <p className="text-lg text-gray-700">
                {courseData.description || '강좌에 대한 간단한 설명을 작성해주세요'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-10 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">진행 기간</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {courseData.durationStartDate && courseData.durationEndDate
                      ? `${courseData.durationStartDate} ~ ${courseData.durationEndDate}`
                      : '미정'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">학습 시간</p>
                  <p className="text-sm font-semibold text-gray-900">
                    교육 과정에서 계산
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">수강 인원</p>
                  <p className="text-sm font-semibold text-gray-900">제한 없음</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {courseData.tags.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">태그</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Introduction Video */}
            {courseData.videoUrl && getYouTubeVideoId(courseData.videoUrl) && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-base-content mb-6">소개 영상</h3>
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(courseData.videoUrl)}`}
                    title="Course introduction video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Course Content */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-base-content mb-6">강좌 소개</h3>
              {courseData.content ? (
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(courseData.content) }}
                />
              ) : (
                <p className="text-gray-500 italic">강좌 소개가 아직 작성되지 않았습니다.</p>
              )}
            </div>

            {/* Uploaded Images */}
            {courseData.uploadedImages && courseData.uploadedImages.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-base-content mb-6">첨부 이미지</h3>
                <div className="grid grid-cols-2 gap-4">
                  {courseData.uploadedImages.map((image, index) => (
                    <div key={index} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {courseData.uploadedFiles && courseData.uploadedFiles.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-base-content mb-6">첨부 파일</h3>
                <div className="space-y-3">
                  {courseData.uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">강좌 자료</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-8 border-t border-gray-200">
              <Button className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                수강 신청하기
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link to="/instructor/create/introduction">
            <Button variant="outline" className="px-6 py-3 text-sm border-gray-200 hover:border-gray-300">
              <ChevronLeft className="h-4 w-4 mr-2" />
              이전 단계
            </Button>
          </Link>
          <Link to="/instructor/course/1/home">
            <Button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all">
              강좌 생성 완료
              <Check className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
