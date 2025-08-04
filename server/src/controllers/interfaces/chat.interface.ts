import { Request,Response } from "express";

export interface IChatController{
    initChat(req:Request,res:Response):Promise<void>,
    getChatList(req:Request,res:Response):Promise<void>
}