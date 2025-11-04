import { useState } from 'react'
import { Settings, Save, Bell, Shield, Globe, Database, Mail } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface SystemSettingsData {
  // 알림 설정
  emailNotifications: boolean
  systemMaintenanceAlert: boolean
  
  // 보안 설정
  passwordMinLength: number
  sessionTimeout: number
  twoFactorAuth: boolean
  
  // 플랫폼 설정
  platformName: string
  defaultLanguage: string
  maintenanceMode: boolean
  
  // 데이터베이스 설정
  autoBackup: boolean
  backupFrequency: string
  
  // 이메일 설정
  smtpHost: string
  smtpPort: number
  smtpUser: string
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsData>({
    emailNotifications: true,
    systemMaintenanceAlert: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorAuth: false,
    platformName: 'LMS',
    defaultLanguage: 'ko',
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    // TODO: API 호출로 설정 저장
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage('설정이 성공적으로 저장되었습니다.')
      setTimeout(() => setSaveMessage(null), 3000)
    }, 1000)
  }

  const updateSetting = <K extends keyof SystemSettingsData>(
    key: K,
    value: SystemSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">시스템 설정</h2>
          <p className="text-gray-600 mt-1">플랫폼 전반의 설정을 관리합니다</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {saveMessage}
        </div>
      )}

      {/* 알림 설정 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">이메일 알림</span>
              <p className="text-xs text-gray-500">시스템 이벤트 발생 시 이메일 알림을 받습니다</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">시스템 점검 알림</span>
              <p className="text-xs text-gray-500">시스템 점검 전 알림을 받습니다</p>
            </div>
            <input
              type="checkbox"
              checked={settings.systemMaintenanceAlert}
              onChange={(e) => updateSetting('systemMaintenanceAlert', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
          </label>
        </div>
      </Card>

      {/* 보안 설정 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">보안 설정</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 비밀번호 길이
            </label>
            <input
              type="number"
              min="6"
              max="20"
              value={settings.passwordMinLength}
              onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              세션 타임아웃 (분)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">2단계 인증</span>
              <p className="text-xs text-gray-500">추가 보안을 위한 2단계 인증 활성화</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => updateSetting('twoFactorAuth', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
          </label>
        </div>
      </Card>

      {/* 플랫폼 설정 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">플랫폼 설정</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              플랫폼 이름
            </label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => updateSetting('platformName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기본 언어
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">점검 모드</span>
              <p className="text-xs text-gray-500">시스템 점검 중 접근 제한</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
          </label>
        </div>
      </Card>

      {/* 데이터베이스 설정 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">데이터베이스 설정</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">자동 백업</span>
              <p className="text-xs text-gray-500">데이터베이스 자동 백업 활성화</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => updateSetting('autoBackup', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
          </label>
          {settings.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                백업 빈도
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* 이메일 설정 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">이메일 설정</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP 호스트
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => updateSetting('smtpHost', e.target.value)}
              placeholder="smtp.example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP 포트
              </label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP 사용자
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => updateSetting('smtpUser', e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

