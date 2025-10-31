import { Outlet, Route } from "react-router-dom";
import InstructorRegister from "../pages/Instructor/InstructorRegister";
import InstructorLogin from "../pages/Instructor/InstructorLogin";
import OtpPage from "../components/OtpPage";
import ForgotOtpPage from "../components/ForgotOtpPage";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import InstructorNavbar from "../components/InstructorNavbar";
import InstructorDashboard from "../pages/Instructor/InstructorDashboard";
import InstructorCreateCourse from "../pages/Instructor/InstructorCreateCourse";
import InstructorProfile from "../pages/Instructor/InstructorProfile";
import { InstructorProvider } from "../context/InstructorContext";
import Courses from "../pages/Instructor/Courses";
import ProtectedRoute from "../pages/Instructor/ProtectedRoute";
import { INSTRUCTOR_ROUTES } from "../constants/routes.constants";
import EditCourse from "../pages/Instructor/EditCourse";
import InstructorReview from "../pages/Instructor/InstructorReview";
import Enrollments from "../pages/Instructor/Enrollments";
import Earnings from "../components/Earnings";
import InstructorChatPage from "../pages/Instructor/InstructorChatPage";
import InstructorChatWindow from "../pages/Instructor/InstructorChatWindow";
import InstructorVideoCall from "../pages/Instructor/InstructorVideoCall";
import { CallProvider } from "../context/CallContext";
import CallModal from "../components/CallModal";
import { NotificationProvider } from "../context/NotificationContext";
import InstructorNotification from "../pages/Instructor/InstructorNotification";
import InstructorQuizzes from "../pages/Instructor/InstructorQuizzes";
import QuizManagement from "../pages/Instructor/QuizManagement";
import InstructorLivePage from "../pages/Instructor/InstructorLiveSession";
import QuizCreation from "../pages/Instructor/createQuiz";

const InstructorRoutes = () => {
  return (
    <>
      <Route
        path={INSTRUCTOR_ROUTES.REGISTER}
        element={<InstructorRegister />}
      />
      <Route path={INSTRUCTOR_ROUTES.LOGIN} element={<InstructorLogin />} />
      <Route
        path={INSTRUCTOR_ROUTES.VERIFY_OTP}
        element={<OtpPage role="instructors" />}
      />
      <Route
        path={INSTRUCTOR_ROUTES.FORGOT_OTP}
        element={<ForgotOtpPage role="instructors" />}
      />
      <Route
        path={INSTRUCTOR_ROUTES.FORGOT_PASSWORD}
        element={<ForgotPassword role="instructors" />}
      />
      <Route
        path={INSTRUCTOR_ROUTES.RESET_PASSWORD}
        element={<ResetPassword role="instructors" />}
      />

      <Route
        path={INSTRUCTOR_ROUTES.CHAT_PAGE}
        element={
          <InstructorProvider>
            <CallProvider>
              <InstructorChatPage />
              <CallModal />
            </CallProvider>
          </InstructorProvider>
        }
      >
        <Route path=":chatId" element={<InstructorChatWindow />} />
      </Route>
      <Route
        path={INSTRUCTOR_ROUTES.VIDEO_CALL}
        element={
          <InstructorProvider>
            <CallProvider>
              <Outlet />
              <CallModal />
            </CallProvider>
          </InstructorProvider>
        }
      >
        <Route path=":chatId" element={<InstructorVideoCall />} />
      </Route>

      <Route
        path={INSTRUCTOR_ROUTES.BASE}
        element={
          <InstructorProvider>
            <NotificationProvider>
              <CallProvider>
                <ProtectedRoute>
                  <InstructorNavbar />
                  <CallModal />
                </ProtectedRoute>
              </CallProvider>
            </NotificationProvider>
          </InstructorProvider>
        }
      >
        <Route
          path={INSTRUCTOR_ROUTES.DASHBOARD}
          element={<InstructorDashboard />}
        />
        <Route
          path={INSTRUCTOR_ROUTES.CREATE_COURSE}
          element={<InstructorCreateCourse />}
        />
        <Route
          path={INSTRUCTOR_ROUTES.EDIT_COURSE()}
          element={<EditCourse />}
        />
        <Route
          path={INSTRUCTOR_ROUTES.PROFILE}
          element={<InstructorProfile />}
        />
        <Route
          path={INSTRUCTOR_ROUTES.REVIEWS}
          element={<InstructorReview />}
        />
        <Route path={INSTRUCTOR_ROUTES.COURSES} element={<Courses />} />
        <Route
          path={INSTRUCTOR_ROUTES.CREATEQUIZ()}
          element={<QuizCreation />}
        />
        <Route path={INSTRUCTOR_ROUTES.MANAGE_QUIZ()} element={<QuizManagement />} />
        <Route path={INSTRUCTOR_ROUTES.QUIZ} element={<InstructorQuizzes />} />
        <Route
          path="/instructors/live/:sessionId"
          element={
            <ProtectedRoute>
              <InstructorLivePage />
            </ProtectedRoute>
          }
        />

        <Route
          path={INSTRUCTOR_ROUTES.EARNINGS}
          element={<Earnings role="instructors" />}
        />
        <Route path={INSTRUCTOR_ROUTES.ENROLLMENTS} element={<Enrollments />} />
        <Route
          path={INSTRUCTOR_ROUTES.NOTIFICATIONS}
          element={<InstructorNotification />}
        />
      </Route>
    </>
  );
};

export default InstructorRoutes;
