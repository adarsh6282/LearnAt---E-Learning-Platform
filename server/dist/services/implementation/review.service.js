"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_mapper_1 = require("../../Mappers/review.mapper");
class ReviewService {
    constructor(_reviewRepository) {
        this._reviewRepository = _reviewRepository;
    }
    async submitReview(courseId, userId, rating, text) {
        const existingReview = await this._reviewRepository.hasUserReviewed(courseId, userId);
        if (existingReview) {
            throw new Error("You have already reviewed this course.");
        }
        const review = await this._reviewRepository.createReview(courseId, userId, rating, text);
        return review;
    }
    async getReviewsByCourse(courseId) {
        const review = await this._reviewRepository.getCourseReviews(courseId);
        return (0, review_mapper_1.toReviewDTOList)(review);
    }
}
exports.ReviewService = ReviewService;
