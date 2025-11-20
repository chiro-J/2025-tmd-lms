import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Image as ImageIcon, Clock } from 'lucide-react'
import { Github } from 'lucide-react'
import Card from '../ui/Card'
import ProfileBackgroundModal from './ProfileBackgroundModal'
import type { UserInfoCardProps } from '../../types'

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [sessionTime, setSessionTime] = useState<string>('0분')
  const [loginTime] = useState<number>(Date.now())
  const [githubUrl, setGithubUrl] = useState<string>('')
  const [notionUrl, setNotionUrl] = useState<string>('')

  // localStorage에서 배경 이미지 로드
  useEffect(() => {
    const savedBackground = localStorage.getItem(`profile_background_${user.id}`)
    if (savedBackground) {
      setBackgroundImage(savedBackground)
    }
  }, [user.id])

  // localStorage에서 소셜 링크 로드
  useEffect(() => {
    const savedGithub = localStorage.getItem(`github_url_${user.id}`)
    const savedNotion = localStorage.getItem(`notion_url_${user.id}`)
    if (savedGithub) setGithubUrl(savedGithub)
    if (savedNotion) setNotionUrl(savedNotion)
  }, [user.id])

  // 세션 시간 업데이트
  useEffect(() => {
    const updateSessionTime = () => {
      const elapsed = Date.now() - loginTime
      const minutes = Math.floor(elapsed / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) {
        setSessionTime(`${days}일 ${hours % 24}시간`)
      } else if (hours > 0) {
        setSessionTime(`${hours}시간 ${minutes % 60}분`)
      } else {
        setSessionTime(`${minutes}분`)
      }
    }

    updateSessionTime()
    const interval = setInterval(updateSessionTime, 60000) // 1분마다 업데이트

    return () => clearInterval(interval)
  }, [loginTime])

  const handleApplyBackground = (imageData: string) => {
    setBackgroundImage(imageData)
    // localStorage에 저장
    if (imageData) {
      localStorage.setItem(`profile_background_${user.id}`, imageData)
    } else {
      localStorage.removeItem(`profile_background_${user.id}`)
    }
  }

  return (
    <>
      <Card className="h-full border border-gray-300 overflow-hidden relative group/card">
        {/* 배경 이미지 */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            {/* 명암 처리는 hover 시에만 적용 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent group-hover/card:from-black/20 group-hover/card:via-black/40 group-hover/card:to-black/60 transition-all"></div>
          </div>
        )}

        {/* 세션 시간 표시 - 좌상단, hover 시 보임 */}
        <div className="absolute top-3 left-3 z-20 opacity-0 group-hover/card:opacity-100 transition-all">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border-2 text-xs font-medium shadow-lg backdrop-blur-sm ${
            backgroundImage
              ? 'border-white/80 text-white'
              : 'border-gray-700 text-gray-700'
          }`}>
            <Clock className="h-3.5 w-3.5" />
            <span>{sessionTime}</span>
          </div>
        </div>

        {/* 배경 편집 버튼 - hover 시 보임, 보라색 glow */}
        <button
          onClick={() => setIsBackgroundModalOpen(true)}
          className={`absolute top-3 right-3 p-2.5 border-2 rounded-lg transition-all z-20 group flex items-center justify-center opacity-0 group-hover/card:opacity-100 shadow-lg backdrop-blur-sm ${
            backgroundImage
              ? 'border-white/80 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]'
              : 'border-gray-700 text-gray-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]'
          }`}
          title="배경 이미지 설정"
          aria-label="배경 이미지 설정"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        {/* 컨텐츠 */}
        <div className="px-5 pt-12 pb-5 h-full flex flex-col items-center justify-center relative z-10">
          {/* 컨텐츠 그룹 */}
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            {/* User Info - hover 시 보임 */}
            <div className="space-y-2 text-center opacity-0 group-hover/card:opacity-100 transition-all">
              <h2 className={`text-lg font-semibold ${backgroundImage ? 'text-white drop-shadow-lg' : 'text-base-content'}`}>
                {user.name}
              </h2>
              <p className={`text-sm break-all ${backgroundImage ? 'text-white/90 drop-shadow' : 'text-base-content/70'}`}>
                {user.email}
              </p>
            </div>

            {/* Profile Edit Button - hover 시 보임, 파란색 glow */}
            <Link
              to="/student/profile"
              className={`w-full inline-flex items-center justify-center space-x-2 font-medium text-sm transition-all focus-visible:ring-2 focus-visible:outline-none rounded-lg px-4 py-2.5 border-2 opacity-0 group-hover/card:opacity-100 shadow-lg backdrop-blur-sm ${
                backgroundImage
                  ? 'border-white/80 text-white hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] focus-visible:ring-white'
                  : 'border-gray-700 text-gray-700 hover:text-gray-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] focus-visible:ring-gray-700'
              }`}
              aria-label="프로필 수정 페이지로 이동"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              <span>프로필 수정</span>
            </Link>

            {/* Social Links - hover 시 보임 */}
            {(githubUrl || notionUrl) && (
              <div className="flex items-center justify-center space-x-3 opacity-0 group-hover/card:opacity-100 transition-all">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg border-2 transition-all hover:scale-110 shadow-lg backdrop-blur-sm ${
                      backgroundImage
                        ? 'border-white/80 text-white hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                        : 'border-gray-700 text-gray-700 hover:text-gray-700 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                    }`}
                    title="GitHub"
                    aria-label="GitHub 프로필로 이동"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {notionUrl && (
                  <a
                    href={notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg border-2 transition-all hover:scale-110 shadow-lg backdrop-blur-sm ${
                      backgroundImage
                        ? 'border-white/80 text-white hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                        : 'border-gray-700 text-gray-700 hover:text-gray-700 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                    }`}
                    title="Notion"
                    aria-label="Notion 페이지로 이동"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 배경 이미지 설정 모달 */}
      <ProfileBackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        onApply={handleApplyBackground}
        currentBackground={backgroundImage}
      />
    </>
  )
}
