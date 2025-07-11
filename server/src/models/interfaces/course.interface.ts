import { Document, Types } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    isActive: boolean;
    lectures: ILecture[];
    instructor?: Types.ObjectId;
    thumbnail:string
}

export interface ILecture {
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    order: number;
} 