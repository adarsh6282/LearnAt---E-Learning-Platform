import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { InstructorContext } from "../../context/InstructorContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("instructorsToken");
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const context = useContext(InstructorContext);
  if (!context) {
    return "No context here";
  }

  const { instructor, getInstructorProfile } = context;

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        await getInstructorProfile();
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

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
