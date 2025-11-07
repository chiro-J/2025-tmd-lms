import { useState } from "react";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Users,
  CheckCircle
} from "lucide-react";
import Card from "../ui/Card";

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

interface SubAdminManagementProps {
  subAdmins: SubAdmin[];
  onCreateSubAdmin?: (data: any) => void;
  onEditSubAdmin?: (id: number, data: any) => void;
  onDeleteSubAdmin?: (id: number) => void;
  onActivateSubAdmin?: (id: number) => void;
  showActions?: boolean;
}

export default function SubAdminManagement({
  subAdmins,
  onCreateSubAdmin,
  onEditSubAdmin,
  onDeleteSubAdmin,
  onActivateSubAdmin,
  showActions = true
}: SubAdminManagementProps) {
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

  const generatePassword = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const password = Math.random().toString(36).slice(-12) +
                     Math.random().toString(36).slice(-4).toUpperCase();
      setFormData(prev => ({ ...prev, password, confirmPassword: password }));
      setIsGenerating(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (onCreateSubAdmin) {
      onCreateSubAdmin(formData);
    }

    // 폼 리셋
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
    setActiveTab("list");
  };

  const handleDelete = (admin: SubAdmin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAdmin && onDeleteSubAdmin) {
      onDeleteSubAdmin(selectedAdmin.id);
    }
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'pending':
        return '대기';
      default:
        return '알 수 없음';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="text-sm text-gray-600 break-words">
            총 {subAdmins.length}명의 서브 관리자
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            서브 관리자 목록
          </button>
          {showActions && (
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "create"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              서브 관리자 생성
            </button>
          )}
        </div>

        {/* 목록 탭 */}
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 역할</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* 서브 관리자 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdmins.map((admin) => (
                <Card key={admin.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 break-words">{admin.name}</h3>
                        <p className="text-sm text-gray-600 break-words">{admin.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(admin.status)}`}>
                      {getStatusText(admin.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="break-words">역할: {roles.find(r => r.value === admin.role)?.label || admin.role}</div>
                    <div className="break-words">생성일: {admin.createdAt}</div>
                    <div className="break-words">마지막 로그인: {admin.lastLogin}</div>
                    <div className="break-words">권한:</div>
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.userManagement && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded break-words">사용자 관리</span>
                      )}
                      {admin.permissions.contentManagement && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded break-words">콘텐츠 관리</span>
                      )}
                      {admin.permissions.systemSettings && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded break-words">시스템 설정</span>
                      )}
                      {admin.permissions.instructorApproval && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded break-words">강사 승인</span>
                      )}
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex gap-2">
                      {admin.status === 'pending' && onActivateSubAdmin && (
                        <button
                          onClick={() => onActivateSubAdmin(admin.id)}
                          className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          활성화
                        </button>
                      )}
                      <button
                        onClick={() => onEditSubAdmin?.(admin.id, admin)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        편집
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 생성 탭 */}
        {activeTab === "create" && showActions && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">새 서브 관리자 생성</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">이름</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">이메일</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이메일을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">역할</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">비밀번호</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="비밀번호를 입력하세요"
                      />
                      <button
                        onClick={generatePassword}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? "생성중..." : "자동 생성"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">비밀번호 확인</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 break-words">권한 설정</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.userManagement}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, userManagement: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 break-words">사용자 관리</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.contentManagement}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, contentManagement: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 break-words">콘텐츠 관리</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.systemSettings}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, systemSettings: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 break-words">시스템 설정</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.instructorApproval}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, instructorApproval: e.target.checked }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 break-words">강사 승인</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setActiveTab("list")}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  서브 관리자 생성
                </button>
              </div>
            </Card>
          </div>
        )}
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
                  <h3 className="text-lg font-semibold text-gray-900 break-words">서브 관리자 삭제</h3>
                  <p className="text-sm text-gray-600 break-words">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 break-words">
                  <strong>{selectedAdmin.name}</strong> ({selectedAdmin.email}) 서브 관리자를 삭제하시겠습니까?
                </p>
                <p className="text-xs text-gray-500 mt-2 break-words">
                  이 관리자와 관련된 모든 데이터가 삭제됩니다.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
