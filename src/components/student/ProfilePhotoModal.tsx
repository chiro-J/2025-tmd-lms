import { useState, useRef, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import ModalBase from '../modals/ModalBase'
import Button from '../ui/Button'
import { Upload, ZoomIn, ZoomOut, RotateCw, X, AlertCircle } from 'lucide-react'

interface ProfilePhotoModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (imageData: string) => void
  currentPhoto?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// 이력서 사진 규격 720x960 (3:4 비율)
const OUTPUT_WIDTH = 720
const OUTPUT_HEIGHT = 960
const ASPECT_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT // 0.75 (3:4)

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  onApply,
  currentPhoto
}: ProfilePhotoModalProps) {
  const [image, setImage] = useState<string | null>(currentPhoto || null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return '지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 업로드 가능합니다.'
    }

    if (file.size > MAX_FILE_SIZE) {
      return `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 업로드 가능합니다.`
    }

    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        if (img.width < OUTPUT_WIDTH || img.height < OUTPUT_HEIGHT) {
          setError(`이미지가 너무 작습니다. 최소 ${OUTPUT_WIDTH}x${OUTPUT_HEIGHT} 픽셀 이상의 이미지를 사용해주세요.`)
          return
        }

        setImage(event.target?.result as string)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
      }
      img.onerror = () => {
        setError('이미지를 불러올 수 없습니다. 다른 이미지를 선택해주세요.')
      }
      img.src = event.target?.result as string
    }
    reader.onerror = () => {
      setError('파일을 읽을 수 없습니다.')
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1))
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const createCroppedImage = async (): Promise<string | null> => {
    if (!image || !croppedAreaPixels) return null

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }

        // 출력 크기를 720x960으로 고정
        canvas.width = OUTPUT_WIDTH
        canvas.height = OUTPUT_HEIGHT

        // 크롭된 영역을 캔버스에 그리기
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          OUTPUT_WIDTH,
          OUTPUT_HEIGHT
        )

        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.src = image
    })
  }

  const handleApply = async () => {
    if (!image) {
      onApply('')
      onClose()
      return
    }

    const croppedImage = await createCroppedImage()
    if (croppedImage) {
      onApply(croppedImage)
      onClose()
    }
  }

  const handleCancel = () => {
    setImage(currentPhoto || null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setError(null)
    onClose()
  }

  return (
    <ModalBase
      open={isOpen}
      onClose={handleCancel}
      title="이력서 사진 설정"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleApply}>
            적용
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 안내 문구 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            이력서에 사용할 사진을 선택하세요. 크롭 영역의 비율은 표준 증명사진 크기(720x960, 3:4 비율)에 맞게 조정되어 있으며, 이미지를 드래그하여 위치를 조정하고 마우스 휠이나 버튼으로 줌을 조절할 수 있습니다.
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 파일 업로드 버튼 */}
        <div className="flex items-center justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            이미지 선택
          </Button>
          {image && (
            <Button
              variant="outline"
              onClick={handleRemoveImage}
              className="ml-2 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              이미지 제거
            </Button>
          )}
        </div>

        {/* 이미지 크롭 영역 */}
        {image ? (
          <div className="space-y-3">
            {/* 편집 컨트롤 */}
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 w-16 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-1"
              >
                <RotateCw className="h-4 w-4" />
                초기화
              </Button>
            </div>

            {/* Cropper 영역 */}
            <div className="flex justify-center">
              <div
                className="relative bg-gray-900 rounded-lg overflow-hidden"
                style={{ width: '600px', height: '600px' }}
              >
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={ASPECT_RATIO}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={true}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#1f2937'
                    },
                    cropAreaStyle: {
                      border: '4px solid white',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <p>크롭 비율: 3:4 (고정)</p>
              <p>|</p>
              <p>출력 크기: {OUTPUT_WIDTH} x {OUTPUT_HEIGHT}</p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              이미지를 드래그하여 위치를 조정하고, 마우스 휠이나 버튼으로 크기를 조절하세요.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
              style={{ width: '600px', height: '600px' }}
            >
              <div className="text-center px-4">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-base text-gray-600 font-medium mb-2">이미지를 선택해주세요</p>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG, WEBP (최대 5MB)
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  최소 {OUTPUT_WIDTH}x{OUTPUT_HEIGHT} 픽셀 이상
                </p>
                <div className="mt-6 inline-block px-4 py-2 border-2 border-dashed border-gray-400 rounded-lg">
                  <p className="text-xs text-gray-500">표준 증명사진 비율: 3:4 (고정)</p>
                  <p className="text-xs text-gray-500">출력 크기: {OUTPUT_WIDTH} x {OUTPUT_HEIGHT}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalBase>
  )
}





