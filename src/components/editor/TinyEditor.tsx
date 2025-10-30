import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface TinyEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  height?: number
}

export default function TinyEditor({
  initialValue = '',
  onChange,
  height = 500
}: TinyEditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <div className="w-full">
      <Editor
        apiKey="2tnlyiflp6j1tjksj2mcjmntqbfckdkj7pabkbvi9vsuvzr8"
        onInit={(_, editor) => {
          editorRef.current = editor
          if (initialValue) {
            editor.setContent(initialValue)
          }
        }}
        onEditorChange={(content) => onChange?.(content)}
        init={{
          height,
          menubar: false,
          statusbar: false,
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
          toolbar: 'undo redo | blocks fontfamily fontsize | forecolor backcolor | bold italic underline strikethrough | link image media table | numlist bullist indent outdent | emoticons charmap | removeformat',
          font_family_formats: '나눔고딕=Nanum Gothic;나눔명조=Nanum Myeongjo;나눔바른고딕=Nanum Barun Gothic;나눔스퀘어=Nanum Square;맑은 고딕=Malgun Gothic;맑은 고딕체=Malgun Gothic;굴림=Gulim;돋움=Dotum;돋움체=DotumChe;바탕=Batang;Noto Sans KR=Noto Sans KR;Pretendard=Pretendard;Roboto=Roboto;Arial=Arial;Verdana=Verdana;Times New Roman=Times New Roman',
          font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 26pt 28pt 36pt 48pt',
          content_style: 'body { font-family: "Nanum Gothic", "나눔고딕", sans-serif; font-size: 14px; }',
        }}
      />
    </div>
  )
}
