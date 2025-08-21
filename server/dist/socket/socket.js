"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToUser = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const message_service_1 = require("../services/implementation/message.service");
const message_repository_1 = require("../repository/implementations/message.repository");
const chatModel_1 = __importDefault(require("../models/implementations/chatModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const messageRepository = new message_repository_1.MessageRepository();
const messageService = new message_service_1.MessageService(messageRepository);
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
            console.log(`Socket joined room: ${chatId}`);
        });
        socket.on("joinNotificationRoom", (userId) => {
            socket.join(userId);
            console.log(`Socket joined notification room: ${userId}`);
        });
        socket.on("sendMessage", (message) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const saved = yield messageService.sendMessage(message);
                socket.to(message.chat).emit("receiveMessage", saved);
                const chat = yield chatModel_1.default.findById(message.chat);
                let receiverId;
                if (message.senderId === (chat === null || chat === void 0 ? void 0 : chat.user.toString())) {
                    receiverId = chat === null || chat === void 0 ? void 0 : chat.instructor.toString();
                }
                else {
                    receiverId = chat === null || chat === void 0 ? void 0 : chat.user.toString();
                }
                console.log(receiverId);
                if (receiverId) {
                    io.to(receiverId.toString()).emit("receiveMessage", saved);
                }
            }
            catch (error) {
                console.error("Socket Error Saving Message:", error);
            }
        }));
        socket.on("join-video-room", (chatId) => {
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
        socket.on("call-rejected", ({ callerId, chatId }) => {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized yet");
    }
    return io;
};
exports.getIO = getIO;
const sendNotificationToUser = (userId, message) => {
    (0, exports.getIO)().to(userId).emit("newNotification", message);
};
exports.sendNotificationToUser = sendNotificationToUser;
