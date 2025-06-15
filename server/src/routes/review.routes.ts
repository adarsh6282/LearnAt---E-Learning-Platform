import { Router } from "express";
import authUser from "../middlewares/authUser";
import { ReviewController } from "../controllers/implementations/review.controller";
import { ReviewService } from "../services/implementation/review.service";
import { ReviewRepository } from "../repository/implementations/review.repository";


const reviewRepository=new ReviewRepository()
const reviewService=new ReviewService(reviewRepository)
const reviewController=new ReviewController(reviewService)

const router=Router()

router.post("/courses/:courseId",authUser,reviewController.submitReview.bind(reviewController))
router.get("/courses/:courseId",authUser,reviewController.getCourseReviews.bind(reviewController))

export default router