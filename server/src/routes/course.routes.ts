import { Router } from "express";
import multer from "multer";
import authRole from "../middlewares/authRole";
import { courseController } from "../dependencyHandlers/course.dependencyhandler";
import { COURSE_ROUTES } from "../constants/routes";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post(
  COURSE_ROUTES.CREATE,
  authRole(["instructor"]),
  upload.fields([
    { name: "lessonFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.createCourse.bind(courseController)
);
router.put(
  COURSE_ROUTES.UPDATE,
  authRole(["instructor"]),
  upload.fields([
    { name: "lectureFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  courseController.updateCourse.bind(courseController)
);

export default router;
