import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { List, MessageCircle, HelpCircle, ClipboardList, Smile, Subtitles, X, ChevronDown, ChevronRight, ChevronLeft, Menu, ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getCourse } from '../../core/api/courses'
import type { Course } from '../../types'

interface VideoSideNavProps {
  onTabChange: (tab: string) => void
  activeTab: string
  isExpanded: boolean
  onExpandChange: (isExpanded: boolean) => void
  courseId: number
}

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { id: 'curriculum', label: '커리큘럼', icon: List },
]

export default function VideoSideNav({ onTabChange, activeTab, isExpanded, onExpandChange, courseId }: VideoSideNavProps) {

  return (
    <>
      {/* Side Menu Bar - 항상 표시되는 좌측 버튼 영역 */}
      <div className="fixed left-0 bg-gray-50 z-50 flex flex-col items-center justify-center p-2 border-r-2 border-gray-300 shadow-sm" style={{ top: '56px', height: 'calc(100vh - 56px)' }}>
        {/* 목록 아이콘과 토글 버튼을 함께 중앙 배치 */}
        <div className="flex flex-col items-center space-y-2">
          {/* 목록 아이콘 */}
          <List className="h-5 w-5 text-gray-500" />
          {/* 토글 버튼 */}
          <button
            onClick={() => onExpandChange(!isExpanded)}
            className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            title={isExpanded ? '사이드바 숨기기' : '사이드바 보이기'}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Side Panel */}
      <div className={`fixed left-14 bg-white z-40 flex transition-transform duration-300 ease-in-out ${
        isExpanded ? 'translate-x-0 border-r-2 border-gray-300 shadow-lg' : '-translate-x-full'
      }`} style={{ top: '56px', width: '256px', height: 'calc(100vh - 56px)' }}>

        {/* Main Content Area */}
        <div className="flex flex-col h-full w-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto pt-0">
            {activeTab === 'curriculum' && <CurriculumContent courseId={courseId} />}
          </div>
        </div>
      </div>
    </>
  )
}

// Curriculum Content Component
interface CurriculumContentProps {
  courseId: number
}

function CurriculumContent({ courseId }: CurriculumContentProps) {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [modules, setModules] = useState<Array<{ id: number; title: string; lessons?: Array<{ id: number; title: string }> }>>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  // 현재 경로에서 역할 판단 및 뒤로가기 경로 결정
  const isInstructor = location.pathname.includes('/instructor/')
  const backPath = isInstructor
    ? `/instructor/course/${params.id}/home`
    : `/student/course/${params.id}`

  // DB에서 커리큘럼과 강좌 정보 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { getCurriculum } = await import('../../core/api/curriculum')
        const [curriculumData, courseData] = await Promise.all([
          getCurriculum(courseId),
          getCourse(courseId)
        ])
        setModules(curriculumData)
        setCourse(courseData)
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
        setModules([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }


  return (
    <div className="space-y-2">
      {/* Course Header - 상단에 위치, 본문 경로 표시와 같은 높이 */}
      <div className="px-6 border-b-2 border-gray-300 shadow-sm" style={{ height: '56px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(backPath)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          title={isInstructor ? '강좌 홈으로 이동' : '강좌 정보로 이동'}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {/* 강좌 제목 */}
        <h3 className="text-lg font-bold text-gray-900 whitespace-normal break-words leading-snug text-center flex-1">
          {course?.title || '강좌 제목을 불러올 수 없습니다'}
        </h3>
        {/* 오른쪽 여백 (뒤로가기 버튼과 대칭) */}
        <div className="flex-shrink-0 w-8 h-8" />
        {/* 부가 설명/진도율 바 제거 요청에 따라 미노출 */}
      </div>

      {/* Sections */}
      {modules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          커리큘럼이 없습니다.
        </div>
      ) : (
        modules.map((module, moduleIndex) => {
          const isExpanded = expandedSection === module.id
          return (
            <div
              key={module.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <div
                className="px-6 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setExpandedSection(isExpanded ? null : module.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-primary font-semibold text-sm flex-shrink-0">
                      {String(moduleIndex + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{module.title}</h4>
                  </div>
                </div>
              </div>

              {isExpanded && module.lessons && module.lessons.length > 0 && (
                <div>
                  {module.lessons.map((lesson: { id: number; title: string }, lessonIndex: number) => (
                    <div
                      key={lesson.id}
                      className="group px-6 py-2 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0"
                      onClick={() => {
                        // React Router의 navigate를 사용하여 URL 업데이트
                        // 현재 경로에 따라 적절한 경로로 이동
                        const learningPath = isInstructor
                          ? `/instructor/course/${params.id}/learning?lesson=${lesson.id}`
                          : `/student/learning/${params.id}?lesson=${lesson.id}`
                        navigate(learningPath, { replace: false })
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{lesson.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

// Script Content Component
function ScriptContent() {
  const scripts = [
    { time: '3:37', text: 'Lab 이야기 하는데 실험이잖아요.' },
    { time: '3:39', text: '어떤 실험이어서 조금 더 실험에 조금 더 최적화되어 있는 사실 환전 기능 특성이요.' },
    { time: '3:44', text: '기능 특성들이 어떤 인터페이스만 좀 더달고 추가적인 기능만 다르긴데 이제 실험에 좀' },
    { time: '3:49', text: '표차성을 맞췄다고 해서 이렇게 뭐하고 이름이 붙은 이출리케이션이 존재한다' },
    { time: '3:57', text: '그래서 어떤 거라도 써도 상관없는데 저희 수업에서는 주피터 노트북 대신 랩을 좀 거에요' },
    { time: '4:02', text: '내 그래서 이렇게 이름에서 좀 볼 수 있듯이 주피터 노트북 좀은 뭐임이 좀 했잖아요.' },
    { time: '4:09', text: '그렇죠? 노트북이에요.' },
    { time: '4:10', text: '말 그대로. 저희가 뭔가 코드를 작성하고 노트 필기를 하는 것처럼 그런 인터페이스로 되어' },
    { time: '4:14', text: '있고 마치지긴 뭐든 비슷한 인터페이스로 되어 있습니다.' },
    { time: '4:18', text: '자 그래서 우선 저희가 이제 주피터를 이 시스템 명령으로 실행을 시켜 수가 있는데 그 전에' },
    { time: '4:23', text: '헷갈 필요 있잖아요.' },
    { time: '4:24', text: '저희가 이제 노트북을 작성을 하잖아요.' },
    { time: '4:27', text: '그거를 저장을 하면 주피터를 파일이 생겨나는데 그 파일이 기본적으로 홀륨디에 저장이' },
    { time: '4:34', text: '테요. 이 홀륨터 같은 경우 사실 여러붐들이 많이 얼린 해 본 적이 거의 않았던 그 전체 거야.' },
    { time: '4:38', text: '왜냐하면은 저희가 이걸 열었을 때 홀륨터를 거롭개요.' },
    { time: '4:42', text: '저희가 홀륨터를 이렇게 들어갔는데냐면 내 PC에서 c드라이메에서 사용자 그 다음에 이' },
    { time: '4:50', text: 'choice choice 여기가 이제 홀륨디인데 사실 이 홀륨' }
  ]

  return (
    <div className="space-y-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="검색 /"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {scripts.map((script, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center space-x-2 min-w-[60px]">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">{script.time}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{script.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Q&A Content Component
function QnAContent() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-600">아직 질문이 없습니다.</p>
    </div>
  )
}

// Notes Content Component
function NotesContent() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ClipboardList className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-600">아직 노트가 없습니다.</p>
    </div>
  )
}

// Reaction Content Component
function ReactionContent() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Smile className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-600">반응 기능이 곧 추가됩니다.</p>
    </div>
  )
}

