import { Types } from "mongoose";

export interface IChat {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  instructor: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  lastMessage:Date;
}

export interface IMessage {
  _id?: Types.ObjectId;
  chat: Types.ObjectId;
  senderId: Types.ObjectId;
  image?:string;
  senderRole: "user" | "instructor";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
