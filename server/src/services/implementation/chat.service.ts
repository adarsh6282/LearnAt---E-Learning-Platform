import { ChatDTO } from "../../DTO/chat.dto";
import { toChatDTO, toChatDTOList } from "../../Mappers/chat.mapper";
import { IChatRepository } from "../../repository/interfaces/chat.interface";
import { IChatService } from "../interfaces/chat.services";

export class ChatService implements IChatService {
  constructor(private _chatRepository: IChatRepository) {}

  async initiateChat(
    userId: string,
    instructorId: string
  ): Promise<ChatDTO> {
    const chat = await this._chatRepository.findOrCreateChat(userId, instructorId);
    if(!chat){
      throw new Error("failed to initiate chat")
    }
    return toChatDTO(chat)
  }

  async getChatList(
    userId: string,
    role: "user" | "instructor"
  ): Promise<ChatDTO[]> {
    const chats = role === "user"
      ? await this._chatRepository.getUsersChat(userId)
      : await this._chatRepository.getInstructorsChat(userId);

      if(!chats){
        throw new Error("failed to load chalist")
      }
      return toChatDTOList(chats)
  }
}
