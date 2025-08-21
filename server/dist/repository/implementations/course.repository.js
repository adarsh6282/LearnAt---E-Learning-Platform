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
    findAllCourse(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const searchQuery = search
                ? { title: { $regex: search, $options: "i" } }
                : {};
            console.log(searchQuery);
            const [course, total] = yield Promise.all([
                this.model
                    .find(searchQuery)
                    .skip(skip)
                    .limit(limit)
                    .populate("instructor", "name email")
                    .populate({
                    path: "category",
                    match: { isDeleted: false },
                    select: "name",
                }),
                this.model.countDocuments(searchQuery),
            ]);
            const totalPage = Math.ceil(total / limit);
            return { course, total, totalPage };
        });
    }
    findCourses(page, limit, search, category, minPrice, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            let query = {};
            if (search) {
                query.title = { $regex: search, $options: "i" };
            }
            if (category) {
                query.category = category;
            }
            if (minPrice !== undefined && maxPrice !== undefined) {
                query.price = { $gte: minPrice, $lte: maxPrice };
            }
            else if (minPrice !== undefined) {
                query.price = { $gte: minPrice };
            }
            else if (maxPrice !== undefined) {
                query.price = { $lte: maxPrice };
            }
            const [courses, total] = yield Promise.all([
                this.model
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate("instructor", "name email"),
                this.model.countDocuments(query),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { courses, total, totalPages };
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.model
                .findById(courseId)
                .populate("instructor", "name");
            return course;
        });
    }
    findCoursesByInstructor(instructorId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            let query = { instructor: instructorId };
            if (search) {
                query.title = { $regex: search, $options: "i" };
            }
            const [courses, total] = yield Promise.all([
                this.model.find(query).skip(skip).limit(limit),
                this.model.countDocuments(query),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { courses, total, totalPages };
        });
    }
    addEnrolledUser(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield courseModel_1.default.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId },
            });
        });
    }
    updateCourseStatus(courseId, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(courseId, { isActive }, { new: true });
        });
    }
    updateCourseById(courseId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield courseModel_1.default.findByIdAndUpdate(courseId, updateData, {
                new: true,
            });
        });
    }
    getCourseStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.default.find().select("title enrolledStudents");
            return courses.map((course) => {
                var _a;
                return ({
                    title: course.title,
                    enrolledCount: ((_a = course.enrolledStudents) === null || _a === void 0 ? void 0 : _a.length) || 0,
                });
            });
        });
    }
    getCourseStatsOfInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.default.find({ instructor: instructorId }).select("title enrolledStudents");
            return courses.map((course) => {
                var _a;
                return ({
                    title: course.title,
                    enrolledCount: ((_a = course.enrolledStudents) === null || _a === void 0 ? void 0 : _a.length) || 0,
                });
            });
        });
    }
    findByPurchasedUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.default.find({ enrolledStudents: userId }).select("instructor");
            const instructorIds = [
                ...new Set(courses.map((c) => c.instructor.toString())),
            ];
            return instructorIds;
        });
    }
    getUsersByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.default.find({ instructor: instructorId }).select("enrolledStudents");
            const userIds = new Set();
            courses.forEach((course) => {
                course.enrolledStudents.forEach((userId) => {
                    userIds.add(userId.toString());
                });
            });
            return Array.from(userIds);
        });
    }
}
exports.CourseRepository = CourseRepository;
