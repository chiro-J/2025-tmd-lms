import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings, PanelRight, Maximize, PictureInPicture, Camera, Subtitles } from 'lucide-react'
import VideoSideNav from '../../components/learning/VideoSideNav'
import { autoRecordLesson } from '../../utils/calendarStorage'

export default function Learning() {
  const params = useParams()
  const courseId = Number(params.id) || 1
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideControlsTimeoutRef = useRef<number | null>(null)
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search))
  const [sideNavTab, setSideNavTab] = useState('curriculum')
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showPlaybackRateSlider, setShowPlaybackRateSlider] = useState(false)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  type ContentType = 'video' | 'slide' | 'text' | 'link' | 'code' | 'pdf'
  const [curriculumModules, setCurriculumModules] = useState<any[]>([])
  const [selectedLessonData, setSelectedLessonData] = useState<any>(null)
  const [loadingLesson, setLoadingLesson] = useState(false)

  const selectedLessonId = useMemo(() => searchParams.get('lesson') || '', [searchParams])

  // 커리큘럼 데이터 로드
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const { getCurriculum } = await import('../../core/api/curriculum')
        const modules = await getCurriculum(courseId)
        setCurriculumModules(modules)
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
      }
    }
    loadCurriculum()
  }, [courseId])

  // 선택된 레슨 데이터 찾기 및 DB에서 contentBlocks 불러오기
  useEffect(() => {
    if (!selectedLessonId || curriculumModules.length === 0) {
      setSelectedLessonData(null)
      return
    }

    setLoadingLesson(true)
    const lessonId = Number(selectedLessonId)

    // 모든 모듈의 레슨 중에서 선택된 레슨 찾기
    const loadLessonContent = async () => {
      for (const module of curriculumModules) {
        const lesson = module.lessons?.find((l: any) => l.id === lessonId)
        if (lesson) {
          try {
            // DB에서 레슨 상세 정보 불러오기
            const { getLesson } = await import('../../core/api/curriculum')
            const lessonData = await getLesson(courseId, module.id, lessonId)

            // description을 사용하여 표시
            let description = lessonData.description || lesson.description

            // description이 JSON 형식인지 확인 (contentBlocks 배열)
            if (description) {
              try {
                const parsed = JSON.parse(description)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  // JSON 배열인 경우: 텍스트 블록들만 추출하여 합치기
                  description = parsed
                    .filter((block: any) => block.type === 'text' || block.type === 'markdown')
                    .map((block: any) => block.content || '')
                    .filter((content: string) => content.trim() !== '')
                    .join('\n\n')
                }
              } catch {
                // JSON이 아닌 경우: 기존 텍스트 그대로 사용
              }
            }

            if (!description || description.trim() === '') {
              // 레슨 제목에 따라 기본 설명 텍스트 생성
              const title = lesson.title.toLowerCase()
              if (title.includes('타입스크립트') || title.includes('typescript')) {
                description = '타입스크립트는 JavaScript에 정적 타입을 추가한 언어입니다. 이 강의에서는 타입스크립트의 기본 문법, 타입 정의, 인터페이스, 제네릭 등의 핵심 개념을 학습하고 실습을 통해 활용 방법을 익힙니다.'
              } else {
                description = `${lesson.title}에 대한 강의입니다.\n\n이 강의에서는 ${lesson.title}의 핵심 개념과 실무 활용 방법을 학습합니다.`
              }
            }

            setSelectedLessonData({
              type: 'text' as ContentType,
              title: lesson.title,
              text: description
            })
          } catch (error: any) {
            // 404 에러는 무시하고 기본 내용으로 표시
            if (error?.response?.status !== 404) {
              console.error('레슨 내용 불러오기 실패:', error)
            }
            // 에러 시 기본 텍스트로 표시
            setSelectedLessonData({
              type: 'text' as ContentType,
              title: lesson.title,
              text: lesson.description || `${lesson.title}에 대한 강의입니다.`
            })
          }

          setLoadingLesson(false)
          return
        }
      }

      setSelectedLessonData(null)
      setLoadingLesson(false)
    }

    loadLessonContent()
  }, [selectedLessonId, curriculumModules, courseId])

  const selectedContent = useMemo(() => {
    if (loadingLesson) {
      return {
        type: 'text' as ContentType,
        title: '로딩 중...',
        text: '강의 내용을 불러오는 중입니다.'
      }
    }

    if (selectedLessonData) {
      return selectedLessonData
    }

    return {
      type: 'text' as ContentType,
      title: '학습 자료를 선택해 주세요',
      text: '오른쪽 커리큘럼에서 학습 항목을 선택하면 해당 자료가 표시됩니다.'
    }
  }, [selectedLessonData, loadingLesson])

  // URL 변경 감지 (뒤로가기 등)
  useEffect(() => {
    const onPop = () => setSearchParams(new URLSearchParams(window.location.search))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol / 100
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value)
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  const handlePictureInPicture = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else {
          await videoRef.current.requestPictureInPicture()
        }
      } catch (error) {
        // PIP 기능 오류 처리
      }
    }
  }

  const handleScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `screenshot-${Date.now()}.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)

    // 기존 타이머 클리어
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }

    // 5초 후 컨트롤 숨기기 (재생 중일 때만)
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 5000)
    }
  }

  // 재생 상태 변경 시 타이머 처리
  useEffect(() => {
    if (!isPlaying) {
      // 일시정지 상태면 타이머 클리어하고 컨트롤 표시
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
      setShowControls(true)
    }

    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // 풀스크린 상태 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 슬라이더 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // 볼륨 슬라이더 영역 체크
      if (showVolumeSlider && !target.closest('[data-volume-control]')) {
        setShowVolumeSlider(false)
      }
      // 배속 슬라이더 영역 체크
      if (showPlaybackRateSlider && !target.closest('[data-playback-control]')) {
        setShowPlaybackRateSlider(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showVolumeSlider, showPlaybackRateSlider])

  // 비디오 이벤트 리스너
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // 비디오가 80% 이상 재생되면 자동으로 일정 기록 (한 번만)
      if (video.duration > 0 && video.currentTime / video.duration >= 0.8) {
        const progress = Math.round((video.currentTime / video.duration) * 100)
        if (progress >= 80 && selectedContent.title) {
          // localStorage에 완료 표시를 저장하여 중복 기록 방지
          const completionKey = `lesson_completed_${selectedLessonId}_${selectedContent.title}`
          if (!localStorage.getItem(completionKey)) {
            autoRecordLesson(
              selectedContent.title,
              `강의 진행률: ${progress}% 완료`,
              new Date().toISOString().split('T')[0]
            )
            localStorage.setItem(completionKey, 'true')
          }
        }
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)

      // 강의 시작 시 일정 기록
      if (selectedContent.title) {
        const today = new Date().toISOString().split('T')[0]
        autoRecordLesson(
          selectedContent.title,
          `강의 학습 시작`,
          today
        )
      }
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)

      // 비디오 완료 시 일정 기록
      if (selectedContent.title) {
        autoRecordLesson(
          selectedContent.title,
          `강의 완료`,
          new Date().toISOString().split('T')[0]
        )
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    // 초기 볼륨 설정
    video.volume = volume / 100

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [selectedContent.title, selectedLessonId])

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false)
          if (hideControlsTimeoutRef.current) {
            clearTimeout(hideControlsTimeoutRef.current)
          }
        }
      }}
    >
      {/* Header Trigger Zone */}
      <div
        className="fixed top-0 left-0 right-0 h-16 z-50 pointer-events-none"
        onMouseEnter={() => setShowHeader(true)}
      />

      {/* Header / GNB */}
      <div
        className={`fixed top-0 left-0 z-40 transition-all duration-300 ${
          selectedContent.type === 'video'
            ? `bg-gradient-to-b from-black/80 to-transparent ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`
            : 'bg-white border-b border-gray-200 shadow-sm'
        }`}
        style={{
          width: isSideNavExpanded ? 'calc(100vw - 448px)' : '100vw'
        }}
        onMouseEnter={() => selectedContent.type === 'video' && setShowHeader(true)}
        onMouseLeave={() => selectedContent.type === 'video' && setShowHeader(false)}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold mb-1 whitespace-normal break-words leading-snug ${
                selectedContent.type === 'video' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedContent.title}
              </h1>
            </div>
            <button
              onClick={() => window.history.back()}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedContent.type === 'video'
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ← 뒤로가기
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div
        ref={videoContainerRef}
        className={`fixed top-16 bottom-0 left-0 transition-all duration-300 group ${
          selectedContent.type === 'video'
            ? `bg-gray-900 ${!showControls && isPlaying ? 'cursor-none' : 'cursor-default'}`
            : 'bg-gray-50'
        }`}
        style={{
          width: isSideNavExpanded ? 'calc(100vw - 448px)' : '100vw'
        }}
      >
        {/* Content Switch */}
        {selectedContent.type === 'video' && (
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            src={selectedContent.src}
            onClick={togglePlayPause}
            onError={() => {
              // 비디오 로드 오류 처리
            }}
            preload="metadata"
            controls={false}
          >
            {subtitlesEnabled && (
              <track
                kind="subtitles"
                src="/videos/sample.vtt"
                srcLang="ko"
                label="Korean"
                default
              />
            )}
          </video>
        )}
        {selectedContent.type === 'slide' && (
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="w-full min-h-full flex items-center justify-center p-8">
              <img src={selectedContent.src} alt="slide" className="max-w-full h-auto object-contain rounded-lg shadow-lg" />
            </div>
          </div>
        )}
        {selectedContent.type === 'text' && (
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="max-w-none w-full bg-white min-h-full">
              {/* 경로 표시 */}
              {(() => {
                const currentModule = curriculumModules.find((m: any) =>
                  m.lessons?.some((l: any) => l.id === Number(selectedLessonId))
                )
                const currentLesson = currentModule?.lessons?.find((l: any) => l.id === Number(selectedLessonId))
                return currentModule && currentLesson ? (
                  <div className="px-8 pt-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{currentModule.title}</span>
                      <span>/</span>
                      <span className="text-gray-700">{currentLesson.title}</span>
                    </div>
                  </div>
                ) : null
              })()}
              <div className="prose prose-lg max-w-none px-8 py-12">
                {selectedContent.text ? (
                  <div
                    className="text-gray-900 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{
                      __html: selectedContent.text.includes('<') && selectedContent.text.includes('>')
                        ? selectedContent.text
                        : selectedContent.text.replace(/\n/g, '<br>')
                    }}
                  />
                ) : (
                  <div className="text-gray-500">강의 내용이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedContent.type === 'pdf' && selectedContent.src && (
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="w-full h-full">
              <iframe
                src={selectedContent.src}
                className="w-full h-full border-0"
                title={selectedContent.title}
              />
            </div>
          </div>
        )}
        {selectedContent.type === 'link' && (
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="w-full min-h-full flex items-center justify-center p-8">
              <div className="max-w-xl w-full bg-white rounded-xl p-8 text-center shadow-lg">
                <p className="text-base text-gray-700 mb-6">외부 자료로 이동합니다.</p>
                <a href={selectedContent.linkUrl} target="_blank" rel="noreferrer" className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">링크 열기</a>
              </div>
            </div>
          </div>
        )}
        {selectedContent.type === 'code' && (
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="w-full min-h-full p-8">
              <pre className="w-full bg-[#0b1021] text-[#e6edf3] rounded-lg p-6 overflow-auto text-sm shadow-lg"><code>{selectedContent.code}</code></pre>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button - Top Right (Only visible when not in fullscreen) */}
        {selectedContent.type === 'video' && !isFullscreen && (
          <div className={`absolute top-20 right-6 z-10 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => setIsSideNavExpanded(!isSideNavExpanded)}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-lg p-3 transition-all duration-200 shadow-lg"
              title={isSideNavExpanded ? '사이드바 닫기' : '사이드바 열기'}
            >
              <PanelRight className={`h-6 w-6 transition-transform ${isSideNavExpanded ? '' : 'scale-x-[-1]'}`} />
            </button>
          </div>
        )}

        {/* Video Controls Overlay */}
        {selectedContent.type === 'video' && (
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 pointer-events-auto">

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-6 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  height: '4px',
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`,
                  WebkitAppearance: 'none',
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  width: 12px;
                  height: 12px;
                }
              `}</style>
              <div className="flex items-center justify-between text-white mt-2" style={{ fontSize: '11px' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between" style={{ fontSize: '14px' }}>
              <div className="flex items-center" style={{ gap: '16px' }}>
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:scale-110 transition-transform"
                  style={{ width: '32px', height: '32px' }}
                >
                  {isPlaying ? (
                    <Pause style={{ width: '32px', height: '32px' }} />
                  ) : (
                    <Play style={{ width: '32px', height: '32px' }} />
                  )}
                </button>

                <button
                  onClick={skipBackward}
                  className="text-white hover:scale-110 transition-transform"
                  title="10초 뒤로"
                  style={{ width: '24px', height: '24px' }}
                >
                  <SkipBack style={{ width: '24px', height: '24px' }} />
                </button>

                <button
                  onClick={skipForward}
                  className="text-white hover:scale-110 transition-transform"
                  title="10초 앞으로"
                  style={{ width: '24px', height: '24px' }}
                >
                  <SkipForward style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Volume Control */}
                <div className="relative" data-volume-control>
                  <button
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className="text-white hover:scale-110 transition-transform"
                    style={{ width: '24px', height: '24px' }}
                    title="볼륨"
                  >
                    <Volume2 style={{ width: '24px', height: '24px' }} />
                  </button>
                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                        }}
                      />
                      <p className="text-white text-xs text-center mt-2 font-medium">{volume}%</p>
                    </div>
                  )}
                </div>

                {/* Playback Speed Control */}
                <div className="relative" data-playback-control>
                  <button
                    onClick={() => setShowPlaybackRateSlider(!showPlaybackRateSlider)}
                    className="text-white hover:scale-110 transition-transform text-center"
                    style={{ minWidth: '48px', fontSize: '13px', fontWeight: '600' }}
                    title="재생 속도"
                  >
                    <span>{playbackRate}x</span>
                  </button>
                  {showPlaybackRateSlider && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-white text-xs text-center mb-3 font-medium">재생 속도</p>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.25"
                        value={playbackRate}
                        onChange={handlePlaybackRateChange}
                        className="w-32 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((playbackRate - 0.5) / 1) * 100}%, rgba(255,255,255,0.2) ${((playbackRate - 0.5) / 1) * 100}%, rgba(255,255,255,0.2) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-white text-xs mt-2">
                        <span>0.5x</span>
                        <span className="font-bold">{playbackRate}x</span>
                        <span>1.5x</span>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-white font-medium" style={{ fontSize: '13px' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div className="flex items-center" style={{ gap: '16px' }}>
                {/* Screenshot Button */}
                <button
                  onClick={handleScreenshot}
                  className="text-white hover:scale-110 transition-transform"
                  title="스크린샷"
                  style={{ width: '24px', height: '24px' }}
                >
                  <Camera style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Subtitles Toggle */}
                <button
                  onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                  className={`text-white hover:scale-110 transition-transform ${subtitlesEnabled ? 'bg-white/20 rounded-lg p-1' : ''}`}
                  title="자막"
                  style={{ width: '24px', height: '24px' }}
                >
                  <Subtitles style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Picture in Picture */}
                <button
                  onClick={handlePictureInPicture}
                  className="text-white hover:scale-110 transition-transform"
                  title="Picture-in-Picture"
                  style={{ width: '24px', height: '24px' }}
                >
                  <PictureInPicture style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Settings */}
                <button
                  className="text-white hover:scale-110 transition-transform"
                  title="설정"
                  style={{ width: '24px', height: '24px' }}
                >
                  <Settings style={{ width: '24px', height: '24px' }} />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:scale-110 transition-transform"
                  title="전체화면"
                  style={{ width: '24px', height: '24px' }}
                >
                  <Maximize style={{ width: '24px', height: '24px' }} />
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
        )}
      </div>

      {/* Side Navigation */}
      <VideoSideNav
        activeTab={sideNavTab}
        onTabChange={setSideNavTab}
        isExpanded={isSideNavExpanded}
        onExpandChange={setIsSideNavExpanded}
        courseId={courseId}
      />
    </div>
  )
}
