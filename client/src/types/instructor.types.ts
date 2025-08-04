export interface VerifyInstructor {
  token: string;
  instructor: {
    email:string
  }
  message:string
}


export interface Tutor{
  _id:string,
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
  _id?:string;
  name: string;
  username: string;
  email: string;
  phone: string;
  title: string;
  yearsOfExperience: number;
  education: string;
  accountStatus: "pending" | "blocked" | "active" | "rejected";
  isVerified: boolean;
  role:string;
  isRejected?:boolean;
  profilePicture?: string;
}