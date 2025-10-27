import { Types } from "mongoose";

export interface IProgress {
  _id:Types.ObjectId|string
  userId: Types.ObjectId|string;
  courseId: Types.ObjectId|string;
  watchedLectures: string[];
  isCompleted:boolean;
  isCertificateIssued: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}