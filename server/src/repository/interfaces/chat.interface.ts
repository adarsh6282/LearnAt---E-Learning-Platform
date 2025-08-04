import { IChat } from "../../models/interfaces/chat.interface";

export interface IChatRepository{
    findOrCreateChat(userId:string,instructorId:string):Promise<IChat|null>
    getUsersChat(userId:string):Promise<IChat[]|null>
    getInstructorsChat(instructorId:string):Promise<IChat[]|null>
}