import Review from "../../models/implementations/reviewModel";
import { FilterQuery, Types } from "mongoose";
import { IReviewRepository } from "../interfaces/review.interface";
import { IReview } from "../../models/interfaces/review.interface";
import Course from "../../models/implementations/courseModel";

export class ReviewRepository implements IReviewRepository {
  async createReview(
    courseId: string,
    userId: string,
    rating: number,
    text: string
  ) {
    return await Review.create({
      course: courseId,
      user: userId,
      rating,
      text,
    });
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

  async getReviewsByInstructor(
    instructorId: string,
    page: number,
    limit: number,
    rating: number
  ): Promise<{ reviews: IReview[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id"
    );
    const courseIds = courses.map((c) => c._id);

    if (courseIds.length === 0) {
      return { reviews: [], total: 0, totalPages: 0 };
    }

    const filter: FilterQuery<IReview> = {
      course: { $in: courseIds },
      isHidden: false,
    };

    if (rating) {
      filter.rating = rating;
    }

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate("user", "name")
      .populate("course", "title")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllReviews(
    page: number,
    limit: number,
    search: string,
    rating: number | null,
    sort: string
  ): Promise<{ reviews: IReview[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IReview> = {};

    if (search) {
      const matchedCourses = await Course.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");

      const courseIds = matchedCourses.map((c) => c._id);

      query.$or = [
        { text: { $regex: search, $options: "i" } },
        { course: { $in: courseIds } },
        
      ];
    }

    let sortOption: FilterQuery<IReview> = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "ratingHigh":
        sortOption = { rating: -1 };
        break;
      case "ratingLow":
        sortOption = { rating: 1 };
        break;
      case "date":
      default:
        sortOption = { createdAt: -1 };
    }

    if (rating !== null) {
      query.rating = rating;
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate({
          path: "user",
          select: "name",
        })
        .populate({
          path: "course",
          select: "title instructor",
          populate: {
            path: "instructor",
            select: "name",
          },
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Review.countDocuments(query),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { reviews, total, totalPages };
  }

  async findReviewAndHide(id: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id, { isHidden: true }, { new: true });
  }

  async findReviewAndUnhide(id: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id, { isHidden: false }, { new: true });
  }

  async deleteReview(id: string): Promise<IReview | null> {
    return Review.findByIdAndDelete(id);
  }
}
