import { Request, Response } from "express";
import { IMessageService } from "../../services/interfaces/message.interface";
import { IMessageController } from "../interfaces/message.interface";
import { httpStatus } from "../../constants/statusCodes";
import cloudinary from "../../config/cloudinary.config";
import fs from "fs"

export class MessageController implements IMessageController{
    constructor(private _messageService:IMessageService){}
    
    async getMessages(req: Request, res: Response): Promise<void> {
        try{
            const chatId=req.params.chatId
            const messages=await this._messageService.fetchMessages(chatId)
            res.status(httpStatus.OK).json(messages)
        }catch(err){
            console.log(err)
        }
    }

    async uploadImagesToChat(req:Request,res:Response):Promise<void>{
        try{
            const file=req.file
            if(!file){
                res.status(httpStatus.BAD_REQUEST).json({message:"File not found"})
                return
            }
            const result=await cloudinary.uploader.upload(file?.path,{
                folder:"chat_uploads",
                resource_type:"auto"
            })
            fs.unlinkSync(file.path)

            res.status(httpStatus.OK).json({message:"file uploaded",url:result.secure_url})
        }catch(err){
            console.log(err)
        }
    }
}