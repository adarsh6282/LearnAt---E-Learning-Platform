import { Types } from "mongoose";

export interface ILiveSession {
  _id?:string
  courseId: string|Types.ObjectId;
  instructorId: string|Types.ObjectId;
  roomId: string;
  startTime: Date;
  isLive:boolean;
  endTime?:Date
}