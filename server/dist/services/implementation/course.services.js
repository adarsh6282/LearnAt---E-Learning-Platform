"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const mongoose_1 = require("mongoose");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const streamifier_1 = __importDefault(require("streamifier"));
const course_mapper_1 = require("../../Mappers/course.mapper");
class CourseService {
    constructor(_courseRepository) {
        this._courseRepository = _courseRepository;
    }
    async uploadToCloudinary(file, type) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_config_1.default.uploader.upload_stream({
                resource_type: type,
                folder: type === "image" ? "courses/thumbnails" : "courses/lectures",
                public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
            }, (error, result) => {
                if (error) {
                    console.error(`Cloudinary ${type} upload error:`, error);
                    return reject(new Error(`Failed to upload ${type} to Cloudinary`));
                }
                resolve(result.secure_url);
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    async createCourse(courseData) {
        try {
            let thumbnailUrl = undefined;
            if (courseData.thumbnail) {
                thumbnailUrl = await this.uploadToCloudinary(courseData.thumbnail, "image");
            }
            const videoUploadPromises = courseData.videos.map((file) => this.uploadToCloudinary(file, "video"));
            const videoUrls = await Promise.all(videoUploadPromises);
            const lectures = courseData.lectures.map((lecture, index) => ({
                title: lecture.title,
                description: lecture.description,
                videoUrl: videoUrls[index],
                duration: lecture.duration,
                order: lecture.order,
            }));
            const course = await this._courseRepository.createCourse({
                title: courseData.title,
                description: courseData.description,
                category: courseData.category,
                price: courseData.price,
                instructor: new mongoose_1.Types.ObjectId(courseData.instructorId),
                isActive: courseData.isActive ?? true,
                thumbnail: thumbnailUrl,
                lectures,
            });
            if (!course) {
                throw new Error("failed to create new course");
            }
            return (0, course_mapper_1.toCourseDTO)(course);
        }
        catch (error) {
            console.error("Course creation error:", error);
            throw error;
        }
    }
    async updateCourse(courseId, courseData) {
        try {
            let thumbnailUrl;
            if (courseData.thumbnail) {
                thumbnailUrl = await this.uploadToCloudinary(courseData.thumbnail, "image");
            }
            let newVideoUrls = [];
            if (courseData.videos && courseData.videos.length > 0) {
                const uploadPromises = courseData.videos.map((file) => this.uploadToCloudinary(file, "video"));
                newVideoUrls = await Promise.all(uploadPromises);
            }
            const newLectures = courseData.newLectures.map((lecture, index) => ({
                title: lecture.title,
                description: lecture.description,
                videoUrl: newVideoUrls[index],
                duration: lecture.duration,
                order: lecture.order,
            }));
            const allLectures = [...courseData.existingLectures, ...newLectures];
            const updatedData = {
                title: courseData.title,
                description: courseData.description,
                category: courseData.category,
                price: courseData.price,
                isActive: courseData.isActive ?? true,
                lectures: allLectures,
            };
            if (thumbnailUrl) {
                updatedData.thumbnail = thumbnailUrl;
            }
            const updatedCourse = await this._courseRepository.updateCourseById(courseId, updatedData);
            if (!updatedCourse) {
                throw new Error("Course not found");
            }
            return (0, course_mapper_1.toCourseDTO)(updatedCourse);
        }
        catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    }
}
exports.CourseService = CourseService;
