import { Document, Types } from "mongoose";
import { LectureFileWithMeta } from "../../services/implementation/course.services";

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  modules: IModule[];
  instructor?: Types.ObjectId;
  thumbnail: string;
  enrolledStudents: Types.ObjectId[];
}

export interface IChapter {
  _id?: string;
  title: string;
  description:string
  lectures: ILecture[];
}

export interface ILecture {
  _id?: string;
  title: string;
  description: string;
  url?: string;
  duration: string;
  order?: number;
  type: "video" | "pdf";
}

export interface IModule {
  _id?:string
  title: string;
  description: string;
  chapters: IChapter[];
}

export interface CreateLectureInput {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}
export interface UpdateCourseInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  isActive?: boolean;
  thumbnail?: Express.Multer.File;
  lectureFiles?: LectureFileWithMeta[];

  modules: {
    _id?: string;
    title: string;
    description: string;

    chapters: {
      _id?: string;
      title: string;
      description: string;

      existingLectures: {
        _id?: string;
        title: string;
        description: string;
        duration: string;
        type: "video" | "pdf";
        url?: string;
      }[];

      newLectures: {
        title: string;
        description: string;
        duration: string;
        type: "video" | "pdf";
        order?: number;
        url?: string;
      }[];
    }[];
  }[];
}
