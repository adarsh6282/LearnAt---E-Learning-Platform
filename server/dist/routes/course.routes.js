"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/implementations/course.controller");
const course_repository_1 = require("../repository/implementations/course.repository");
const course_services_1 = require("../services/implementation/course.services");
const multer_1 = __importDefault(require("multer"));
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const courseRepository = new course_repository_1.CourseRepository();
const courseService = new course_services_1.CourseService(courseRepository);
const courseController = new course_controller_1.CourseController(courseService);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post("/", (0, authRole_1.default)(["instructor"]), upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
]), courseController.createCourse.bind(courseController));
router.put("/editcourse/:courseId", (0, authRole_1.default)(["instructor"]), upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
]), courseController.updateCourse.bind(courseController));
exports.default = router;
