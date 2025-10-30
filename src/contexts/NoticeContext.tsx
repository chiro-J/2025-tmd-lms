import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Notice } from '../types';

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: number, notice: Partial<Notice>) => void;
  deleteNotice: (id: number) => void;
  getActiveNotices: () => Notice[];
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

// 초기 공지사항 데이터
const initialNotices: Notice[] = [
  {
    id: 1,
    title: "시스템 점검 안내",
    content: "1월 20일 새벽 2시-4시 시스템 점검 예정입니다.",
    date: "2025-01-15",
    createdDate: "2025-01-15",
    status: "active",
    author: "시스템 관리자",
    priority: "high"
  },
  {
    id: 2,
    title: "새로운 강의 출시",
    content: "React 고급 강의가 새롭게 출시되었습니다.",
    date: "2025-01-14",
    createdDate: "2025-01-14",
    status: "active",
    author: "강의 관리자",
    priority: "medium"
  }
];

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: Math.max(...notices.map(n => n.id), 0) + 1,
      date: noticeData.date || new Date().toISOString().split('T')[0],
      createdDate: noticeData.createdDate || new Date().toISOString().split('T')[0],
      status: noticeData.status || 'active',
      priority: noticeData.priority || 'medium'
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const updateNotice = (id: number, updatedData: Partial<Notice>) => {
    setNotices(prev => 
      prev.map(notice => 
        notice.id === id ? { ...notice, ...updatedData } : notice
      )
    );
  };

  const deleteNotice = (id: number) => {
    setNotices(prev => prev.filter(notice => notice.id !== id));
  };

  const getActiveNotices = () => {
    return notices.filter(notice => notice.status === 'active');
  };

  const value: NoticeContextType = {
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    getActiveNotices
  };

  return (
    <NoticeContext.Provider value={value}>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotice must be used within a NoticeProvider');
  }
  return context;
}
