import { useContext } from "react";
import UserContext from "../context/UserContext";
import InstructorContext from "../context/InstructorContext";

export const useAuth = () => {
  const userCtx = useContext(UserContext);
  const instructorCtx = useContext(InstructorContext);

  if (userCtx?.user) {
    return {
      authUser: userCtx.user,
      role: userCtx.user.role === "user" ? "User" : null,
      getProfile: userCtx.getUserProfile,
      loading:userCtx.loading
    };
  }

  if (instructorCtx?.instructor) {
    return {
      authUser: instructorCtx.instructor,
      role:
        instructorCtx.instructor.role === "instructor" ? "Instructor" : null,
      getProfile: instructorCtx.getInstructorProfile,
      loading:instructorCtx.loading
    };
  }

  return {
    authUser: null,
    role: null,
    getProfile: async () => {},
    loading: userCtx?.loading || instructorCtx?.loading || true,
  };
};
