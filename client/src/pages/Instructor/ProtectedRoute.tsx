import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import InstructorContext from "../../context/InstructorContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("instructorsToken");
  const location = useLocation();
  const context = useContext(InstructorContext);

  const instructor = context?.instructor
  const loading = context?.loading

  if (!context) {
    return "No context here";
  }

  const isRejected = instructor?.accountStatus === "rejected";
  const isPending = instructor?.accountStatus === "pending";

  if (!token) return <Navigate to="/instructors/login" replace />;

  if (loading) return <div>Loading...</div>;

  if (!instructor) return <Navigate to="/instructors/login" replace />;

  if (
    (isRejected || isPending) &&
    location.pathname !== "/instructors/dashboard"
  ) {
    return <Navigate to={"/instructors/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
