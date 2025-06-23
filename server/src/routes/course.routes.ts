import { Router } from "express";
import { CourseController } from "../controllers/implementations/course.controller";
import { CourseRepository } from "../repository/implementations/course.repository";
import { CourseService } from "../services/implementation/course.services";
import multer from "multer";
import authRole from "../middlewares/authRole";

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  authRole(["instructor"]),
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.createCourse.bind(courseController)
);
router.put(
  "/editcourse/:courseId",
  authRole(["instructor"]),
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.updateCourse.bind(courseController)
);

export default router;
