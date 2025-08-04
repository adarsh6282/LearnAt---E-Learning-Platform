"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_service_1 = require("../services/implementation/chat.service");
const chat_repository_1 = require("../repository/implementations/chat.repository");
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const chat_controller_1 = require("../controllers/implementations/chat.controller");
const chatRepository = new chat_repository_1.ChatRepository();
const chatService = new chat_service_1.ChatService(chatRepository);
const chatController = new chat_controller_1.ChatController(chatService);
const router = (0, express_1.Router)();
router.post("/initiate", (0, authRole_1.default)(["user", "instructor"]), chatController.initChat.bind(chatController));
router.get("/list/:id", (0, authRole_1.default)(["user", "instructor"]), chatController.getChatList.bind(chatController));
exports.default = router;
