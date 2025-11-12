import { useState, useEffect, useRef } from 'react'

interface MarkdownEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  height?: number
}

export default function MarkdownEditor({
  initialValue = '',
  onChange,
  height = 500
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState<string>(initialValue)
  const rafRef = useRef<number | null>(null)
  const composingRef = useRef(false)
  const isInitialMountRef = useRef(true)

  // initialValue가 변경될 때만 업데이트 (내부 상태 변경 시에는 무시)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }
    setMarkdown(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value
    setMarkdown(newMarkdown)

    // IME 입력 중이면 onChange 호출 지연
    if (composingRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!composingRef.current && onChange) {
          onChange(newMarkdown)
        }
      })
      return
    }

    // 일반 입력: requestAnimationFrame으로 debouncing
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      onChange?.(newMarkdown)
    })
  }

  const handleCompositionStart = () => {
    composingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    composingRef.current = false
    const newMarkdown = e.currentTarget.value
    setMarkdown(newMarkdown)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      onChange?.(newMarkdown)
    })
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden" style={{ height }}>
      <textarea
        value={markdown}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="w-full p-4 resize-none focus:outline-none font-mono text-sm"
        style={{ height }}
        placeholder=""
      />
    </div>
  )
}
