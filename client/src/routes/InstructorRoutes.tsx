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
        path="/instructors/chat"
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
        path="/instructors/video"
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
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="create-course" element={<InstructorCreateCourse />} />
        <Route path="courses/:courseId" element={<EditCourse />} />
        <Route path="profile" element={<InstructorProfile />} />
        <Route path="reviews" element={<InstructorReview />} />
        <Route path="courses" element={<Courses />} />
        <Route path="earnings" element={<Earnings role="instructors" />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="notifications" element={<InstructorNotification />} />
      </Route>
    </>
  );
};

export default InstructorRoutes;
