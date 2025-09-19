import { Types } from "mongoose";

export interface MessageDTO{
      _id?: Types.ObjectId|string;
      chat: Types.ObjectId;
      senderId: Types.ObjectId;
      image?:string;
      senderRole: "user" | "instructor";
      isDeleted:boolean
      content: string;
      createdAt?: Date;
}