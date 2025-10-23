import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./layout/MainLayout";

// Contexts
import { CourseCreationProvider } from "./contexts/CourseCreationContext";

// Auth pages
import Login from "./pages/auth/Login";
import SignupSelect from "./pages/auth/SignupSelect";
import SignupStudent from "./pages/auth/SignupStudent";
import SignupInstructor from "./pages/auth/SignupInstructor";
import SignupPending from "./pages/auth/SignupPending";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import CourseDetail from "./pages/student/CourseDetail";
import Learning from "./pages/student/Learning";
import Notice from "./pages/student/Notice";
import Profile from "./pages/student/Profile";
import AssignmentSubmit from "./pages/student/AssignmentSubmit";
import QuizPlayer from "./pages/student/QuizPlayer";
import CourseResources from "./pages/student/CourseResources";
import CourseQnA from "./pages/student/CourseQnA";
import Help from "./pages/student/Help";

// Instructor pages
import InstructorDashboard from "./pages/instructor/Dashboard";
import CourseList from "./pages/instructor/CourseList";
import CreateCourse from "./pages/instructor/CreateCourse";
import CourseIntroduction from "./pages/instructor/CourseIntroduction";
import CourseHome from "./pages/instructor/CourseHome";
import EditCurriculum from "./pages/instructor/EditCurriculum";
import StudentManagement from "./pages/instructor/StudentManagement";
import AchievementAnalysis from "./pages/instructor/AchievementAnalysis";
import CoInstructorSettings from "./pages/instructor/CoInstructorSettings";
import ExamManagement from "./pages/instructor/ExamManagement";
import CreateExam from "./pages/instructor/CreateExam";
import NoticeManagement from "./pages/instructor/NoticeManagement";
import InstructorProfile from "./pages/instructor/Profile";
import InstructorProfilePage from "./pages/instructor/InstructorProfile";
import CoursePreview from "./pages/instructor/CoursePreview";
import RealtimeProctoring from "./pages/instructor/RealtimeProctoring.tsx";
import ResultsAnalysis from "./pages/instructor/ResultsAnalysis.tsx";
import GradeReport from "./pages/instructor/GradeReport.tsx";
import ReviewManagement from "./pages/instructor/ReviewManagement.tsx";
import CourseSettings from "./pages/instructor/CourseSettings.tsx";
import ActivityHistory from "./pages/instructor/ActivityHistory.tsx";
import InviteStudents from "./pages/instructor/InviteStudents";
import InviteByEmail from "./pages/instructor/InviteByEmail";
import InviteByCode from "./pages/instructor/InviteByCode";

// Admin pages
import MasterDashboard from "./pages/admin/MasterDashboard";
import SubDashboard from "./pages/admin/SubDashboard";
import CreateSubAdmin from "./pages/admin/CreateSubAdmin";
import InstructorApproval from "./pages/admin/InstructorApproval";

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

      {/* Main app with layout */}
      <Route element={
        <CourseCreationProvider>
          <MainLayout />
        </CourseCreationProvider>
      }>
        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/student/learning/:id" element={<Learning />} />
        <Route path="/student/notice" element={<Notice />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/assignment/:id" element={<AssignmentSubmit />} />
        <Route path="/student/quiz/:id" element={<QuizPlayer />} />
        <Route path="/student/course/:id/resources" element={<CourseResources />} />
        <Route path="/student/course/:id/qna" element={<CourseQnA />} />
        <Route path="/student/help" element={<Help />} />

             {/* Instructor */}
             <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
             <Route path="/instructor/courses" element={<CourseList />} />
             <Route path="/instructor/create" element={<CreateCourse />} />
             <Route path="/instructor/create/introduction" element={<CourseIntroduction />} />
             <Route path="/instructor/course/:id/home" element={<CourseHome />} />
             <Route path="/instructor/course/:id/edit" element={<EditCurriculum />} />
             <Route path="/instructor/course/:id/students" element={<StudentManagement />} />
             <Route path="/instructor/course/:id/invite-students" element={<InviteStudents />} />
             <Route path="/instructor/course/:id/invite-email" element={<InviteByEmail />} />
             <Route path="/instructor/course/:id/invite-code" element={<InviteByCode />} />
             <Route path="/instructor/course/:id/achievement" element={<AchievementAnalysis />} />
             <Route path="/instructor/course/:id/co-instructors" element={<CoInstructorSettings />} />
             <Route path="/instructor/course/:id/exams" element={<ExamManagement />} />
             <Route path="/instructor/course/:id/create-exam" element={<CreateExam />} />
             <Route path="/instructor/course/:id/notices" element={<NoticeManagement />} />
             <Route path="/instructor/course/:id/proctoring" element={<RealtimeProctoring />} />
             <Route path="/instructor/course/:id/results" element={<ResultsAnalysis />} />
             <Route path="/instructor/course/:id/grade-report" element={<GradeReport />} />
             <Route path="/instructor/course/:id/reviews" element={<ReviewManagement />} />
             <Route path="/instructor/course/:id/settings" element={<CourseSettings />} />
             <Route path="/instructor/course/:id/activity" element={<ActivityHistory />} />
             <Route path="/instructor/profile" element={<InstructorProfile />} />
             <Route path="/instructor/profile-page" element={<InstructorProfilePage />} />
             <Route path="/instructor/create/preview" element={<CoursePreview />} />

        {/* Admin with layout */}
        <Route path="/admin/master-dashboard" element={<MasterDashboard />} />
        <Route path="/admin/sub-dashboard" element={<SubDashboard />} />
        <Route path="/admin/create-sub-admin" element={<CreateSubAdmin />} />
        <Route path="/admin/instructor-approval" element={<InstructorApproval />} />

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}