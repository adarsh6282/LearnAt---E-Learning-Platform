import {Request,Response} from "express"

export interface IInstructorController{
    signup(req:Request,res:Response):Promise<void>,
    signin(req:Request,res:Response):Promise<void>,
    reApply(req:Request,res:Response):Promise<void>
    verifyOtp(req:Request,res:Response):Promise<void>,
    forgotPassword(req:Request,res:Response):Promise<void>,
    verifyForgotOtp(req:Request,res:Response):Promise<void>,
    resetPassword(req:Request,res:Response):Promise<void>,
    resentOtp(req:Request,res:Response):Promise<void>,
    getProfile(req:Request,res:Response):Promise<void>,
    updateProfile(req:Request,res:Response):Promise<void>,
    getCourses(req:Request,res:Response):Promise<void>,
    getCoursesById(req:Request,res:Response):Promise<void>,
    getInstructorReviews(req:Request,res:Response):Promise<void>,
    getEnrollments(req:Request,res:Response):Promise<void>,
    getWallet(req:Request,res:Response):Promise<void>
}