import type { Memo } from '../types/calendar'

const STORAGE_KEY = 'lms_calendar_memos'

export const saveMemoToStorage = (memo: Memo) => {
  try {
    const existingMemos = getMemosFromStorage()
    const updatedMemos = [memo, ...existingMemos.filter(m => m.id !== memo.id)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemos))
  } catch (error) {
    console.error('Failed to save memo to storage:', error)
  }
}

export const getMemosFromStorage = (): Memo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const memos = JSON.parse(stored)
      // Date 객체 복원
      return memos.map((memo: any) => ({
        ...memo,
        createdAt: new Date(memo.createdAt),
        updatedAt: new Date(memo.updatedAt),
      }))
    }
  } catch (error) {
    console.error('Failed to get memos from storage:', error)
  }
  return []
}

export const autoRecordLesson = (title: string, content: string, date?: string) => {
  const today = date || new Date().toISOString().split('T')[0]
  const existingMemos = getMemosFromStorage()
  
  // 같은 날짜에 같은 제목의 메모가 있는지 확인
  const existingMemo = existingMemos.find(
    (memo) => memo.date === today && memo.title === title
  )

  if (existingMemo) {
    // 이미 있으면 업데이트
    const updatedMemo: Memo = {
      ...existingMemo,
      content: content,
      updatedAt: new Date(),
    }
    saveMemoToStorage(updatedMemo)
  } else {
    // 없으면 새로 추가
    const newMemo: Memo = {
      id: Date.now().toString(),
      title: title,
      content: content,
      date: today,
      color: '#10B981', // 학습 관련은 초록색
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveMemoToStorage(newMemo)
  }
}

