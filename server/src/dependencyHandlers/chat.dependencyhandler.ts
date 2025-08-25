import { ChatController } from "../controllers/implementations/chat.controller"
import { ChatRepository } from "../repository/implementations/chat.repository"
import { ChatService } from "../services/implementation/chat.service"

const chatRepository=new ChatRepository()
const chatService = new ChatService(chatRepository)
export const chatController=new ChatController(chatService)
