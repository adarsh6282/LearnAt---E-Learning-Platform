import Review from "../../models/implementations/reviewModel"
import { Types } from "mongoose";
import { IReviewRepository } from "../interfaces/review.interface";

export class ReviewRepository implements IReviewRepository  {
  async createReview(courseId: string, userId: string, rating: number, text: string) {
    return await Review.create({ course: courseId, user: userId, rating, text });
  }

  async getCourseReviews(courseId: string) {
    return await Review.find({ course: courseId }).populate("user", "name");
  }

  async hasUserReviewed(courseId: string, userId: string) {
    return await Review.findOne({ course: courseId, user: userId });
  }

  async getAverageRating(courseId: string) {
    const result = await Review.aggregate([
      { $match: { course: new Types.ObjectId(courseId) } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    return result[0]?.avg || 0;
  }
};
