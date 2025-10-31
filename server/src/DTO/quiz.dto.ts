import { Types } from "mongoose";
import { PopulatedCourse, Question } from "../models/interfaces/quiz.interface";

export interface QuizDTO{
  _id?:string
  courseId:Types.ObjectId | string | PopulatedCourse
  instructorId: Types.ObjectId | string;
  title: string;
  description?: string;
  questions: Question[];
  passPercentage: number;
  isDeleted:boolean
}