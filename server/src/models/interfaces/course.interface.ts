import { Document, Types } from "mongoose";

export interface ICourse extends Document {
    _id:string
    title: string;
    description: string;
    category: string;
    price: number;
    isActive: boolean;
    lectures: ILecture[];
    instructor?: Types.ObjectId;
    thumbnail:string,
    enrolledStudents:Types.ObjectId[]
}

export interface ILecture {
    _id?:string
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    order: number;
} 

export interface CreateLectureInput {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}