import { UpdateResult } from "mongoose";
import { IMessage } from "../../models/interfaces/chat.interface";

export interface IMessageRepository{
    saveMessage(messageData:any):Promise<IMessage|null>,
    getChatMessages(chatId:string):Promise<IMessage[]|null>
    markMessagesAsRead(chatId: string, userId: string, userModel: "User" | "Instructor"):Promise<UpdateResult>
    getUnreadCounts(userId: string, userModel: "User" | "Instructor"):Promise<{ chat: string; count: number }[]>
}