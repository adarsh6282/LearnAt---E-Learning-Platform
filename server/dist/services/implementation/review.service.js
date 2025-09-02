"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_mapper_1 = require("../../Mappers/review.mapper");
class ReviewService {
    constructor(_reviewRepository) {
        this._reviewRepository = _reviewRepository;
    }
    submitReview(courseId, userId, rating, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingReview = yield this._reviewRepository.hasUserReviewed(courseId, userId);
            if (existingReview) {
                throw new Error("You have already reviewed this course.");
            }
            const review = yield this._reviewRepository.createReview(courseId, userId, rating, text);
            return review;
        });
    }
    getReviewsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this._reviewRepository.getCourseReviews(courseId);
            return (0, review_mapper_1.toReviewDTOList)(review);
        });
    }
}
exports.ReviewService = ReviewService;
