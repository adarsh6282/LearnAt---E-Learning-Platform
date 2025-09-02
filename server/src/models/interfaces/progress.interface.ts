import { Types } from "mongoose";

export interface IProgress {
  _id:Types.ObjectId|string
  userId: Types.ObjectId|string;
  courseId: Types.ObjectId|string;
  watchedLectures: string[];
  isCompleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}