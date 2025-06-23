export interface VerifyInstructor {
  token: string;
  instructor: {
    email:string
  }
  message:string
}


export interface Tutor{
  name:string,
  email:string,
  username:string,
  password:string,
  phone:string,
  title:string,
  isBlocked:boolean,
  resume:string
  yearsOfExperience:number,
  role:"user"|"admin"|"instructor"
  education:string,
  accountStatus:"pending"|"blocked"|"active",
  isVerified:boolean,
}

export interface IInstructorProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  title: string;
  yearsOfExperience: number;
  education: string;
  accountStatus: "pending" | "blocked" | "active" | "rejected";
  isVerified: boolean;
  isRejected?:boolean;
  profilePicture?: string;
}