import { IMessage } from "../../models/interfaces/chat.interface";

export interface IMessageService{
    sendMessage(data:any):Promise<IMessage|null>
    fetchMessages(chatId:string):Promise<IMessage[]|null>    
}