export interface VerifyOtpResponse {
  token: string;
  user: {
    email: string;
  };
  message: string;
}

export interface User {
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
  lectures?: Lecture[];
};

export type Lecture = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order?: number;
};

export type SortOption =
  | "title"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";
