"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/implementations/message.controller");
const message_service_1 = require("../services/implementation/message.service");
const message_repository_1 = require("../repository/implementations/message.repository");
const multer_1 = __importDefault(require("../utils/multer"));
const messageRepository = new message_repository_1.MessageRepository();
const messageService = new message_service_1.MessageService(messageRepository);
const messageController = new message_controller_1.MessageController(messageService);
const router = (0, express_1.Router)();
router.get("/:chatId", messageController.getMessages.bind(messageController));
router.post("/upload-image", multer_1.default.single("chatImage"), messageController.uploadImagesToChat.bind(messageController));
exports.default = router;
