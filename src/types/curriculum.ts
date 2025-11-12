export type ContentBlockType = 'text' | 'markdown' | 'lexical' | 'pdf' | 'video' | 'image'

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
}

export interface Lesson {
  id: string
  title: string
  type: 'folder' | 'file'
  completed?: number
  total?: number
  children?: Lesson[]
  isNew?: boolean
  isSelected?: boolean
  studyDate?: string
}

export interface Curriculum {
  id: string
  title: string
  lessons: Lesson[]
}



