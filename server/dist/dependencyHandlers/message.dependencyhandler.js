"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const message_controller_1 = require("../controllers/implementations/message.controller");
const message_repository_1 = require("../repository/implementations/message.repository");
const message_service_1 = require("../services/implementation/message.service");
const messageRepository = new message_repository_1.MessageRepository();
const messageService = new message_service_1.MessageService(messageRepository);
exports.messageController = new message_controller_1.MessageController(messageService);
