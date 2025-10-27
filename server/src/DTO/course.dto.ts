import { Types } from "mongoose";

export interface CourseDTO {
    _id:string
    title: string;
    description: string;
    category: string;
    price: number;
    isActive: boolean;
    modules: Module[];
    instructor?: Types.ObjectId;
    thumbnail:string,
}

interface ILecture {
    _id?:string
    title: string;
    description: string;
    url: string;
    duration: string;
    type:string
} 

interface Chapter{
    _id?:string
    title:string;
    description:string;
    lessons:ILecture[]
}

interface Module{
    _id?:string
    title:string,
    description:string,
    chapters:Chapter[]
}