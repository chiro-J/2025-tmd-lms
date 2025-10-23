import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings, PanelRight, Maximize, PictureInPicture, Camera, Subtitles } from 'lucide-react'
import VideoSideNav from '../../components/learning/VideoSideNav'

export default function Learning() {
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideControlsTimeoutRef = useRef<number | null>(null)
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
        console.error('PIP 오류:', error)
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
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // 초기 볼륨 설정
    video.volume = volume / 100

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

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
        className={`fixed top-0 left-0 z-40 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 ${
          showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          width: isSideNavExpanded ? 'calc(100vw - 448px)' : '100vw'
        }}
        onMouseEnter={() => setShowHeader(true)}
        onMouseLeave={() => setShowHeader(false)}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-xl font-bold mb-1">3. 원하는 경로에서 jupyter 설명하기</h1>
              <p className="text-gray-300 text-sm">문과생도, 비전공자도, 누구나 배울 수 있는 파이썬 (Python)!</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              ← 뒤로가기
            </button>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className={`fixed top-0 bottom-0 left-0 bg-gray-900 transition-all duration-300 group ${
          !showControls && isPlaying ? 'cursor-none' : 'cursor-default'
        }`}
        style={{
          width: isSideNavExpanded ? 'calc(100vw - 448px)' : '100vw'
        }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          src="/videos/sample.mp4"
          onClick={togglePlayPause}
          onError={(e) => {
            console.error('비디오 로드 오류:', e)
            console.log('비디오 소스:', videoRef.current?.src)
          }}
          onLoadStart={() => console.log('비디오 로딩 시작')}
          onLoadedData={() => console.log('비디오 데이터 로드 완료')}
          onCanPlay={() => console.log('비디오 재생 가능')}
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

        {/* Sidebar Toggle Button - Top Right (Only visible when not in fullscreen) */}
        {!isFullscreen && (
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
      </div>

      {/* Side Navigation */}
      <VideoSideNav
        activeTab={sideNavTab}
        onTabChange={setSideNavTab}
        isExpanded={isSideNavExpanded}
        onExpandChange={setIsSideNavExpanded}
      />
    </div>
  )
}