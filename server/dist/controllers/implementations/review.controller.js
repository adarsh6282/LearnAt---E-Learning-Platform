"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class ReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    async submitReview(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user?.id;
            const { rating, text } = req.body;
            if (!userId) {
                return;
            }
            if (!rating || !text) {
                res
                    .status(statusCodes_1.httpStatus.BAD_REQUEST)
                    .json({ message: "Rating and Review is Required" });
            }
            await this._reviewService.submitReview(courseId, userId, rating, text);
            res.status(statusCodes_1.httpStatus.CREATED).json({ message: "Review submitted" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCourseReviews(req, res) {
        const { courseId } = req.params;
        try {
            const reviews = await this._reviewService.getReviewsByCourse(courseId);
            res.status(statusCodes_1.httpStatus.OK).json({ reviews });
        }
        catch (err) {
            console.log(err);
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Something went wrong" });
        }
    }
}
exports.ReviewController = ReviewController;
