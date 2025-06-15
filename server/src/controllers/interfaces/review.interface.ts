import { Request,Response } from "express";

export interface IReviewController{
    submitReview(req:Request,res:Response):Promise<void>,
    getCourseReviews(req: Request, res: Response):Promise<void>
}