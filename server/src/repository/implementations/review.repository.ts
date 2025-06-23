import Review from "../../models/implementations/reviewModel"
import { Types } from "mongoose";
import { IReviewRepository } from "../interfaces/review.interface";
import { IReview } from "../../models/interfaces/review.interface";
import Course from "../../models/implementations/courseModel"

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

  async getReviewsByInstructor(instructorId: string): Promise<IReview[] | null> {
    const courses=await Course.find({instructor:instructorId},"_id")
    const courseIds=courses.map((c)=>c._id)

    return Review.find({
      course:{$in:courseIds},
      isHidden:false
    }).populate("user","name")
    .populate("course","title")
  }

  async getAllReviews(): Promise<IReview[] | null> {
    return await Review.find()
      .populate({
        path: "user",
        select: "name"
      })
      .populate({
        path: "course",
        select: "title instructor",
        populate: {
          path: "instructor",
          select: "name"
        }
      })
      .sort({ createdAt: -1 })
  }

  async findReviewAndHide(id: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id,{isHidden:true},{new:true})
  }

  async findReviewAndUnhide(id: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id,{isHidden:false},{new:true})
  }

  async deleteReview(id: string): Promise<IReview | null> {
    return Review.findByIdAndDelete(id)
  }
};
