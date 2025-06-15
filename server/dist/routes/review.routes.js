"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const review_controller_1 = require("../controllers/implementations/review.controller");
const review_service_1 = require("../services/implementation/review.service");
const review_repository_1 = require("../repository/implementations/review.repository");
const reviewRepository = new review_repository_1.ReviewRepository();
const reviewService = new review_service_1.ReviewService(reviewRepository);
const reviewController = new review_controller_1.ReviewController(reviewService);
const router = (0, express_1.Router)();
router.post("/courses/:courseId", authUser_1.default, reviewController.submitReview.bind(reviewController));
router.get("/courses/:courseId", authUser_1.default, reviewController.getCourseReviews.bind(reviewController));
exports.default = router;
