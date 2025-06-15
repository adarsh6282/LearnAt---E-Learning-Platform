import { IReview } from "../../models/interfaces/review.interface";

export interface IReviewService{
    submitReview(courseId: string, userId: string, rating: number, text: string):Promise<IReview>
    getReviewsByCourse(courseId:string):Promise<IReview[]>
}
