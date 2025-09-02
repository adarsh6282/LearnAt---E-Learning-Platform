import { Types } from "mongoose";

export interface CourseDTO {
    _id:string
    title: string;
    description: string;
    category: string;
    price: number;
    isActive: boolean;
    lectures: ILecture[];
    instructor?: Types.ObjectId;
    thumbnail:string,
}

interface ILecture {
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
} 