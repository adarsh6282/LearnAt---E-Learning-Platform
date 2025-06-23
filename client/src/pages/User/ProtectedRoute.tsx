import React from "react";
import { Navigate } from "react-router-dom";
import { USER_ROUTES } from "../../constants/routes.constants";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("usersToken")

  if (!token) {
    return <Navigate to={USER_ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;