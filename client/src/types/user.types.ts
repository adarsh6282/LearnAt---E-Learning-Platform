export interface VerifyOtpResponse {
  token: string;
  user: {
    email: string;
  };
  message: string;
}

export interface User {
  _id:string;
  name: string;
  username: string;
  email: string;
  password: string;
  googleId: string;
  phone: string;
  isBlocked: boolean;
  role: "admin" | "user" | "instructor";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  _id?: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  googleId:string
  role:string;
  profilePicture?: string;
}

export type Course = {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
  duration?: string;
  level?: string;
  rating?: number;
  studentsCount?: number;
  isActive?: boolean;
  instructor?: string;
  description?: string;
};

export type CourseViewType = {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
  rating?: number;
  studentsCount?: number;
  instructor?: {
    _id:string;
    name: string;
  };
  description?: string;
  modules?: Module[];
};

export type Chapter = {
  _id: string;
  title: string;
  description: string;
  lessons: Lecture[];
};

export type Lecture = {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order?: number;
  type:"video"|"pdf"
};

export type Module={
  _id:string,
  title:string,
  description:string,
  chapters:Chapter[]
}

export type SortOption =
  | "title"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export interface UserRegisterData {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface InstructorRegisterData extends UserRegisterData {
  title: string;
  education: string;
  yearsOfExperience: string;
  resume: string;
}
