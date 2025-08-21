import { UpdateResult } from "mongoose";
import { IMessage } from "../../models/interfaces/chat.interface";
import { IMessageRepository } from "../../repository/interfaces/message.interface";
import { IMessageService } from "../interfaces/message.interface";

export class MessageService implements IMessageService {
  constructor(private _messageRepository: IMessageRepository) {}

  async sendMessage(data: any): Promise<IMessage | null> {
    return this._messageRepository.saveMessage(data);
  }

  async fetchMessages(chatId: string): Promise<IMessage[] | null> {
    return this._messageRepository.getChatMessages(chatId);
  }

  async markRead(
    chatId: string,
    userId: string,
    userModel: "User" | "Instructor"
  ):Promise<UpdateResult> {
    return this._messageRepository.markMessagesAsRead(chatId, userId, userModel);
  }

  async getUnreadCounts(userId: string, userModel: "User" | "Instructor"):Promise<{ chat: string; count: number }[]> {
    return this._messageRepository.getUnreadCounts(userId, userModel);
  }
}
