import { Types } from "mongoose";

export interface MessageDTO {
  _id?: Types.ObjectId | string;
  chatId: string;
  senderId: string;
  image?: string;
  senderRole: "user" | "instructor";
  isDeleted: boolean;
  content: string;
  createdAt?: Date;
}
