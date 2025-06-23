"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/implementations/review.controller");
const review_service_1 = require("../services/implementation/review.service");
const review_repository_1 = require("../repository/implementations/review.repository");
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const reviewRepository = new review_repository_1.ReviewRepository();
const reviewService = new review_service_1.ReviewService(reviewRepository);
const reviewController = new review_controller_1.ReviewController(reviewService);
const router = (0, express_1.Router)();
router.post("/courses/:courseId", (0, authRole_1.default)(["user"]), reviewController.submitReview.bind(reviewController));
router.get("/courses/:courseId", (0, authRole_1.default)(["user"]), reviewController.getCourseReviews.bind(reviewController));
exports.default = router;
