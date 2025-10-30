import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <Outlet />
    </div>
  )
}
