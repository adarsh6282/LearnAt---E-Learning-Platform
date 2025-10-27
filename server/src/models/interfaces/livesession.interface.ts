import { Document, Types } from "mongoose";

export interface ILiveSession extends Document {
  courseId: string|Types.ObjectId;
  instructorId: string|Types.ObjectId;
  roomId: string;
  startTime: Date;
  isLive:boolean;
  endTime?:Date
}