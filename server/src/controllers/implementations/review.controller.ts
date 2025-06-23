import { Request, Response } from "express";
import { IReviewService } from "../../services/interfaces/review.interface";
import { IReviewController } from "../interfaces/review.interface";
import { httpStatus } from "../../constants/statusCodes";

export class ReviewController implements IReviewController{
    constructor(private _reviewService:IReviewService){}

    async submitReview(req: Request, res: Response): Promise<void> {
        try{
            const {courseId}=req.params
            const userId=req.user?.id
            const {rating,text}=req.body

            if(!userId){
                return
            }

            if(!rating||!text){
                res.status(httpStatus.BAD_REQUEST).json({message:"Rating and Review is Required"})
            }

            const review = await this._reviewService.submitReview(courseId,userId,rating,text)
            res.status(httpStatus.CREATED).json({message:"Review submitted"})
        }catch(err:any){
            console.log(err)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
        }
    }

    async getCourseReviews(req: Request, res: Response):Promise<void> {
    const {courseId} = req.params
    console.log(courseId)

    try {
      const reviews = await this._reviewService.getReviewsByCourse(courseId);
      res.status(httpStatus.OK).json({reviews});
    } catch (err) {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: "Something went wrong" });
    }
  }
}