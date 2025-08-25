import CourseController from "../controllers/implementations/course.controller";
import { CourseRepository } from "../repository/implementations/course.repository";
import { CourseService } from "../services/implementation/course.services";

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
export const courseController = new CourseController(courseService);