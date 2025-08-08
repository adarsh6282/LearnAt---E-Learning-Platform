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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const reviewModel_1 = __importDefault(require("../../models/implementations/reviewModel"));
const mongoose_1 = require("mongoose");
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
class ReviewRepository {
    createReview(courseId, userId, rating, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reviewModel_1.default.create({
                course: courseId,
                user: userId,
                rating,
                text,
            });
        });
    }
    getCourseReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reviewModel_1.default.find({ course: courseId }).populate("user", "name");
        });
    }
    hasUserReviewed(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reviewModel_1.default.findOne({ course: courseId, user: userId });
        });
    }
    getAverageRating(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield reviewModel_1.default.aggregate([
                { $match: { course: new mongoose_1.Types.ObjectId(courseId) } },
                { $group: { _id: null, avg: { $avg: "$rating" } } },
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avg) || 0;
        });
    }
    getReviewsByInstructor(instructorId, page, limit, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield courseModel_1.default.find({ instructor: instructorId }).select("_id");
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
            const total = yield reviewModel_1.default.countDocuments(filter);
            const reviews = yield reviewModel_1.default.find(filter)
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
        });
    }
    getAllReviews(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [reviews, total] = yield Promise.all([
                reviewModel_1.default.find()
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
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                reviewModel_1.default.countDocuments(),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { reviews, total, totalPages };
        });
    }
    findReviewAndHide(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return reviewModel_1.default.findByIdAndUpdate(id, { isHidden: true }, { new: true });
        });
    }
    findReviewAndUnhide(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return reviewModel_1.default.findByIdAndUpdate(id, { isHidden: false }, { new: true });
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return reviewModel_1.default.findByIdAndDelete(id);
        });
    }
}
exports.ReviewRepository = ReviewRepository;
