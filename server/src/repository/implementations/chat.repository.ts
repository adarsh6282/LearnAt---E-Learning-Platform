import { IChat } from "../../models/interfaces/chat.interface";
import { IChatRepository } from "../interfaces/chat.interface";
import Chat from "../../models/implementations/chatModel";

export class ChatRepository implements IChatRepository {
  async findOrCreateChat(
    userId: string,
    instructorId: string
  ): Promise<IChat | null> {
    let chat = await Chat.findOne({ user: userId, instructor: instructorId });
    if (!chat) {
      chat = await Chat.create({ user: userId, instructor: instructorId });
    }
    return chat;
  }

  async getUsersChat(userId: string): Promise<IChat[] | null> {
    return Chat.find({ user: userId }).populate("instructor", "name");
  }

  async getInstructorsChat(instructorId: string): Promise<IChat[] | null> {
      return Chat.find({ instructor: instructorId }).populate("user", "name");
  }
}
