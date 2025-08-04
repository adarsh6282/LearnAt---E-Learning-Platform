import { IMessage } from "../../models/interfaces/chat.interface";
import { IMessageRepository } from "../../repository/interfaces/message.interface";
import { IMessageService } from "../interfaces/message.interface";

export class MessageService implements IMessageService{
    constructor(private _messageRepository:IMessageRepository){}

    async sendMessage(data: any): Promise<IMessage | null> {
        return this._messageRepository.saveMessage(data)
    }

    async fetchMessages(chatId: string): Promise<IMessage[] | null> {
        return this._messageRepository.getChatMessages(chatId)
    }
}