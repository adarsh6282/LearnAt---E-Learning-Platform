import { Request,Response } from "express";

export interface IAdminController{
    getAllUsers(req:Request,res:Response):Promise<void>,
    getAllTutors(req:Request,res:Response):Promise<void>,
    approveTutor(req:Request,res:Response):Promise<void>
    rejectTutor(req:Request,res:Response):Promise<void>
}