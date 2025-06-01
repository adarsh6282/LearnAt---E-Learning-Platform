import {Request,Response} from "express"
import { IAuthController } from "../interfaces/auth.interfaces"
import { IAuthService } from "../../services/interfaces/auth.services"
import {httpStatus} from "../../constants/statusCodes"
import { generateToken } from "../../utils/generateToken"

export class Authcontroller implements IAuthController{
    constructor (private authService : IAuthService){
    }

    async signup(req: Request, res: Response): Promise<void> {
        try{
            const {email}=req.body
            const user= await this.authService.registerUser(email)
            res.status(httpStatus.OK).json({message:"Otp sent successfully"})
        }catch(err:any){
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        }
    }

   async signin(req: Request, res: Response): Promise<void> {
      try {
        const { email, password } = req.body
        const user = await this.authService.loginUser(email, password)
        res.status(httpStatus.OK).json({ user })
      } catch (err: any) {
        if (err.message === "User doesn't exist" || err.message === "Invalid password") {
          res.status(httpStatus.UNAUTHORIZED).json({ message: err.message })
        } else {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" })
        }
      }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
      try{
        const userData=req.body
        console.log(userData)
        const user=await this.authService.verifyOtp(userData)
        res.status(httpStatus.CREATED).json({user,message:"User Registered Successfully"})
      }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async googleAuth(req: Request, res: Response): Promise<void> {
      if(!req.user){
        res.status(httpStatus.UNAUTHORIZED).json({ message: "Authentication failed" });
        return;
      }

      const token=generateToken((req.user as any).id)

      res.redirect(`http://localhost:5173/?token=${token}`);
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
      try{
        const {email}=req.body
        const user = await this.authService.handleForgotPassword(email)

        res.status(httpStatus.OK).json({message:"OTP Sent Successfully"})
      }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async verifyForgotOtp(req: Request, res: Response): Promise<void> {
      try{
        const data=req.body
        const userData=await this.authService.verifyForgotOtp(data)
        res.status(httpStatus.OK).json({ message: 'OTP verified.'})
      }catch(err){
        res.status(httpStatus.NOT_FOUND).json(err)
      }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
      try{
        const data=req.body
        await this.authService.handleResetPassword(data)
        res.status(httpStatus.OK).json({message:"Password resetted successfully"})
      }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
    }

    async resentOtp(req: Request, res: Response): Promise<void> {
      try{
        let {email}=req.body
        await this.authService.handleResendOtp(email)
        res.status(httpStatus.OK).json({message:"OTP resent Successsfully!"})
      }catch(err:any){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
      }
  }
}