import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { MessageService } from "../services/implementation/message.service";
import { MessageRepository } from "../repository/implementations/message.repository";
import dotenv from "dotenv";

dotenv.config();

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);

export const initSocket = (server: HTTPServer): void => {
  const io = new Server(server, {
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

    socket.on("sendMessage", async (message) => {
      try {
        const saved = await messageService.sendMessage(message);
        socket.to(message.chat).emit("receiveMessage", saved);
      } catch (error) {
        console.error("Socket Error Saving Message:", error);
      }
    });

    socket.on("join-video-room", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket joined video room: ${chatId}`);
    });

    socket.on("webrtc-offer", ({ chatId, offer, senderId, receiverId }) => {
      socket.to(chatId).emit("incoming-call", {
        chatId,
        callerId: senderId,
        receiverId
      });

      socket.to(chatId).emit("webrtc-offer", { offer, senderId });
    });

    socket.on("call-accepted", ({ callerId, chatId }) => {
      io.to(chatId).emit("call-accepted", { chatId });
    });

    socket.on("call-rejected",({callerId,chatId})=>{
      socket.to(chatId).emit("end-call")
    })

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
