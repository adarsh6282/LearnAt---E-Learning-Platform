import { ReviewController } from "../controllers/implementations/review.controller";
import { ReviewRepository } from "../repository/implementations/review.repository";
import { ReviewService } from "../services/implementation/review.service";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
export const reviewController = new ReviewController(reviewService);