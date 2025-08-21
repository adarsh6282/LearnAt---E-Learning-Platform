import { UpdateResult } from "mongoose";
import { IMessage } from "../../models/interfaces/chat.interface";

export interface IMessageService{
    sendMessage(data:any):Promise<IMessage|null>
    fetchMessages(chatId:string):Promise<IMessage[]|null>
    markRead(
    chatId: string,
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<UpdateResult>;

  getUnreadCounts(
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<{ chat: string; count: number }[]>   
}