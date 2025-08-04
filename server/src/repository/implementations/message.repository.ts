import Message from "../../models/implementations/messageModel"
import { IMessage } from "../../models/interfaces/chat.interface"
import { IMessageRepository } from "../interfaces/message.interface"

export class MessageRepository implements IMessageRepository{
    async saveMessage(messageData: any): Promise<IMessage | null> {
        return await Message.create(messageData)
    }

    async getChatMessages(chatId: string): Promise<IMessage[] | null> {
        return await Message.find({ chat: chatId }).sort({ createdAt: 1 });
    }
}