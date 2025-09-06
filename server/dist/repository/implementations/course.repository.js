"use strict";
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
    async createCourse(courseData) {
        const course = await this.model.create(courseData);
        return course;
    }
    async findAllCourse(page, limit, search) {
        const skip = (page - 1) * limit;
        const searchQuery = search
            ? { title: { $regex: search, $options: "i" } }
            : {};
        console.log(searchQuery);
        const [course, total] = await Promise.all([
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
    }
    async findCourses(page, limit, search, category, minPrice, maxPrice) {
        const skip = (page - 1) * limit;
        const query = {};
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
        const [courses, total] = await Promise.all([
            this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .populate("instructor", "name email"),
            this.model.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { courses, total, totalPages };
    }
    async findCourseById(courseId) {
        const course = await this.model
            .findById(courseId)
            .populate("instructor", "name");
        return course;
    }
    async findCoursesByInstructor(instructorId, page, limit, search) {
        const skip = (page - 1) * limit;
        const query = { instructor: instructorId };
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        const [courses, total] = await Promise.all([
            this.model.find(query).skip(skip).limit(limit),
            this.model.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { courses, total, totalPages };
    }
    async addEnrolledUser(courseId, userId) {
        return await courseModel_1.default.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: userId },
        });
    }
    async updateCourseStatus(courseId, isActive) {
        return await this.model.findByIdAndUpdate(courseId, { isActive }, { new: true });
    }
    async updateCourseById(courseId, updateData) {
        return await courseModel_1.default.findByIdAndUpdate(courseId, updateData, {
            new: true,
        });
    }
    async getCourseStats() {
        const courses = await courseModel_1.default.find().select("title enrolledStudents");
        return courses.map((course) => ({
            title: course.title,
            enrolledCount: course.enrolledStudents?.length || 0,
        }));
    }
    async getCourseStatsOfInstructor(instructorId) {
        const courses = await courseModel_1.default.find({ instructor: instructorId }).select("title enrolledStudents");
        return courses.map((course) => ({
            title: course.title,
            enrolledCount: course.enrolledStudents?.length || 0,
        }));
    }
    async findByPurchasedUser(userId) {
        const courses = await courseModel_1.default.find({ enrolledStudents: userId }).select("instructor");
        const instructorIds = [
            ...new Set(courses.map((c) => c.instructor.toString())),
        ];
        return instructorIds;
    }
    async getUsersByInstructor(instructorId) {
        const courses = await courseModel_1.default.find({ instructor: instructorId }).select("enrolledStudents");
        const userIds = new Set();
        courses.forEach((course) => {
            course.enrolledStudents.forEach((userId) => {
                userIds.add(userId.toString());
            });
        });
        return Array.from(userIds);
    }
}
exports.CourseRepository = CourseRepository;
