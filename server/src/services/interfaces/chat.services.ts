import { IChat } from "../../models/interfaces/chat.interface";

export interface IChatService{
    initiateChat(userid:string,instructorId:string):Promise<IChat|null>
    getChatList(userId:string,role:"user"|"instructor"):Promise<IChat[]|null>
}