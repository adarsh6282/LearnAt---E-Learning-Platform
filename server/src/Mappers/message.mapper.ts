import { MessageDTO } from "../DTO/message.dto";
import { IMessage } from "../models/interfaces/chat.interface";

export const toMessageDTO = (message: IMessage): MessageDTO => {
  return {
    _id: message._id?.toString(),
    chatId: message.chat.toString(),
    senderId: message.senderId.toString(),
    senderRole: message.senderRole,
    image: message.image,
    isDeleted: message.isDeleted,
    content: message.content,
    createdAt: message.createdAt,
  };
};

export const toMessageDTOList = (messages: IMessage[]): MessageDTO[] => {
  return messages.map(toMessageDTO);
};
