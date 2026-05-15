import { Router } from "express";
import authRole from "../middlewares/authRole";
import { reviewController } from "../dependencyHandlers/review.dependencyhandler";
import { REVIEW_ROUTES } from "../constants/routes";

const router = Router();

router.post(
  REVIEW_ROUTES.COURSE_REVIEWS,
  authRole(["user"]),
  reviewController.submitReview.bind(reviewController)
);
router.get(
  REVIEW_ROUTES.COURSE_REVIEWS,
  reviewController.getCourseReviews.bind(reviewController)
);

export default router;
