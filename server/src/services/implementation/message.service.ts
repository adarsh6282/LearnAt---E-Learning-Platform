import { UpdateResult } from "mongoose";
import { IMessage } from "../../models/interfaces/chat.interface";
import { IMessageRepository } from "../../repository/interfaces/message.interface";
import { IMessageService } from "../interfaces/message.interface";
import { MessageDTO } from "../../DTO/message.dto";
import { toMessageDTO, toMessageDTOList } from "../../Mappers/message.mapper";

export class MessageService implements IMessageService {
  constructor(private _messageRepository: IMessageRepository) {}

  async sendMessage(data: Partial<IMessage>): Promise<MessageDTO> {
    const message = await this._messageRepository.saveMessage(data);

    if(!message){
      throw new Error("failed to send message")
    }
    return toMessageDTO(message)
  }

  async fetchMessages(chatId: string): Promise<MessageDTO[]> {
    const messages =await  this._messageRepository.getChatMessages(chatId);
    if(!messages){
      throw new Error("failed to fetch messages")
    }
    return toMessageDTOList(messages)
  }

  async markRead(
    chatId: string,
    userId: string,
    userModel: "User" | "Instructor"
  ):Promise<UpdateResult> {
    return this._messageRepository.markMessagesAsRead(chatId, userId, userModel);
  }

  async deleteMessage(messageId: string, userId: string): Promise<MessageDTO> {
    const message = await this._messageRepository.deleteMessage(messageId)

    if(!message){
      throw new Error("Message not found")
    }

    if(message.senderId.toString()!==userId){
      throw new Error("you can't delete this message")
    }

    return toMessageDTO(message)
  }

  async getUnreadCounts(userId: string, userModel: "User" | "Instructor"):Promise<{ chat: string; count: number }[]> {
    return this._messageRepository.getUnreadCounts(userId, userModel);
  }
}
