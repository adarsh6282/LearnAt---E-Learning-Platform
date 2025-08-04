import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IUserProfile } from "../types/user.types";
import { getUserProfileS } from "../services/user.services";

interface UserContextType {
  user: IUserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<IUserProfile | null>>;
  getUserProfile: () => Promise<void>;
  loading:boolean
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading,setLoading]=useState(true)

  const getUserProfile = async () => {
    try {
      const res = await getUserProfileS();
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, getUserProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};
