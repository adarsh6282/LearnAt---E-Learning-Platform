"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
const base_repository_1 = require("../base.repository");
class CourseRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(courseModel_1.default);
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.model.create(courseData);
            return course;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this.model.find({}).populate("instructor", "name email");
            return courses;
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.model.findById(courseId).populate("instructor", "name");
            return course;
        });
    }
    findCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ instructor: instructorId }).sort({ createdAt: -1 });
        });
    }
    updateCourseStatus(courseId, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(courseId, { isActive }, { new: true });
        });
    }
}
exports.CourseRepository = CourseRepository;
