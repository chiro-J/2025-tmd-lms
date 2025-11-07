import { useState, useEffect } from 'react'

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

  useEffect(() => {
    setMarkdown(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value
    setMarkdown(newMarkdown)
    onChange?.(newMarkdown)
  }

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden" style={{ height }}>
      <textarea
        value={markdown}
        onChange={handleChange}
        className="w-full p-4 resize-none focus:outline-none font-mono text-sm"
        style={{ height }}
        placeholder="# 제목

## 소제목

본문 내용을 작성하세요.

- 리스트 1
- 리스트 2

**굵게** *기울임*"
      />
    </div>
  )
}
