import { ReviewDTO } from "../DTO/review.dto";
import { IReview } from "../models/interfaces/review.interface";

export const toReviewDTO = (review: IReview): ReviewDTO => ({
  _id: review._id?.toString(),
  course: review.course,
  user: review.user,
  rating: review.rating,
  text: review.text,
  isHidden: review.isHidden,
  createdAt:review.createdAt
});


export const toReviewDTOList=(reviews:IReview[]):ReviewDTO[]=>{
    return reviews.map(toReviewDTO)
}