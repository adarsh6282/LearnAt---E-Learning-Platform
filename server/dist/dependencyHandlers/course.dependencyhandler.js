"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const course_controller_1 = __importDefault(require("../controllers/implementations/course.controller"));
const course_repository_1 = require("../repository/implementations/course.repository");
const course_services_1 = require("../services/implementation/course.services");
const courseRepository = new course_repository_1.CourseRepository();
const courseService = new course_services_1.CourseService(courseRepository);
exports.courseController = new course_controller_1.default(courseService);
