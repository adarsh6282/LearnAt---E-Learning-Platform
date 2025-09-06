"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const reviewModel_1 = __importDefault(require("../../models/implementations/reviewModel"));
const mongoose_1 = require("mongoose");
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
class ReviewRepository {
    async createReview(courseId, userId, rating, text) {
        return await reviewModel_1.default.create({
            course: courseId,
            user: userId,
            rating,
            text,
        });
    }
    async getCourseReviews(courseId) {
        return await reviewModel_1.default.find({ course: courseId }).populate("user", "name");
    }
    async hasUserReviewed(courseId, userId) {
        return await reviewModel_1.default.findOne({ course: courseId, user: userId });
    }
    async getAverageRating(courseId) {
        const result = await reviewModel_1.default.aggregate([
            { $match: { course: new mongoose_1.Types.ObjectId(courseId) } },
            { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]);
        return result[0]?.avg || 0;
    }
    async getReviewsByInstructor(instructorId, page, limit, rating) {
        const skip = (page - 1) * limit;
        const courses = await courseModel_1.default.find({ instructor: instructorId }).select("_id");
        const courseIds = courses.map((c) => c._id);
        if (courseIds.length === 0) {
            return { reviews: [], total: 0, totalPages: 0 };
        }
        const filter = {
            course: { $in: courseIds },
            isHidden: false,
        };
        if (rating) {
            filter.rating = rating;
        }
        const total = await reviewModel_1.default.countDocuments(filter);
        const reviews = await reviewModel_1.default.find(filter)
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
    async getAllReviews(page, limit, search, rating, sort) {
        const skip = (page - 1) * limit;
        const query = {};
        if (search) {
            const matchedCourses = await courseModel_1.default.find({
                title: { $regex: search, $options: "i" },
            }).select("_id");
            const courseIds = matchedCourses.map((c) => c._id);
            query.$or = [
                { text: { $regex: search, $options: "i" } },
                { course: { $in: courseIds } },
            ];
        }
        let sortOption = { createdAt: -1 };
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
            reviewModel_1.default.find(query)
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
            reviewModel_1.default.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { reviews, total, totalPages };
    }
    async findReviewAndHide(id) {
        return reviewModel_1.default.findByIdAndUpdate(id, { isHidden: true }, { new: true });
    }
    async findReviewAndUnhide(id) {
        return reviewModel_1.default.findByIdAndUpdate(id, { isHidden: false }, { new: true });
    }
    async deleteReview(id) {
        return reviewModel_1.default.findByIdAndDelete(id);
    }
}
exports.ReviewRepository = ReviewRepository;
