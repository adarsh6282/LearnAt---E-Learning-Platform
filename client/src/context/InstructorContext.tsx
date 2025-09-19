import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { IInstructorProfile } from "../types/instructor.types";
import { getProfileS } from "../services/instructor.services";

interface InstructorContextType {
  instructor: IInstructorProfile | null;
  setInstructor: React.Dispatch<
    React.SetStateAction<IInstructorProfile | null>
  >;
  getInstructorProfile: () => Promise<void>;
  loading:boolean
}

 const InstructorContext = createContext<
  InstructorContextType | undefined
>(undefined);

export const InstructorProvider = ({ children }: { children: ReactNode }) => {
  const [instructor, setInstructor] = useState<IInstructorProfile | null>(null);
  const [loading,setLoading]=useState(true)

  const getInstructorProfile = useCallback( async () => {
    try {
      const res = await getProfileS();
      setInstructor(res.data);
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(() => {
    getInstructorProfile();
  }, [getInstructorProfile]);

  return (
    <InstructorContext.Provider
      value={{ instructor, setInstructor, getInstructorProfile,loading }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorContext