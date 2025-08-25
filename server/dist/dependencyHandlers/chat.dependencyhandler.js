"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chat_controller_1 = require("../controllers/implementations/chat.controller");
const chat_repository_1 = require("../repository/implementations/chat.repository");
const chat_service_1 = require("../services/implementation/chat.service");
const chatRepository = new chat_repository_1.ChatRepository();
const chatService = new chat_service_1.ChatService(chatRepository);
exports.chatController = new chat_controller_1.ChatController(chatService);
