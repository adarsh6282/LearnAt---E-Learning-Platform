import { Router } from "express";
import authRole from "../middlewares/authRole";
import { chatController } from "../dependencyHandlers/chat.dependencyhandler";
import { CHAT_ROUTES } from "../constants/routes";

const router=Router()

router.post(CHAT_ROUTES.INITIATE,authRole(["user","instructor"]),chatController.initChat.bind(chatController))
router.get(CHAT_ROUTES.CHAT_LIST,authRole(["user","instructor"]),chatController.getChatList.bind(chatController))

export default router