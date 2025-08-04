import { IMessage } from "../../models/interfaces/chat.interface";

export interface IMessageRepository{
    saveMessage(messageData:any):Promise<IMessage|null>,
    getChatMessages(chatId:string):Promise<IMessage[]|null>
}