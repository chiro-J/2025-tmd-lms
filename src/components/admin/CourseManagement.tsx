import { useState } from "react";
import { BookOpen, Eye, Edit, Trash2, CheckCircle, XCircle, Plus } from "lucide-react";
import Card from "../ui/Card";
import CourseForm from "./CourseForm";
import CourseDetailModal from "./CourseDetailModal";
import CourseApprovalModal from "./CourseApprovalModal";
import CourseDeleteModal from "./CourseDeleteModal";

interface Course {
  id: number;
  title: string;
  instructor: string;
  status: 'active' | 'inactive' | 'pending';
  enrolledStudents: number;
  createdAt: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  content?: string;
}

interface CourseManagementProps {
  courses: Course[];
  onCourseCreate?: (data: Partial<Course>) => void;
  onCourseUpdate?: (id: number, data: Partial<Course>) => void;
  onCourseDelete?: (courseId: number) => void;
  onCourseApprove?: (courseId: number) => void;
  onCourseReject?: (courseId: number) => void;
  showActions?: boolean;
}

export default function CourseManagement({
  courses,
  onCourseCreate,
  onCourseUpdate,
  onCourseDelete,
  onCourseApprove,
  onCourseReject,
  showActions = true
}: CourseManagementProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit">("list");
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseDeleteModal, setShowCourseDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    content: "",
    status: "pending" as 'active' | 'inactive' | 'pending'
  });

  const handleCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleCourseDelete = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDeleteModal(true);
  };

  const handleCourseDeleteConfirm = () => {
    if (selectedCourse && onCourseDelete) {
      onCourseDelete(selectedCourse.id);
    }
    setShowCourseDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleCourseApproval = (course: Course, action: 'approve' | 'reject') => {
    setSelectedCourse(course);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleApprovalConfirm = () => {
    if (selectedCourse && approvalAction) {
      if (approvalAction === 'approve' && onCourseApprove) {
        onCourseApprove(selectedCourse.id);
      } else if (approvalAction === 'reject' && onCourseReject) {
        onCourseReject(selectedCourse.id);
      }
    }
    setShowApprovalModal(false);
    setSelectedCourse(null);
    setApprovalAction(null);
  };

  const handleSubmit = () => {
    if (activeTab === "create" && onCourseCreate) {
      onCourseCreate({
        title: formData.title,
        instructor: formData.instructor,
        description: formData.description,
        thumbnail: formData.thumbnail,
        videoUrl: formData.videoUrl,
        content: formData.content,
        status: formData.status,
      });
    } else if (activeTab === "edit" && selectedCourse && onCourseUpdate) {
      onCourseUpdate(selectedCourse.id, {
        title: formData.title,
        instructor: formData.instructor,
        description: formData.description,
        thumbnail: formData.thumbnail,
        videoUrl: formData.videoUrl,
        content: formData.content,
        status: formData.status,
      });
    }

    setFormData({
      title: "",
      instructor: "",
      description: "",
      thumbnail: "",
      videoUrl: "",
      content: "",
      status: "pending"
    });
    setActiveTab("list");
    setSelectedCourse(null);
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      videoUrl: course.videoUrl || "",
      content: course.content || "",
      status: course.status,
    });
    setActiveTab("edit");
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
        return '승인 대기';
      default:
        return '알 수 없음';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 break-words">
            총 {courses.length}개의 강좌
          </div>
          {showActions && (
            <button
              onClick={() => {
                setFormData({
                  title: "",
                  instructor: "",
                  description: "",
                  thumbnail: "",
                  videoUrl: "",
                  content: "",
                  status: "pending"
                });
                setActiveTab("create");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              강좌 추가
            </button>
          )}
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
            강좌 목록
          </button>
          {showActions && activeTab !== "list" && (
            <button
              onClick={() => setActiveTab(activeTab === "create" ? "create" : "edit")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                (activeTab === "create" || activeTab === "edit")
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeTab === "create" ? "강좌 생성" : "강좌 수정"}
            </button>
          )}
        </div>

        {/* 목록 탭 */}
        {activeTab === "list" && (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 break-words">{course.title}</h3>
                    <p className="text-sm text-gray-600 break-words">{course.instructor}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="break-words">수강생: {course.enrolledStudents}명</div>
                <div className="break-words">생성일: {course.createdAt}</div>
                <div className="break-words line-clamp-2">{course.description}</div>
              </div>

              {showActions && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCourseDetail(course)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      상세보기
                    </button>
                    <button
                      onClick={() => handleEditClick(course)}
                      className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      onClick={() => handleCourseDelete(course)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                  {course.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCourseApproval(course, 'approve')}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        승인
                      </button>
                      <button
                        onClick={() => handleCourseApproval(course, 'reject')}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        거부
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
          </>
        )}

        {/* 생성/수정 탭 */}
        {(activeTab === "create" || activeTab === "edit") && showActions && (
          <CourseForm
            mode={activeTab === "create" ? "create" : "edit"}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onCancel={() => {
              setActiveTab("list");
              setSelectedCourse(null);
            }}
          />
        )}
      </div>

      {/* 강좌 세부사항 모달 */}
      {showCourseDetail && selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          showActions={showActions}
          onClose={() => setShowCourseDetail(false)}
          onEdit={(course) => {
            setShowCourseDetail(false);
            handleEditClick(course);
          }}
          onDelete={(course) => {
            setShowCourseDetail(false);
            handleCourseDelete(course);
          }}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}

      {/* 강좌 삭제 확인 모달 */}
      {showCourseDeleteModal && selectedCourse && (
        <CourseDeleteModal
          course={selectedCourse}
          onConfirm={handleCourseDeleteConfirm}
          onCancel={() => {
            setShowCourseDeleteModal(false);
            setSelectedCourse(null);
          }}
        />
      )}

      {/* 강좌 승인/거부 확인 모달 */}
      {showApprovalModal && selectedCourse && approvalAction && (
        <CourseApprovalModal
          course={selectedCourse}
          action={approvalAction}
          onConfirm={handleApprovalConfirm}
          onCancel={() => {
            setShowApprovalModal(false);
            setSelectedCourse(null);
            setApprovalAction(null);
          }}
        />
      )}
    </>
  );
}
