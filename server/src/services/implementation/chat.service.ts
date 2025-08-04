import { IChat } from "../../models/interfaces/chat.interface";
import { IChatRepository } from "../../repository/interfaces/chat.interface";
import { IChatService } from "../interfaces/chat.services";

export class ChatService implements IChatService {
  constructor(private _chatRepository: IChatRepository) {}

  async initiateChat(
    userId: string,
    instructorId: string
  ): Promise<IChat | null> {
    return await this._chatRepository.findOrCreateChat(userId, instructorId);
  }

  async getChatList(
    userId: string,
    role: "user" | "instructor"
  ): Promise<IChat[] | null> {
    return role === "user"
      ? await this._chatRepository.getUsersChat(userId)
      : await this._chatRepository.getInstructorsChat(userId);
  }
}
