import { Types } from "mongoose";

export interface ChatDTO {
  _id?: string;
  user: Types.ObjectId;
  instructor: Types.ObjectId;
  createdAt?: Date;
  lastMessage:Date;
  lastMessageContent:string;
}