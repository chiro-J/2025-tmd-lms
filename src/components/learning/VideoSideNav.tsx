import { useState } from 'react'
import { List, MessageCircle, HelpCircle, ClipboardList, Smile, Subtitles, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface VideoSideNavProps {
  onTabChange: (tab: string) => void
  activeTab: string
  isExpanded: boolean
  onExpandChange: (isExpanded: boolean) => void
}

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { id: 'curriculum', label: '커리큘럼', icon: List },
  { id: 'qna', label: 'Q&A', icon: MessageCircle },
  { id: 'notes', label: '노트', icon: ClipboardList },
  { id: 'reaction', label: '반응', icon: Smile },
  { id: 'scripts', label: '스크립트', icon: Subtitles },
]

export default function VideoSideNav({ onTabChange, activeTab, isExpanded, onExpandChange }: VideoSideNavProps) {

  return (
    <>
      {/* Expanded Side Panel */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 flex transition-transform duration-300 ease-in-out ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Main Content Area */}
        <div className="flex flex-col h-full w-96">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
            <button
              onClick={() => onExpandChange(false)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="사이드바 닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'curriculum' && <CurriculumContent />}
            {activeTab === 'scripts' && <ScriptContent />}
            {activeTab === 'qna' && <QnAContent />}
            {activeTab === 'notes' && <NotesContent />}
            {activeTab === 'reaction' && <ReactionContent />}
          </div>
        </div>

        {/* Side Menu Bar - Vertical navigation on the right */}
        <div className="flex flex-col items-center justify-center bg-gray-50 border-l border-gray-200 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Curriculum Content Component
function CurriculumContent() {
  const [expandedSection, setExpandedSection] = useState<number | null>(1)

  const curriculum = [
    {
      id: 1,
      title: '섹션 1 퀴즈',
      subtitle: 'AI 퀴즈 · 서학철',
      progress: { current: 1, total: 45 },
      percentage: 2,
      subItems: [
        { id: 1, title: '진도율 1/45', duration: '', completed: true },
        { id: 2, title: '퀴즈 0/7', duration: '', completed: false }
      ]
    },
    {
      id: 2,
      title: '섹션 1. 오리엔테이션',
      duration: '5강 · 33분',
      subItems: [
        { id: 1, title: '1. 0.1 지식 공유자 소개', duration: '03:04', completed: false },
        { id: 2, title: '2. 0.2 Why Python?', duration: '10:53', completed: false },
        { id: 3, title: '3. 0.3 수업스케 및 목표', duration: '10:45', completed: false },
        { id: 4, title: '4. 0.4 FAQ & wrap-up', duration: '08:50', completed: false }
      ]
    },
    {
      id: 3,
      title: '섹션 1 퀴즈',
      subtitle: 'AI 퀴즈 · 서학철',
      subItems: []
    },
    {
      id: 4,
      title: '섹션 2. 개발 환경 세팅',
      duration: '8강 · 1시간 21분',
      subItems: [
        { id: 1, title: '5. 1.1 Anaconda 소개', duration: '11:12', completed: false },
        { id: 2, title: '6. 1.2 Anacona 설치(Mac OS)', duration: '05:34', completed: false },
        { id: 3, title: '7. 1.3 Anacona 설치(Windows)', duration: '05:48', completed: false },
        { id: 4, title: '8. 1.4 컨덴션 시스템 명령어', duration: '13:04', completed: false }
      ]
    }
  ]

  return (
    <div className="space-y-3">
      {/* Course Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          문과생도, 비전공자도, 누구나 배울 수 있는 파이썬 (Python)!
        </h3>
        <p className="text-sm text-gray-600 mb-4">수강 기한 무제한</p>
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-900">진도율 1/45</span>
          </div>
          <span className="text-sm text-gray-500">2%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
        </div>
      </div>

      {/* Sections */}
      {curriculum.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-left flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{section.title}</h4>
              {section.subtitle && (
                <p className="text-xs text-gray-600">{section.subtitle}</p>
              )}
              {section.duration && (
                <p className="text-xs text-gray-600">{section.duration}</p>
              )}
              {section.progress && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-gray-900">
                      진도율 {section.progress.current}/{section.progress.total}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{section.percentage}%</span>
                </div>
              )}
            </div>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                expandedSection === section.id ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === section.id && section.subItems.length > 0 && (
            <div className="bg-white">
              {section.subItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  </div>
                  {item.duration && (
                    <span className="text-xs text-gray-500">{item.duration}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
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

