import Message from "../../models/implementations/messageModel"
import { IMessage } from "../../models/interfaces/chat.interface"
import { IMessageRepository } from "../interfaces/message.interface"
import Chat from "../../models/implementations/chatModel"

export class MessageRepository implements IMessageRepository{
    async saveMessage(messageData: any): Promise<IMessage | null> {
        const message = await Message.create(messageData)

        await Chat.findByIdAndUpdate(messageData.chat,{lastMessage:new Date()})

        return message
    }

    async getChatMessages(chatId: string): Promise<IMessage[] | null> {
        return await Message.find({ chat: chatId }).sort({ createdAt: 1 });
    }
}