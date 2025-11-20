import { useState, useEffect } from 'react'
import type { Memo } from '../types/calendar'
import * as memosApi from '../core/api/memos'
import { toKstDateString as toKstDateStringUtil, getTodayKst } from '../utils/calendar'

// useMemos에서 사용하는 toKstDateString (문자열과 Date 모두 처리)
const toKstDateString = (inputDate?: string | Date) => {
  if (!inputDate) return getTodayKst()
  if (typeof inputDate === 'string') return inputDate
  return toKstDateStringUtil(inputDate)
}

export function useMemos(initialMemos: Memo[] = []) {
  const [memos, setMemos] = useState<Memo[]>(initialMemos)
  const [loading, setLoading] = useState(false)
  const [isAddingMemo, setIsAddingMemo] = useState(false)
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null)
  const [memoTitle, setMemoTitle] = useState('')
  const [memoContent, setMemoContent] = useState('')
  const [memoDate, setMemoDate] = useState('')
  const [memoColor, setMemoColor] = useState('#3B82F6')
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Load memos from API on mount only (no dependencies to prevent re-fetching)
  useEffect(() => {
    const loadMemos = async () => {
      try {
        setLoading(true)
        const data = await memosApi.getMemos()
        setMemos(data)
      } catch (error) {
        console.error('Failed to load memos:', error)
        setMemos(initialMemos)
      } finally {
        setLoading(false)
      }
    }
    loadMemos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddMemo = (defaultDate?: string) => {
    setIsAddingMemo(true)
    setMemoTitle('')
    setMemoContent('')
    setMemoDate(toKstDateString(defaultDate))
    setMemoColor('#3B82F6')
  }

  const handleSaveMemo = async () => {
    if (!memoTitle.trim() && !memoContent.trim()) return

    try {
      if (editingMemoId) {
        // Update existing memo
        const updatedMemo = await memosApi.updateMemo(Number(editingMemoId), {
          title: memoTitle,
          content: memoContent,
          memoDate: memoDate,
          color: memoColor,
        })
        setMemos((prev) =>
          prev.map((memo) => (memo.id === editingMemoId ? updatedMemo : memo))
        )
        setEditingMemoId(null)
      } else {
        // Create new memo
        const newMemo = await memosApi.createMemo({
          title: memoTitle,
          content: memoContent,
          memoDate: memoDate,
          color: memoColor,
        })
        setMemos((prev) => [newMemo, ...prev])
      }
      handleCancelMemo()
    } catch (error) {
      console.error('Failed to save memo:', error)
      alert('메모 저장에 실패했습니다.')
    }
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

  const handleDeleteMemo = async (memoId: string) => {
    try {
      await memosApi.deleteMemo(Number(memoId))
      setMemos((prev) => prev.filter((memo) => memo.id !== memoId))
    } catch (error) {
      console.error('Failed to delete memo:', error)
      alert('메모 삭제에 실패했습니다.')
    }
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

  // Auto-record lesson (creates or updates memo)
  const autoRecordLesson = async (title: string, content: string, date?: string) => {
    const today = date ? toKstDateString(date) : toKstDateString()

    try {
      // Check if memo exists for this date and title
      const existingMemo = memos.find(
        (memo) => memo.date === today && memo.title === title
      )

      if (existingMemo) {
        // Update existing memo
        const updatedMemo = await memosApi.updateMemo(Number(existingMemo.id), {
          content: content,
        })
        setMemos((prev) =>
          prev.map((memo) => (memo.id === existingMemo.id ? updatedMemo : memo))
        )
      } else {
        // Create new memo
        const newMemo = await memosApi.createMemo({
          title: title,
          content: content,
          memoDate: today,
          color: '#10B981', // Green for learning-related memos
        })
        setMemos((prev) => [newMemo, ...prev])
      }
    } catch (error) {
      console.error('Failed to auto-record lesson:', error)
    }
  }

  return {
    memos,
    loading,
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
    handleDeleteMemo,
    getMemosForDate,
    getMemosForMonth,
    getMemosForWeek,
    autoRecordLesson,
  }
}
