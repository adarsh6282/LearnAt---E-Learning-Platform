import { Request,Response } from "express";

export interface IAdminController{
    login(req:Request,res:Response):Promise<void>,
    blockUnblockUser(req:Request,res:Response):Promise<void>,
    blockUnblockTutor(req:Request,res:Response):Promise<void>,
    getDashboard(req:Request,res:Response):Promise<void>,
    getAllUsers(req:Request,res:Response):Promise<void>,
    getAllTutors(req:Request,res:Response):Promise<void>,
    approveTutor(req:Request,res:Response):Promise<void>,
    rejectTutor(req:Request,res:Response):Promise<void>,
    addCategory(req:Request,res:Response):Promise<void>,
    getCatgeories(req:Request,res:Response):Promise<void>,
    deleteCategory(req:Request,res:Response):Promise<void>
    restoreCategory(req:Request,res:Response):Promise<void>,
    getCourses(req:Request,res:Response):Promise<void>,
    softDeleteCourse(req:Request,res:Response):Promise<void>,
    recoverCourse(req:Request,res:Response):Promise<void>
}