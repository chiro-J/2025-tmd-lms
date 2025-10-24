import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Shield, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Users
} from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface SubAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  permissions: {
    userManagement: boolean;
    contentManagement: boolean;
    systemSettings: boolean;
    instructorApproval: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

export default function SubAdminManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
  
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

  // 목업 데이터
  const subAdmins: SubAdmin[] = [
    {
      id: 1,
      name: "김콘텐츠",
      email: "content@example.com",
      role: "Content Manager",
      status: "active",
      permissions: {
        userManagement: false,
        contentManagement: true,
        systemSettings: false,
        instructorApproval: false
      },
      createdAt: "2025-01-10",
      lastLogin: "2025-01-15 14:30"
    },
    {
      id: 2,
      name: "이사용자",
      email: "user@example.com",
      role: "User Manager",
      status: "active",
      permissions: {
        userManagement: true,
        contentManagement: false,
        systemSettings: false,
        instructorApproval: true
      },
      createdAt: "2025-01-08",
      lastLogin: "2025-01-15 09:15"
    },
    {
      id: 3,
      name: "박시스템",
      email: "system@example.com",
      role: "System Manager",
      status: "inactive",
      permissions: {
        userManagement: true,
        contentManagement: true,
        systemSettings: true,
        instructorApproval: true
      },
      createdAt: "2025-01-05",
      lastLogin: "2025-01-12 16:45"
    },
    {
      id: 4,
      name: "최지원",
      email: "support@example.com",
      role: "Support Manager",
      status: "pending",
      permissions: {
        userManagement: false,
        contentManagement: false,
        systemSettings: false,
        instructorApproval: false
      },
      createdAt: "2025-01-14",
      lastLogin: "없음"
    }
  ];

  const roles = [
    { value: "Content Manager", label: "콘텐츠 관리자", description: "강의 및 자료 관리" },
    { value: "User Manager", label: "사용자 관리자", description: "수강생 및 강의자 관리" },
    { value: "System Manager", label: "시스템 관리자", description: "시스템 설정 및 모니터링" },
    { value: "Support Manager", label: "지원 관리자", description: "고객 지원 및 문의 관리" }
  ];

  const filteredAdmins = subAdmins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
    setTimeout(() => {
      const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-4).toUpperCase();
      setGeneratedPassword(password);
      setFormData(prev => ({ ...prev, password, confirmPassword: password }));
      setIsGenerating(false);
    }, 1000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("서브 관리자 생성:", formData);
    // 실제 구현에서는 API 호출
    setActiveTab("list");
    setFormData({
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
    setGeneratedPassword("");
  };

  const handleDeleteAdmin = (admin: SubAdmin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("서브 관리자 삭제:", selectedAdmin?.id);
    // 실제 구현에서는 API 호출
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "활성";
      case "inactive": return "비활성";
      case "pending": return "대기";
      default: return "알 수 없음";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 헤더 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/master-dashboard")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">서브 관리자 관리</h1>
              <p className="text-gray-600">서브 관리자 계정 조회, 생성, 삭제</p>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("list")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                서브 관리자 목록
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                서브 관리자 생성
              </button>
            </nav>
          </div>

          {/* 서브 관리자 목록 탭 */}
          {activeTab === "list" && (
            <div className="space-y-6">
              {/* 검색 및 필터 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-5xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="이름 또는 이메일로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 input w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="input"
                  >
                    <option value="all">모든 역할</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    새 관리자
                  </Button>
                </div>
              </div>

              {/* 서브 관리자 목록 */}
              <div className="grid gap-4">
                {filteredAdmins.map((admin) => (
                  <Card key={admin.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(admin.status)}`}>
                              {getStatusText(admin.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">역할: {roles.find(r => r.value === admin.role)?.label}</span>
                            <span className="text-sm text-gray-500">생성일: {admin.createdAt}</span>
                            <span className="text-sm text-gray-500">마지막 로그인: {admin.lastLogin}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            {Object.entries(admin.permissions).map(([key, value]) => (
                              value && (
                                <span key={key} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {key === "userManagement" && "사용자 관리"}
                                  {key === "contentManagement" && "콘텐츠 관리"}
                                  {key === "systemSettings" && "시스템 설정"}
                                  {key === "instructorApproval" && "강의자 승인"}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAdmin(admin)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredAdmins.length === 0 && (
                <Card className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-600">다른 검색어를 시도해보세요</p>
                </Card>
              )}
            </div>
          )}

          {/* 서브 관리자 생성 탭 */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateSubmit} className="space-y-6">
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
                  onClick={() => setActiveTab("list")}
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
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">서브 관리자 삭제</h3>
                  <p className="text-sm text-gray-600">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>{selectedAdmin.name}</strong> ({selectedAdmin.email}) 서브 관리자를 삭제하시겠습니까?
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  이 계정과 관련된 모든 데이터가 삭제됩니다.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
