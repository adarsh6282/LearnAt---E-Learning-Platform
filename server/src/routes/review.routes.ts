import { Router } from "express";
import { ReviewController } from "../controllers/implementations/review.controller";
import { ReviewService } from "../services/implementation/review.service";
import { ReviewRepository } from "../repository/implementations/review.repository";
import authRole from "../middlewares/authRole";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

const router = Router();

router.post(
  "/courses/:courseId",
  authRole(["user"]),
  reviewController.submitReview.bind(reviewController)
);
router.get(
  "/courses/:courseId",
  authRole(["user"]),
  reviewController.getCourseReviews.bind(reviewController)
);

export default router;
