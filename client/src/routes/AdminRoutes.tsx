import { Route } from "react-router-dom";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminNavbar from "../components/AdminNavbar";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminTutors from "../pages/Admin/AdminTutors";
import AdminTutorRequests from "../pages/Admin/AdminTutorRequests";
import AdminPrivateRoute from "./AdminPrivateRoutes";
import AdminCategory from "../pages/Admin/AdminCategory";
import AdminCourse from "../pages/Admin/AdminCourse";
import AdminReviews from "../pages/Admin/AdminReviews";
import Earnings from "../components/Earnings";
import ComplaintPage from "../components/ComplaintPage";
import AdminCourseView from "../pages/Admin/AdminCourseView";
import TutorDetail from "../pages/Admin/AdminTutorVIew";
import { NotificationProvider } from "../context/NotificationContext";
import AdminNotification from "../pages/Admin/AdminNotification";
import { ADMIN_ROUTES } from "../constants/routes.constants";

const AdminRoutes = [
  <Route key="admin-login" path={ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />,
  <Route key="admin-private" path={ADMIN_ROUTES.BASE} element={<AdminPrivateRoute />}>
    <Route
      element={
        <NotificationProvider>
          <AdminNavbar />
        </NotificationProvider>
      }
    >
      <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
      <Route path={ADMIN_ROUTES.USERS} element={<AdminUsers />} />
      <Route path={ADMIN_ROUTES.TUTORS} element={<AdminTutors />} />
      <Route path={ADMIN_ROUTES.TUTOR_REQUESTS} element={<AdminTutorRequests />} />
      <Route path={ADMIN_ROUTES.TUTOR_VIEW()} element={<TutorDetail />} />
      <Route path={ADMIN_ROUTES.CATEGORY} element={<AdminCategory />} />
      <Route path={ADMIN_ROUTES.COURSES} element={<AdminCourse />} />
      <Route path={ADMIN_ROUTES.REVIEWS} element={<AdminReviews />} />
      <Route path={ADMIN_ROUTES.COMPLAINTS} element={<ComplaintPage />} />
      <Route path={ADMIN_ROUTES.EARNINGS} element={<Earnings role="admin" />} />
      <Route path={ADMIN_ROUTES.COURSE_VIEW()} element={<AdminCourseView />} />
      <Route path={ADMIN_ROUTES.NOTIFICATIONS} element={<AdminNotification/>}/>
    </Route>
  </Route>
];

export default AdminRoutes;
