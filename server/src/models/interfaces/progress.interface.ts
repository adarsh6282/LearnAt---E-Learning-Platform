import { Types } from "mongoose";

export interface IProgress {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  watchedLectures: string[];
  isCompleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}