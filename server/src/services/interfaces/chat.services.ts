import { ChatDTO } from "../../DTO/chat.dto";

export interface IChatService{
    initiateChat(userid:string,instructorId:string):Promise<ChatDTO>
    getChatList(userId:string,role:"user"|"instructor"):Promise<ChatDTO[]>
}