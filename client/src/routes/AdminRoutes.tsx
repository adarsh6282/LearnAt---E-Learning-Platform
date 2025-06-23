// AdminRoutes.jsx
import { Route } from "react-router-dom"
import AdminLogin from "../pages/Admin/AdminLogin"
import AdminNavbar from "../components/AdminNavbar"
import AdminDashboard from "../pages/Admin/AdminDashboard"
import AdminUsers from "../pages/Admin/AdminUsers"
import AdminTutors from "../pages/Admin/AdminTutors"
import AdminTutorRequests from "../pages/Admin/AdminTutorRequests"
import AdminPrivateRoute from "./AdminPrivateRoutes"
import AdminCategory from "../pages/Admin/AdminCategory"
import AdminCourse from "../pages/Admin/AdminCourse"
import AdminReviews from "../pages/Admin/AdminReviews"
import Earnings from "../components/Earnings"

const AdminRoutes = [
  <Route key="admin-login" path="/admin/login" element={<AdminLogin />} />,
  <Route key="admin-private" path="/admin" element={<AdminPrivateRoute />}>
    <Route element={<AdminNavbar />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="tutors" element={<AdminTutors />} />
      <Route path="tutor-requests" element={<AdminTutorRequests />} />
      <Route path="category" element={<AdminCategory/>}/>
      <Route path="courses" element={<AdminCourse/>}/>
      <Route path="reviews" element={<AdminReviews/>}/>
      <Route path="earnings" element={<Earnings role="admin"/>}/>
    </Route>
  </Route>
]

export default AdminRoutes
