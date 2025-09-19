import { MessageDTO } from "../DTO/message.dto"
import { IMessage } from "../models/interfaces/chat.interface"

export const toMessageDTO=(message:IMessage):MessageDTO=>{
    return {
        _id:message._id?.toString(),
        chat:message.chat,
        senderId:message.senderId,
        senderRole:message.senderRole,
        image:message.image,
        isDeleted:message.isDeleted,
        content:message.content,
        createdAt:message.createdAt
    }
}

export const toMessageDTOList=(messages:IMessage[]):MessageDTO[]=>{
    return messages.map(toMessageDTO)
}