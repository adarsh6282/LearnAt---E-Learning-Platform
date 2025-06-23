import { IReview } from "../../models/interfaces/review.interface";

export interface IReviewRepository {
  createReview(
    courseId: string,
    userId: string,
    rating: number,
    text: string
  ): Promise<IReview>;

  getCourseReviews(courseId: string): Promise<IReview[]>;

  hasUserReviewed(courseId: string, userId: string): Promise<IReview | null>;

  getAverageRating(courseId: string): Promise<number>;

  getReviewsByInstructor(instructorId:string):Promise<IReview[]|null>

  getAllReviews():Promise<IReview[]|null>

  findReviewAndHide(id:string):Promise<IReview|null>
  
  findReviewAndUnhide(id:string):Promise<IReview|null>

  deleteReview(id:string):Promise<IReview|null>
}