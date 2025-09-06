import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { MessageService } from "../services/implementation/message.service";
import { MessageRepository } from "../repository/implementations/message.repository";
import Chat from "../models/implementations/chatModel";
import dotenv from "dotenv";

dotenv.config();

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);

let io: Server;

export const initSocket = (server: HTTPServer): void => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket joined room: ${chatId}`);
    });

    socket.on("joinNotificationRoom", (userId: string) => {
      socket.join(userId);
      console.log(`Socket joined notification room: ${userId}`);
    });

    socket.on("sendMessage", async (message) => {
      try {
        const saved = await messageService.sendMessage(message);
        socket.to(message.chat).emit("receiveMessage", saved);
        const chat = await Chat.findById(message.chat);
        let receiverId;
        if (message.senderId === chat?.user.toString()) {
          receiverId = chat?.instructor.toString();
        } else {
          receiverId = chat?.user.toString();
        }

        if (receiverId) {
          io.to(receiverId).emit("newMessageForBadge", {
            chatId: message.chat,
          });
        }

        const chatListUpdate = {
          chatId: chat?._id,
          lastMessage: chat?.lastMessage,
          lastMessageContent: chat?.lastMessageContent,
        };

        io.to(message.senderId.toString()).emit(
          "updateChatList",
          chatListUpdate
        );

        if (receiverId) {
          io.to(receiverId.toString()).emit("updateChatList", chatListUpdate);
        }
      } catch (error) {
        console.error("Socket Error Saving Message:", error);
      }
    });

    socket.on("join-video-room", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket joined video room: ${chatId}`);
    });

    socket.on("webrtc-offer", ({ chatId, offer, senderId, receiverId }) => {
      socket.to(receiverId).emit("incoming-call", {
        chatId,
        callerId: senderId,
        receiverId,
      });

      console.log("chatId", chatId);
      console.log("receiver", receiverId);

      socket.to(chatId).emit("webrtc-offer", { offer, senderId });
    });

    socket.on("call-rejected", ({ chatId }) => {
      socket.to(chatId).emit("end-call");
    });

    socket.on("webrtc-answer", ({ chatId, answer, senderId }) => {
      socket.to(chatId).emit("webrtc-answer", { answer, senderId });
    });

    socket.on("ice-candidate", ({ chatId, candidate, senderId }) => {
      socket.to(chatId).emit("ice-candidate", { candidate, senderId });
    });

    socket.on("end-call", ({ chatId }) => {
      socket.to(chatId).emit("end-call");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized yet");
  }
  return io;
};

export const sendNotificationToUser = (userId: string, message: string) => {
  getIO().to(userId).emit("newNotification", message);
};
