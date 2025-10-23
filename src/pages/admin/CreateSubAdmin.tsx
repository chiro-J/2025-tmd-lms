import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Shield, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";

export default function CreateSubAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Content Manager",
    permissions: {
      userManagement: false,
      contentManagement: true,
      systemSettings: false,
      instructorApproval: false
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const roles = [
    { value: "Content Manager", label: "콘텐츠 관리자", description: "강의 및 자료 관리" },
    { value: "User Manager", label: "사용자 관리자", description: "수강생 및 강의자 관리" },
    { value: "System Manager", label: "시스템 관리자", description: "시스템 설정 및 모니터링" },
    { value: "Support Manager", label: "지원 관리자", description: "고객 지원 및 문의 관리" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const generatePassword = () => {
    setIsGenerating(true);
    // 비밀번호 생성 시뮬레이션
    setTimeout(() => {
      const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-4).toUpperCase();
      setGeneratedPassword(password);
      setFormData(prev => ({ ...prev, password, confirmPassword: password }));
      setIsGenerating(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("서브 관리자 생성:", formData);
    // 실제 구현에서는 API 호출
    navigate("/admin/sub-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/master-dashboard")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">서브 관리자 생성</h1>
              <p className="text-gray-600">새로운 서브 관리자 계정을 생성합니다</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <Section title="기본 정보">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    이름
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="input"
                    placeholder="서브 관리자 이름"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    이메일
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="input"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
            </Section>

            {/* 비밀번호 설정 */}
            <Section title="비밀번호 설정">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">비밀번호 생성</h3>
                    <p className="text-xs text-gray-500">안전한 비밀번호를 자동으로 생성합니다</p>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    disabled={isGenerating}
                    className="btn-primary disabled:bg-gray-400"
                  >
                    <Lock className="w-4 h-4" />
                    {isGenerating ? "생성 중..." : "비밀번호 생성"}
                  </button>
                </div>

                {generatedPassword && (
                  <Card className="bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">생성된 비밀번호</h4>
                        <p className="text-sm text-green-700">이 비밀번호를 안전하게 전달해주세요</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(generatedPassword)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        복사
                      </button>
                    </div>
                    <div className="mt-2 p-3 bg-white border border-green-300 rounded font-mono text-sm">
                      {generatedPassword}
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="input"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="input"
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* 역할 선택 */}
            <Section title="역할 및 권한">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">관리자 역할</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <label key={role.value} className="relative">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                          className="sr-only peer"
                        />
                        <div className="p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-gray-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">{role.label}</h4>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">세부 권한</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "userManagement", label: "사용자 관리", description: "수강생 및 강의자 계정 관리" },
                      { key: "contentManagement", label: "콘텐츠 관리", description: "강의 및 자료 관리" },
                      { key: "systemSettings", label: "시스템 설정", description: "시스템 설정 변경" },
                      { key: "instructorApproval", label: "강의자 승인", description: "강의자 신청 승인/거부" }
                    ].map((permission) => (
                      <label key={permission.key} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.permissions[permission.key as keyof typeof formData.permissions]}
                          onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                          className="mt-1"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{permission.label}</h4>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/master-dashboard")}
                className="btn-outline"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <UserPlus className="w-4 h-4" />
                서브 관리자 생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
