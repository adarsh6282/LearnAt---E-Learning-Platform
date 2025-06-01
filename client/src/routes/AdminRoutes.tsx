import { Route } from "react-router-dom";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminNavbar from "../components/AdminNavbar";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminTutors from "../pages/Admin/AdminTutors";
import AdminTutorRequests from "../pages/Admin/AdminTutorRequests";

const AdminRoutes = () => {
  return (
    <>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminNavbar/>}>
          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="users" element={<AdminUsers/>}/>
          <Route path="tutors" element={<AdminTutors/>}/>
          <Route path="tutor-requests" element={<AdminTutorRequests/>}/>
        </Route>
    </>
  )
}

export default AdminRoutes
