import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./layout/MainLayout";

// Contexts
import { CourseCreationProvider } from "./contexts/CourseCreationContext";
import { ProfileProvider } from "./contexts/ProfileContext";

// Auth pages
import Login from "./pages/auth/Login";
import SignupSelect from "./pages/auth/SignupSelect";
import SignupStudent from "./pages/auth/SignupStudent";
import SignupInstructor from "./pages/auth/SignupInstructor";
import SignupPending from "./pages/auth/SignupPending";

// Student pages
import WelcomePage from "./pages/student/WelcomePage";
import StudentDashboard from "./pages/student/Dashboard";
import CourseDetail from "./pages/student/CourseDetail";
import EnrollCourse from "./pages/student/EnrollCourse";
import StudentQnADetail from "./pages/student/QnADetail";
import Learning from "./pages/student/Learning";
import Notice from "./pages/student/Notice";
import NoticeDetail from "./pages/student/NoticeDetail";
import Profile from "./pages/student/Profile";
import AssignmentSubmit from "./pages/student/AssignmentSubmit";
import QuizPlayer from "./pages/student/QuizPlayer";
import Help from "./pages/student/Help";
import InstructorHelp from "./pages/instructor/Help";
import Calendar from "./pages/student/Calendar";
import Notifications from "./pages/student/Notifications";
import InstructorIntroduction from "./pages/student/InstructorIntroduction";
import PdfViewer from "./pages/student/PdfViewer";

// Instructor pages
import InstructorDashboard from "./pages/instructor/Dashboard";
import CourseIntroduction from "./pages/instructor/CourseIntroduction";
import CourseHome from "./pages/instructor/CourseHome";
import EditCurriculum from "./pages/instructor/EditCurriculum";
import ManageStudents from "./pages/instructor/ManageStudents";
import ResourceManagement from "./pages/instructor/ResourceManagement";
import QnAManagement from "./pages/instructor/QnAManagement";
import AllQnAs from "./pages/instructor/AllQnAs";
import UnansweredQnAs from "./pages/instructor/UnansweredQnAs";
import InstructorQnADetail from "./pages/instructor/QnADetail";
import CourseInfoEdit from "./pages/instructor/CourseInfoEdit";
import CoInstructorSettings from "./pages/instructor/CoInstructorSettings";
import ExamManagement from "./pages/instructor/ExamManagement";
import CreateExam from "./pages/instructor/CreateExam";
import QuestionManagement from "./pages/instructor/QuestionManagement";
import NoticeManagement from "./pages/instructor/NoticeManagement";
import NoticeEditor from "./pages/instructor/NoticeEditor";
import NoticeEdit from "./pages/instructor/NoticeEdit";
import CourseNoticeDetail from "./pages/student/CourseNoticeDetail";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import Introduction from "./pages/instructor/Introduction";
import IntroductionPreview from "./pages/instructor/IntroductionPreview";
import ResultsAnalysis from "./pages/instructor/ResultsAnalysis.tsx";
import ExamDetail from "./pages/instructor/ExamDetail";
import AssignmentManagement from "./pages/instructor/AssignmentManagement";
import AssignmentSubmissions from "./pages/instructor/AssignmentSubmissions";
import InviteStudents from "./pages/instructor/InviteStudents";
import InviteByEmail from "./pages/instructor/InviteByEmail";
import InviteByCode from "./pages/instructor/InviteByCode";

// Admin pages
import MasterDashboard from "./pages/admin/MasterDashboard";
import SubDashboard from "./pages/admin/SubDashboard";
import CreateSubAdmin from "./pages/admin/CreateSubAdmin";
import SubAdminManagement from "./pages/admin/SubAdminManagement";
import InstructorApproval from "./pages/admin/InstructorApproval";
import AdminNoticeDetail from "./pages/admin/NoticeDetail";
import AdminNoticeEdit from "./pages/admin/NoticeEdit";
import AdminNoticeCreate from "./pages/admin/NoticeCreate";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Auth pages - No layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupSelect />} />
      <Route path="/signup/student" element={<SignupStudent />} />
      <Route path="/signup/instructor" element={<SignupInstructor />} />
      <Route path="/signup/pending" element={<SignupPending />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* Notice Editor - No layout */}
      <Route path="/instructor/course/:id/notices/new" element={<NoticeEditor />} />
      <Route path="/instructor/course/:id/notices/:noticeId/edit" element={<NoticeEdit />} />

      {/* PDF Viewer - No layout */}
      <Route path="/student/pdf-viewer" element={<PdfViewer />} />

      {/* Main app with layout */}
      <Route element={
        <CourseCreationProvider>
          <ProfileProvider>
            <MainLayout />
          </ProfileProvider>
        </CourseCreationProvider>
      }>
        {/* Student */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/enroll" element={<EnrollCourse />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/student/course/:id/quiz/:quizId" element={<QuizPlayer />} />
        <Route path="/student/course/:courseId/notice/:noticeId" element={<CourseNoticeDetail />} />
        <Route path="/student/course/:id/qna/:qnaId" element={<StudentQnADetail />} />
        <Route path="/student/learning/:id" element={<Learning />} />
        <Route path="/student/notice" element={<Notice />} />
        <Route path="/student/notice/:id" element={<NoticeDetail />} />
        <Route path="/student/calendar" element={<Calendar />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/assignment/:id" element={<AssignmentSubmit />} />
        <Route path="/student/instructor/:instructorId/introduction" element={<InstructorIntroduction />} />
        <Route path="/student/help" element={<Help />} />
        <Route path="/student/notifications" element={<Notifications />} />

             {/* Instructor */}
             <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
             <Route path="/instructor/create" element={<CourseIntroduction />} />
             <Route path="/instructor/course/:id/home" element={<CourseHome />} />
             <Route path="/instructor/course/:id/learning" element={<Learning />} />
             <Route path="/instructor/course/:id/edit" element={<EditCurriculum />} />
             <Route path="/instructor/course/:id/info" element={<CourseInfoEdit />} />
             <Route path="/instructor/course/:id/resources" element={<ResourceManagement />} />
             <Route path="/instructor/course/:id/students" element={<ManageStudents />} />
             <Route path="/instructor/qna/all" element={<AllQnAs />} />
             <Route path="/instructor/qna/unanswered" element={<UnansweredQnAs />} />
             <Route path="/instructor/course/:id/qna" element={<QnAManagement />} />
             <Route path="/instructor/course/:id/qna/:qnaId" element={<InstructorQnADetail />} />
             <Route path="/instructor/course/:id/invite-students" element={<InviteStudents />} />
             <Route path="/instructor/course/:id/invite-email" element={<InviteByEmail />} />
             <Route path="/instructor/course/:id/invite-code" element={<InviteByCode />} />
             <Route path="/instructor/course/:id/co-instructors" element={<CoInstructorSettings />} />
             <Route path="/instructor/course/:id/exams" element={<ExamManagement />} />
             <Route path="/instructor/course/:id/assignments" element={<AssignmentManagement />} />
             <Route path="/instructor/course/:id/assignment-submissions" element={<AssignmentSubmissions />} />
             <Route path="/instructor/course/:id/exam/:examId" element={<ExamDetail />} />
             <Route path="/instructor/course/:id/create-exam" element={<CreateExam />} />
             <Route path="/instructor/course/:id/question-management" element={<QuestionManagement />} />
             <Route path="/instructor/course/:id/notices" element={<NoticeManagement />} />
             <Route path="/instructor/course/:courseId/notice/:noticeId" element={<CourseNoticeDetail />} />
             <Route path="/instructor/course/:id/results" element={<ResultsAnalysis />} />
            {/* Removed duplicated settings (overlaps with course info edit) */}
             <Route path="/instructor/introduction/preview" element={<IntroductionPreview />} />
             <Route path="/instructor/introduction" element={<Introduction />} />
             <Route path="/instructor/profile" element={<InstructorProfile />} />
             <Route path="/instructor/help" element={<InstructorHelp />} />

        {/* Admin with layout */}
        <Route path="/admin/master-dashboard" element={<MasterDashboard />} />
        <Route path="/admin/sub-dashboard" element={<SubDashboard />} />
        <Route path="/admin/create-sub-admin" element={<CreateSubAdmin />} />
        <Route path="/admin/sub-admin-management" element={<SubAdminManagement />} />
        <Route path="/admin/instructor-approval" element={<InstructorApproval />} />
        <Route path="/admin/notice/new" element={<AdminNoticeCreate />} />
        <Route path="/admin/notice/:id" element={<AdminNoticeDetail />} />
        <Route path="/admin/notice/:id/edit" element={<AdminNoticeEdit />} />

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
