import { IInstructorController } from "../interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { IInstructorAuthService } from "../../services/interfaces/instructorAuth.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";

export class InstructorAuthController implements IInstructorController{
    constructor(private instructorAuthService:IInstructorAuthService){
    }

    async signup(req: Request, res: Response): Promise<void> {
        try{
            const {email}=req.body
            const instructor = await this.instructorAuthService.registerInstructor(email)
            res.status(httpStatus.OK).json({message:"OTP sent Successfully"})
        }catch(err:any){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

    async signin(req: Request, res: Response): Promise<void> {
        try{
            const {email,password}=req.body
            const instructor=await this.instructorAuthService.loginInstructor(email,password)
            res.status(httpStatus.OK).json({ instructor })
        }catch(err:any){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
      try{
        const instructorData=req.body
        const user=await this.instructorAuthService.verifyOtp(instructorData)
        res.status(httpStatus.CREATED).json({user,message:"Instructor Registered Successfully, Waiting for approval"})
      }catch(err:any){
        console.log(err.message)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try{
        const {email}=req.body
        const user = await this.instructorAuthService.handleForgotPassword(email)

        res.status(httpStatus.OK).json({message:"OTP Sent Successfully"})
      }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
        try{
        const data=req.body
        const userData=await this.instructorAuthService.verifyForgotOtp(data)
        res.status(httpStatus.OK).json({ message: 'OTP verified.'})
      }catch(err){
        res.status(httpStatus.NOT_FOUND).json(err)
      }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try{
        const data=req.body
        await this.instructorAuthService.handleResetPassword(data)
        res.status(httpStatus.OK).json({message:"Password resetted successfully"})
      }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async resentOtp(req: Request, res: Response): Promise<void> {
        try{
        let {email}=req.body
        await this.instructorAuthService.handleResendOtp(email)
        res.status(httpStatus.OK).json({message:"OTP resent Successsfully!"})
      }catch(err:any){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }
}