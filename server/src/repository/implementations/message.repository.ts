import Message from "../../models/implementations/messageModel";
import { IMessage } from "../../models/interfaces/chat.interface";
import { IMessageRepository } from "../interfaces/message.interface";
import Chat from "../../models/implementations/chatModel";
import { UpdateResult } from "mongodb";
import mongoose from "mongoose";

export class MessageRepository implements IMessageRepository {
  async saveMessage(messageData: any): Promise<IMessage | null> {
    const withReadBy = {
      ...messageData,
      readBy: [
        {
          readerId: messageData.senderId,
          readerModel:
            messageData.senderRole === "user" ? "User" : "Instructor",
        },
      ],
    };

    const message = await Message.create(withReadBy);

    await Chat.findByIdAndUpdate(messageData.chat, {
      lastMessage: new Date(),
      lastMessageContent: message.content,
    });

    return message;
  }

  async getChatMessages(chatId: string): Promise<IMessage[] | null> {
    return await Message.find({ chat: chatId }).sort({ createdAt: 1 });
  }

  async markMessagesAsRead(
    chatId: string,
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<UpdateResult> {
    return await Message.updateMany(
      {
        chat: chatId,
        "readBy.readerId": { $ne: userId },
      },
      {
        $push: { readBy: { readerId: userId, readerModel: userModel } },
      }
    );
  }
  async getUnreadCounts(
    userId: string,
    userModel: "User" | "Instructor"
  ): Promise<{ chat: string; count: number }[]> {
    const objectId = new mongoose.Types.ObjectId(userId);

    const messages = await Message.aggregate([
      {
        $match: {
          "readBy.readerId": { $ne: objectId },
          senderId: { $ne: objectId },
        },
      },
      {
        $group: {
          _id: "$chat",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "_id",
          foreignField: "_id",
          as: "chatData",
        },
      },
      { $unwind: "$chatData" },
      {
        $match:
          userModel === "User"
            ? { "chatData.user": objectId }
            : { "chatData.instructor": objectId },
      },
      {
        $project: {
          chat: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    return messages;
  }
}
