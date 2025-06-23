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
exports.ReviewController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class ReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    submitReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { rating, text } = req.body;
                if (!userId) {
                    return;
                }
                if (!rating || !text) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Rating and Review is Required" });
                }
                const review = yield this._reviewService.submitReview(courseId, userId, rating, text);
                res.status(statusCodes_1.httpStatus.CREATED).json({ message: "Review submitted" });
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    getCourseReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            console.log(courseId);
            try {
                const reviews = yield this._reviewService.getReviewsByCourse(courseId);
                res.status(statusCodes_1.httpStatus.OK).json({ reviews });
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
            }
        });
    }
}
exports.ReviewController = ReviewController;
