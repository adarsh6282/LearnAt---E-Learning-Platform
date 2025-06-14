import {Request,Response} from "express"

export interface IAuthController{
    signup(req:Request,res:Response):Promise<void>,
    signin(req:Request,res:Response):Promise<void>,
    verifyOtp(req:Request,res:Response):Promise<void>,
    verifyGoogle(req:Request,res:Response):Promise<void>
    forgotPassword(req:Request,res:Response):Promise<void>,
    verifyForgotOtp(req:Request,res:Response):Promise<void>,
    resetPassword(req:Request,res:Response):Promise<void>,
    resentOtp(req:Request,res:Response):Promise<void>,
    getProfile(req:Request,res:Response):Promise<void>,
    updateProfile(req:Request,res:Response):Promise<void>,
    getCourses(req:Request,res:Response):Promise<void>,
    findCourseById(req:Request,res:Response):Promise<void>,
    buyCourse(req:Request,res:Response):Promise<void>,
    verifyOrder(req:Request,res:Response):Promise<void>
}