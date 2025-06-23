import { Navigate, Outlet } from "react-router-dom"

const AdminPrivateRoute = () => {
  const isAdminLoggedIn = localStorage.getItem("adminToken") !== null

  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/login" />
}

export default AdminPrivateRoute