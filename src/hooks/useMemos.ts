import { useState, useEffect } from 'react'
import type { Memo } from '../types/calendar'
import { getMemosFromStorage, saveMemoToStorage } from '../utils/calendarStorage'

export function useMemos(initialMemos: Memo[] = []) {
  // localStorage에서 메모 로드
  const [memos, setMemos] = useState<Memo[]>(() => {
    const storedMemos = getMemosFromStorage()
    return storedMemos.length > 0 ? storedMemos : initialMemos
  })

  // localStorage와 동기화
  useEffect(() => {
    if (memos.length > 0) {
      try {
        localStorage.setItem('lms_calendar_memos', JSON.stringify(memos))
      } catch (error) {
        console.error('Failed to save memos to storage:', error)
      }
    }
  }, [memos])
  const [isAddingMemo, setIsAddingMemo] = useState(false)
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null)
  const [memoTitle, setMemoTitle] = useState('')
  const [memoContent, setMemoContent] = useState('')
  const [memoDate, setMemoDate] = useState('')
  const [memoColor, setMemoColor] = useState('#3B82F6')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleAddMemo = (defaultDate?: string) => {
    setIsAddingMemo(true)
    setMemoTitle('')
    setMemoContent('')
    setMemoDate(defaultDate || new Date().toISOString().split('T')[0])
    setMemoColor('#3B82F6')
  }

  const handleSaveMemo = () => {
    if (!memoTitle.trim() && !memoContent.trim()) return

    if (editingMemoId) {
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === editingMemoId
            ? {
                ...memo,
                title: memoTitle,
                content: memoContent,
                date: memoDate,
                color: memoColor,
                updatedAt: new Date(),
              }
            : memo
        )
      )
      setEditingMemoId(null)
    } else {
      const newMemo: Memo = {
        id: Date.now().toString(),
        title: memoTitle,
        content: memoContent,
        date: memoDate,
        color: memoColor,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setMemos((prev) => [newMemo, ...prev])
    }

    handleCancelMemo()
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemoId(memo.id)
    setMemoTitle(memo.title)
    setMemoContent(memo.content)
    setMemoDate(memo.date)
    setMemoColor(memo.color)
    setIsAddingMemo(true)
  }

  const handleCancelMemo = () => {
    setIsAddingMemo(false)
    setEditingMemoId(null)
    setMemoTitle('')
    setMemoContent('')
    setMemoDate('')
    setMemoColor('#3B82F6')
  }

  const getMemosForDate = (dateStr: string) => {
    return memos.filter((memo) => memo.date === dateStr)
  }

  const getMemosForMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    return memos.filter((memo) => {
      const memoDate = new Date(memo.date)
      return memoDate.getFullYear() === year && memoDate.getMonth() === month
    })
  }

  const getMemosForWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return memos.filter((memo) => {
      const memoDate = new Date(memo.date)
      return memoDate >= startOfWeek && memoDate <= endOfWeek
    })
  }

  // 강의 일정 자동 기록 함수
  const autoRecordLesson = (title: string, content: string, date?: string) => {
    const today = date || new Date().toISOString().split('T')[0]
    
    // 같은 날짜에 같은 제목의 메모가 있는지 확인
    const existingMemo = memos.find(
      (memo) => memo.date === today && memo.title === title
    )

    if (existingMemo) {
      // 이미 있으면 업데이트
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === existingMemo.id
            ? {
                ...memo,
                content: content,
                updatedAt: new Date(),
              }
            : memo
        )
      )
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
      setMemos((prev) => [newMemo, ...prev])
    }
  }

  return {
    memos,
    isAddingMemo,
    editingMemoId,
    memoTitle,
    memoContent,
    memoDate,
    memoColor,
    showColorPicker,
    setMemoTitle,
    setMemoContent,
    setMemoDate,
    setMemoColor,
    setShowColorPicker,
    handleAddMemo,
    handleSaveMemo,
    handleEditMemo,
    handleCancelMemo,
    getMemosForDate,
    getMemosForMonth,
    getMemosForWeek,
    autoRecordLesson,
  }
}





