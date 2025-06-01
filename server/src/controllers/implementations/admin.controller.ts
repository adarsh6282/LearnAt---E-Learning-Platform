import { IAdminController } from "../interfaces/admin.interface";
import { IAdminService } from "../../services/interfaces/admin.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";


export class AdminController implements IAdminController{
    constructor(private adminService:IAdminService){}

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try{
            const users=await this.adminService.getAllUsers()
            res.status(httpStatus.OK).json(users)
        }catch(err){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

    async getAllTutors(req: Request, res: Response): Promise<void> {
        try{
            const tutors=await this.adminService.getAllTutors()
            res.status(httpStatus.OK).json(tutors)
        }catch(err){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

    async approveTutor(req: Request, res: Response): Promise<void> {
        const {email}=req.body

        try{
            const approve =await this.adminService.verifyTutor(email)
            res.status(httpStatus.OK).json("Tutor Approved Successfully")
        }catch(err){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

    async rejectTutor(req: Request, res: Response): Promise<void> {
        const {email}=req.params

        try{
            const deleted=await this.adminService.rejectTutor(email)
            if(!deleted){
                res.status(httpStatus.NOT_FOUND).json({message:"Tutor Not Found"})
            }
            res.status(httpStatus.OK).json({message:"Tutor rejected and deleted successfully"})
        }catch(err){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }
}