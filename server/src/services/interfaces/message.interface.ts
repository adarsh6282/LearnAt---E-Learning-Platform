import { UpdateResult } from "mongoose";
import { IMessage } from "../../models/interfaces/chat.interface";
import { MessageDTO } from "../../DTO/message.dto";

export interface IMessageService{
    sendMessage(data:Partial<IMessage>):Promise<MessageDTO>
    fetchMessages(chatId:string):Promise<MessageDTO[]>
    markRead(
    chatId: string,
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<UpdateResult>;

  deleteMessage(messageId:string,userId:string):Promise<MessageDTO>

  getUnreadCounts(
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<{ chat: string; count: number }[]>   
}