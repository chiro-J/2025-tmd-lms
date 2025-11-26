import { Outlet } from 'react-router-dom'
import Header from './Header'
import { useSessionTracking } from '../hooks/useSessionTracking'

export default function MainLayout() {
  // 학습 시간 추적 자동 시작
  useSessionTracking();

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <Outlet />
    </div>
  )
}
