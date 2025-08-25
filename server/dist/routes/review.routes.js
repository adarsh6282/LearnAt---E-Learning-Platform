"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const review_dependencyhandler_1 = require("../dependencyHandlers/review.dependencyhandler");
const router = (0, express_1.Router)();
router.post("/courses/:courseId", (0, authRole_1.default)(["user"]), review_dependencyhandler_1.reviewController.submitReview.bind(review_dependencyhandler_1.reviewController));
router.get("/courses/:courseId", (0, authRole_1.default)(["user"]), review_dependencyhandler_1.reviewController.getCourseReviews.bind(review_dependencyhandler_1.reviewController));
exports.default = router;
