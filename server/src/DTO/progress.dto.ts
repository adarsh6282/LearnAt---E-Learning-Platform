import { Types } from "mongoose";

export interface ProgressDTO {
  _id: string;
  userId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  watchedLectures: string[];
  isCompleted: boolean;
  isCertificateIssued: boolean;
}
