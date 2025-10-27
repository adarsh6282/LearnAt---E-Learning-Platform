"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const course_dependencyhandler_1 = require("../dependencyHandlers/course.dependencyhandler");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post("/", (0, authRole_1.default)(["instructor"]), upload.fields([
    { name: "lessonFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
]), course_dependencyhandler_1.courseController.createCourse.bind(course_dependencyhandler_1.courseController));
router.put("/editcourse/:courseId", (0, authRole_1.default)(["instructor"]), upload.fields([
    { name: "lectureFiles", maxCount: 50 },
    { name: "thumbnail", maxCount: 1 },
]), course_dependencyhandler_1.courseController.updateCourse.bind(course_dependencyhandler_1.courseController));
exports.default = router;
