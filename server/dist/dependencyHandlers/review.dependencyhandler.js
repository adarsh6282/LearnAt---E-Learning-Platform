"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_controller_1 = require("../controllers/implementations/review.controller");
const review_repository_1 = require("../repository/implementations/review.repository");
const review_service_1 = require("../services/implementation/review.service");
const reviewRepository = new review_repository_1.ReviewRepository();
const reviewService = new review_service_1.ReviewService(reviewRepository);
exports.reviewController = new review_controller_1.ReviewController(reviewService);
