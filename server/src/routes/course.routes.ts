import { Router } from "express";
import multer from "multer";
import authRole from "../middlewares/authRole";
import { courseController } from "../dependencyHandlers/course.dependencyhandler";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  authRole(["instructor"]),
  upload.fields([
    { name: "lessonFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.createCourse.bind(courseController)
);
router.put(
  "/editcourse/:courseId",
  authRole(["instructor"]),
  upload.fields([
    { name: "lectureFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.updateCourse.bind(courseController)
);

export default router;
