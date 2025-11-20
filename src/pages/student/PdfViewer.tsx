import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PdfViewer() {
  const [searchParams] = useSearchParams()
  const storageKey = searchParams.get('key') || ''
  const urlParam = searchParams.get('url') || ''

  // sessionStorage에서 PDF URL 가져오기 (우선) 또는 URL 파라미터 사용
  const pdfUrl = useMemo(() => {
    if (storageKey) {
      const storedUrl = sessionStorage.getItem(storageKey)
      if (storedUrl) {
        // 사용 후 정리
        sessionStorage.removeItem(storageKey)
        return storedUrl
      }
    }
    return urlParam
  }, [storageKey, urlParam])

  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null)

  // PDF 옵션 메모이제이션
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    }),
    []
  )

  // PDF 크기 계산
  const pageWidth = useMemo(() => {
    if (!pageSize) {
      // 페이지 크기를 아직 모르면 화면 너비의 90% 사용
      return typeof window !== 'undefined' ? window.innerWidth * 0.9 : 1200
    }
    // 원본 비율 유지하면서 화면 너비의 95%에 맞게 조정
    const availableWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : 1200
    const scale = availableWidth / pageSize.width
    return pageSize.width * scale
  }, [pageSize])

  // PDF 로드 성공 핸들러
  const handleLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages)
    setPageNumber(1)
    setLoading(true)

    // 첫 페이지의 원본 크기 가져오기
    try {
      const firstPage = await pdf.getPage(1)
      const viewport = firstPage.getViewport({ scale: 1.0 })
      setPageSize({
        width: viewport.width,
        height: viewport.height
      })
    } catch (error) {
      console.error('PDF 페이지 크기 가져오기 실패:', error)
    }

    setLoading(false)
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(numPages, newPage))
    setPageNumber(validPage)
  }

  const navigate = useNavigate()

  // URL 처리
  const processedPdfUrl = useMemo(() => {
    if (!pdfUrl) return ''
    if (pdfUrl.startsWith('http') || pdfUrl.startsWith('data:')) {
      return pdfUrl
    }
    // 상대 경로면 절대 URL로 변환
    if (pdfUrl.startsWith('/')) {
      return `http://localhost:3000${pdfUrl}`
    }
    return `http://localhost:3000/${pdfUrl}`
  }, [pdfUrl])

  // ESC 키로 창 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (window.opener) {
          window.close()
        } else {
          // 새 창이 아닌 경우 이전 페이지로 이동
          navigate(-1)
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [navigate])

  if (!processedPdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-2">PDF URL이 없습니다.</p>
                <button
                  onClick={() => {
                    if (window.opener) {
                      window.close()
                    } else {
                      navigate(-1)
                    }
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors text-sm font-medium text-gray-700"
                >
                  창 닫기
                </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">PDF 뷰어</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* 페이지 네비게이션 */}
          {numPages > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1 || loading}
                className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                title="이전 페이지"
              >
                <ChevronLeft className={`h-5 w-5 ${pageNumber === 1 || loading ? 'text-gray-400' : 'text-gray-700 group-hover:text-blue-600'}`} />
              </button>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value) || 1
                    handlePageChange(page)
                  }}
                  onFocus={(e) => e.target.select()}
                  className="w-12 px-1 py-1 text-center border-0 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={loading}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                />
                <span className="text-sm text-gray-500 font-medium">/</span>
                <span className="text-sm text-gray-700 font-semibold w-12 text-center tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{numPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === numPages || loading}
                className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                title="다음 페이지"
              >
                <ChevronRight className={`h-5 w-5 ${pageNumber === numPages || loading ? 'text-gray-400' : 'text-gray-700 group-hover:text-blue-600'}`} />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              if (window.opener) {
                window.close()
              } else {
                navigate(-1)
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="창 닫기"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* PDF 뷰어 */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-4">
        <Document
          file={processedPdfUrl}
          onLoadStart={() => setLoading(true)}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={(error) => {
            console.error('PDF 로드 에러:', error)
            setLoading(false)
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500">PDF 로딩 중...</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-500">
                <p className="mb-2">PDF 로드 실패</p>
                <p className="text-sm text-gray-500">{processedPdfUrl}</p>
                <button
                  onClick={() => {
                    if (window.opener) {
                      window.close()
                    } else {
                      navigate(-1)
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors text-sm font-medium text-gray-700"
                >
                  창 닫기
                </button>
              </div>
            </div>
          }
          options={pdfOptions}
        >
          <div style={{ width: pageWidth, position: 'relative', margin: '0 auto' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">페이지 로딩 중...</p>
                </div>
              </div>
            )}
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              devicePixelRatio={typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1}
              onLoadStart={() => setLoading(true)}
              onLoadSuccess={() => setLoading(false)}
              onLoadError={() => setLoading(false)}
              loading={
                <div className="flex items-center justify-center" style={{ width: pageWidth, minHeight: '400px' }}>
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500">페이지 로딩 중...</p>
                  </div>
                </div>
              }
            />
          </div>
        </Document>
      </div>
    </div>
  )
}

