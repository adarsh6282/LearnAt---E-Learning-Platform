import { Router } from "express";
import { ChatService } from "../services/implementation/chat.service";
import { ChatRepository } from "../repository/implementations/chat.repository";
import authRole from "../middlewares/authRole";
import { ChatController } from "../controllers/implementations/chat.controller";

const chatRepository=new ChatRepository()
const chatService = new ChatService(chatRepository)
const chatController=new ChatController(chatService)

const router=Router()

router.post("/initiate",authRole(["user","instructor"]),chatController.initChat.bind(chatController))
router.get("/list/:id",authRole(["user","instructor"]),chatController.getChatList.bind(chatController))

export default router