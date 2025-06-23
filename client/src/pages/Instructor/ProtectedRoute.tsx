import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { InstructorContext } from "../../context/InstructorContext";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("instructorsToken");
  const [loading,setLoading]=useState(true)
  const context=useContext(InstructorContext)
  if(!context){
    return "No context here"
  }

  const {instructor,getInstructorProfile}=context

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        await getInstructorProfile();
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  if (!token) return <Navigate to="/instructors/login" replace />;

  if (loading) return <div>Loading...</div>;

  if (!instructor) return <Navigate to="/instructors/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
