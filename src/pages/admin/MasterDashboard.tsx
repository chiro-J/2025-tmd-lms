import React from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, CheckCircle, AlertCircle, BookOpen, BarChart3, Settings, ArrowRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function MasterDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마스터 관리자 대시보드</h1>
          <p className="text-gray-600">전체 시스템 관리 및 모니터링</p>
        </div>

        {/* Navigation Menu */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/master-dashboard">
              <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                대시보드
              </Button>
            </Link>
            <Link to="/admin/create-sub-admin">
              <Button variant="outline">
                서브 관리자 생성
              </Button>
            </Link>
            <Link to="/admin/instructor-approval">
              <Button variant="outline">
                강사 승인 관리
              </Button>
            </Link>
            <Button variant="outline" disabled>
              사용자 관리 (미구현)
            </Button>
            <Button variant="outline" disabled>
              강좌 관리 (미구현)
            </Button>
            <Button variant="outline" disabled>
              시스템 설정 (미구현)
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 강좌</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인 대기</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 세션</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 작업</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/create-sub-admin">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">서브 관리자 생성</h3>
                        <p className="text-sm text-gray-500">새로운 서브 관리자 계정 생성</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <Link to="/admin/instructor-approval">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">강사 승인 관리</h3>
                        <p className="text-sm text-gray-500">강사 가입 승인 및 관리</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
              </Link>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">사용자 관리</h3>
                      <p className="text-sm text-gray-400">미구현</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">강좌 관리</h3>
                      <p className="text-sm text-gray-400">미구현</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">새로운 강사가 가입했습니다</span>
                <span className="ml-auto text-gray-400">2분 전</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">새 강좌가 생성되었습니다</span>
                <span className="ml-auto text-gray-400">15분 전</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">서브 관리자가 승인되었습니다</span>
                <span className="ml-auto text-gray-400">1시간 전</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
