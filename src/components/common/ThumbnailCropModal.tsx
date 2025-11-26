import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check } from 'lucide-react'
import ModalBase from '../modals/ModalBase'
import Button from '../ui/Button'

interface ThumbnailCropModalProps {
  isOpen: boolean
  imageSrc: string
  onClose: () => void
  onCropComplete: (croppedImageBlob: Blob) => void
  aspectRatio?: number // 기본값 16/9
}

export default function ThumbnailCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9,
}: ThumbnailCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }, [aspectRatio])

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = canvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    // Crop이 픽셀 단위인지 퍼센트인지 확인하고 픽셀 단위로 변환
    const isPixelCrop = crop.unit === 'px' || crop.unit === undefined
    const pixelCrop = isPixelCrop
      ? crop
      : {
          x: (crop.x / 100) * image.width,
          y: (crop.y / 100) * image.height,
          width: (crop.width / 100) * image.width,
          height: (crop.height / 100) * image.height,
        }

    const pixelRatio = window.devicePixelRatio
    canvas.width = pixelCrop.width * pixelRatio * scaleX
    canvas.height = pixelCrop.height * pixelRatio * scaleY

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    // 회전과 스케일이 없을 때는 간단하게 크롭만 수행
    if (rotate === 0 && scale === 1) {
      const cropX = pixelCrop.x * scaleX
      const cropY = pixelCrop.y * scaleY
      ctx.drawImage(
        image,
        cropX,
        cropY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio
      )
    } else {
      // 회전이나 스케일이 있을 때는 전체 이미지를 그리고 크롭 영역만 추출
      // 임시 캔버스에 회전/스케일 적용된 이미지 그리기
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      const scaledWidth = image.naturalWidth * scale
      const scaledHeight = image.naturalHeight * scale
      tempCanvas.width = Math.max(scaledWidth, scaledHeight) * 2
      tempCanvas.height = Math.max(scaledWidth, scaledHeight) * 2

      const centerX = tempCanvas.width / 2
      const centerY = tempCanvas.height / 2

      tempCtx.save()
      tempCtx.translate(centerX, centerY)
      tempCtx.rotate(rotate * (Math.PI / 180))
      tempCtx.scale(scale, scale)
      tempCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
      tempCtx.restore()

      // 크롭 영역 계산 (회전된 좌표계에서)
      const scaledCropX = (pixelCrop.x * scaleX * scale) + centerX - (scaledWidth / 2)
      const scaledCropY = (pixelCrop.y * scaleY * scale) + centerY - (scaledHeight / 2)

      // 최종 캔버스에 크롭 영역만 그리기
      ctx.drawImage(
        tempCanvas,
        scaledCropX,
        scaledCropY,
        pixelCrop.width * scaleX * scale,
        pixelCrop.height * scaleY * scale,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio
      )
    }

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Failed to create blob')
          }
          resolve(blob)
        },
        'image/jpeg',
        0.95
      )
    })
  }, [completedCrop, scale, rotate])

  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImg()
      if (croppedBlob) {
        onCropComplete(croppedBlob)
        onClose()
      }
    } catch (error) {
      console.error('이미지 크롭 실패:', error)
      alert('이미지 크롭에 실패했습니다.')
    }
  }

  return (
    <ModalBase open={isOpen} onClose={onClose} title="썸네일 자르기">
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            이미지를 드래그하여 원하는 영역을 선택하세요. (비율: 16:9)
          </p>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-700">
              크기 조절:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="ml-2"
              />
              {scale.toFixed(1)}x
            </label>
            <label className="text-sm text-gray-700">
              회전:
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotate}
                onChange={(e) => setRotate(Number(e.target.value))}
                className="ml-2"
              />
              {rotate}°
            </label>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={50}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxHeight: '70vh' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>

        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            취소
          </Button>
          <Button onClick={handleCropComplete}>
            <Check className="w-4 h-4 mr-2" />
            적용
          </Button>
        </div>
      </div>
    </ModalBase>
  )
}

