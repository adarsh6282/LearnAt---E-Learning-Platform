export interface Lecture {
  _id?:string
  id?: number;
  title: string;
  description: string;
  file?: File | null;
  url?:string
  duration: string;
  order: number;
  type:"video"|"pdf"
}

interface Module {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Chapter{
  _id?:string,
  title:string,
  description:string,
  lessons:Lecture[]
}

export interface CourseData {
  title: string;
  description: string;
  isActive: boolean;
  category: string;
  price: number;
  modules: Module[];
  thumbnail?:string
}

export interface CourseResponse {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  instructor: string;
  chapters:{
    lectures: {
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    order: number;
  }[];
  }[]
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  category: string;
  price: number;
  isActive?: boolean;
  lectures: {
    title: string;
    description: string;
    duration: string;
    order: number;
  }[];
  videos: File[];
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  isActive?: boolean;
  lectures?: {
    title: string;
    description: string;
    duration: string;
    order: number;
  }[];
}

export interface ICourse {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  category?:string;
  lectures?:Lecture[]
  thumbnail?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  instructor?: {
    _id: string;
    name: string;
    email?: string;
  };
}
