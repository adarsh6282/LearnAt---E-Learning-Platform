import { Router } from "express";
import authRole from "../middlewares/authRole";
import { reviewController } from "../dependencyHandlers/review.dependencyhandler";

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
