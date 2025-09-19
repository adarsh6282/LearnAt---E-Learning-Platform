import { ChatDTO } from "../DTO/chat.dto"
import { IChat } from "../models/interfaces/chat.interface"

export const toChatDTO=(chat:IChat):ChatDTO=>{
    return {
        _id:chat._id?.toString(),
        user:chat.user,
        instructor:chat.instructor,
        createdAt:chat.createdAt,
        lastMessage:chat.lastMessage,
        lastMessageContent:chat.lastMessageContent
    }
}

export const toChatDTOList=(chats:IChat[]):ChatDTO[]=>{
    return chats.map(toChatDTO)
}