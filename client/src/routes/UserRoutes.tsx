import { Route } from "react-router-dom";
import UserRegister from "../pages/User/UserRegister";
import UserLogin from "../pages/User/UserLogin";
import LandingPage from "../pages/User/UserLandingPage";
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
import {USER_ROUTES} from "../constants/routes.constants"
import CourseView from "../pages/User/CourseView";
import PurchaseHistory from "../pages/User/PurchaseHistory";

const UserRoutes = () => {
  return (
    <>
      <Route element={<UserProviderWrapper />}>
        <Route path={USER_ROUTES.REGISTER} element={<UserRegister />} />
        <Route path="/users/course-view/:courseId" element={<CourseView/>}/>
        <Route path="/users/purchasehistory" element={<PurchaseHistory/>}/>
        <Route path={ USER_ROUTES.LOGIN} element={<UserLogin />} />
        <Route path={USER_ROUTES.ROOT} element={<LandingPage />} />
        <Route path={USER_ROUTES.VERIFY_OTP} element={<OtpPage role="users" />} />
        <Route
          path={USER_ROUTES.FORGOT_OTP}
          element={<ForgotOtpPage role="users" />}
        />
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
          path={"/users/courses/:courseId"}
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
      </Route>
    </>
  );
};

const UserProviderWrapper = () => {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};

export default UserRoutes;
