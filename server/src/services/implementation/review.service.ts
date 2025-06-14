import { IReview } from "../../models/interfaces/review.interface";
import { IReviewRepository } from "../../repository/interfaces/review.interface";
import { IReviewService } from "../interfaces/review.interface";


export class ReviewService implements IReviewService{
    constructor(private _reviewRepository:IReviewRepository){}

    async submitReview(courseId: string, userId: string, rating: number, text: string){
        const existingReview=await this._reviewRepository.hasUserReviewed(courseId,userId)

        if(existingReview){
            throw new Error("You have already reviewed this course.")
        }

        const review=await this._reviewRepository.createReview(courseId,userId,rating,text)

        return review
    }

    async getReviewsByCourse(courseId: string):Promise<IReview[]> {
    return await this._reviewRepository.getCourseReviews(courseId);
  }
}