import { Route } from "react-router-dom";
import UserRegister from "../pages/User/UserRegister";
import UserLogin from "../pages/User/UserLogin";
import LandingPage from "../pages/User/UserHomePage";
import OtpPage from "../components/OtpPage";
import ForgotPassword from "../components/ForgotPassword";
import ForgotOtpPage from "../components/ForgotOtpPage";
import ResetPassword from "../components/ResetPassword";
import GoogleVerify from "../pages/User/GoogleVerify";
import UserProfile from "../pages/User/UserProfile";
import CourseDetail from "../pages/User/CourseDetail";
import Courses from "../pages/User/Courses";
import { UserProvider } from "../context/UserContext";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../pages/User/ProtectedRoute";
import { USER_ROUTES } from "../constants/routes.constants";
import CourseView from "../pages/User/CourseView";
import PurchaseHistory from "../pages/User/CoursePurchaseHistory";
import ChatWindow from "../components/ChatWindow";
import ChatPage from "../components/ChatPage";
import VideoCall from "../components/VideoCall";
import { CallProvider } from "../context/CallContext";
import CallModal from "../components/CallModal";
import UserNotification from "../pages/User/UserNotification";
import { NotificationProvider } from "../context/NotificationContext";
import PurchasedCourses from "../pages/User/PurchasedCourses";
import ChangePassword from "../pages/User/ChangePassword";
import UserCertificates from "../pages/User/Certificates";
import PublicLandingPage from "../pages/User/UserLandingPage";
import UserQuizPage from "../pages/User/UserQuiz";
import StudentLivePage from "../pages/User/UserLiveSession";

const UserRoutes = () => {
  return (
    <>
      <Route path={USER_ROUTES.ROOT} element={<PublicLandingPage />} />
      <Route element={<UserProviderWrapper />}>
        <Route path={USER_ROUTES.HOME} element={<LandingPage />} />
        <Route path={USER_ROUTES.REGISTER} element={<UserRegister />} />
        <Route path={USER_ROUTES.COURSE_VIEW()} element={<CourseView />} />
        <Route
          path={USER_ROUTES.NOTIFICATIONS}
          element={<UserNotification />}
        />
        <Route
          path={USER_ROUTES.PURCHASE_HISTORY}
          element={<PurchaseHistory />}
        />
        <Route path={USER_ROUTES.LOGIN} element={<UserLogin />} />
        <Route
          path={USER_ROUTES.VERIFY_OTP}
          element={<OtpPage role="users" />}
        />
        <Route
          path={USER_ROUTES.FORGOT_OTP}
          element={<ForgotOtpPage role="users" />}
        />
        <Route path={USER_ROUTES.CHAT_PAGE} element={<ChatPage />}>
          <Route path=":chatId" element={<ChatWindow />} />
        </Route>
        <Route path={USER_ROUTES.VIDEO_CALL()} element={<VideoCall />} />
        <Route
          path={USER_ROUTES.PURCHASED_COURSES}
          element={<PurchasedCourses />}
        />
        <Route
          path={USER_ROUTES.CHANGE_PASSWORD}
          element={<ChangePassword />}
        />
        <Route path={USER_ROUTES.CERTIFICATES} element={<UserCertificates />} />
        <Route
          path={USER_ROUTES.FORGOT_PASSWORD}
          element={<ForgotPassword role="users" />}
        />
        <Route path={USER_ROUTES.GOOGLE_VERIFY} element={<GoogleVerify />} />
        <Route
          path={USER_ROUTES.RESET_PASSWORD}
          element={<ResetPassword role="users" />}
        />
        <Route
          path={USER_ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path={USER_ROUTES.COURSES}
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path={USER_ROUTES.COURSE_DETAIL()}
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/quiz/:courseId"
          element={
            <ProtectedRoute>
              <UserQuizPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/users/live/:sessionId"
        element={
          <ProtectedRoute>
            <StudentLivePage />
          </ProtectedRoute>
        }
      />
    </>
  );
};

const UserProviderWrapper = () => {
  return (
    <UserProvider>
      <NotificationProvider>
        <CallProvider>
          <Outlet />
          <CallModal />
        </CallProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default UserRoutes;
