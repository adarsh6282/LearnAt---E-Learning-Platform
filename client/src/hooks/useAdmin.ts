import { useMemo } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedAdminToken {
  _id: string;
  role:string;
}

const useAdmin = () => {
  const token = localStorage.getItem("adminToken");

  const admin = useMemo(() => {
    if (!token) return { id: null, role: null };

    try {
      const decoded = jwtDecode<DecodedAdminToken>(token);
      return { id: decoded._id, role:decoded.role };
    } catch (err) {
      console.log(err)
      console.error("Invalid admin token");
      return { id: null, role: null };
    }
  }, [token]);

  return admin;
};

export default useAdmin;
