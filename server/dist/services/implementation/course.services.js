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
exports.CourseService = void 0;
const mongoose_1 = require("mongoose");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const streamifier_1 = __importDefault(require("streamifier"));
class CourseService {
    constructor(_courseRepository) {
        this._courseRepository = _courseRepository;
    }
    uploadToCloudinary(file, type) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let thumbnailUrl = undefined;
                if (courseData.thumbnail) {
                    thumbnailUrl = yield this.uploadToCloudinary(courseData.thumbnail, "image");
                }
                const videoUploadPromises = courseData.videos.map((file) => this.uploadToCloudinary(file, "video"));
                const videoUrls = yield Promise.all(videoUploadPromises);
                const lectures = courseData.lectures.map((lecture, index) => ({
                    title: lecture.title,
                    description: lecture.description,
                    videoUrl: videoUrls[index],
                    duration: lecture.duration,
                    order: lecture.order,
                }));
                const course = yield this._courseRepository.createCourse({
                    title: courseData.title,
                    description: courseData.description,
                    category: courseData.category,
                    price: courseData.price,
                    instructor: new mongoose_1.Types.ObjectId(courseData.instructorId),
                    isActive: (_a = courseData.isActive) !== null && _a !== void 0 ? _a : true,
                    thumbnail: thumbnailUrl,
                    lectures,
                });
                return course;
            }
            catch (error) {
                console.error("Course creation error:", error);
                throw error;
            }
        });
    }
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let thumbnailUrl;
                if (courseData.thumbnail) {
                    thumbnailUrl = yield this.uploadToCloudinary(courseData.thumbnail, "image");
                }
                let newVideoUrls = [];
                if (courseData.videos && courseData.videos.length > 0) {
                    const uploadPromises = courseData.videos.map((file) => this.uploadToCloudinary(file, "video"));
                    newVideoUrls = yield Promise.all(uploadPromises);
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
                    isActive: (_a = courseData.isActive) !== null && _a !== void 0 ? _a : true,
                    lectures: allLectures,
                };
                if (thumbnailUrl) {
                    updatedData.thumbnail = thumbnailUrl;
                }
                const updatedCourse = yield this._courseRepository.updateCourseById(courseId, updatedData);
                if (!updatedCourse) {
                    throw new Error("Course not found");
                }
                return updatedCourse;
            }
            catch (error) {
                console.error("Error updating course:", error);
                throw error;
            }
        });
    }
}
exports.CourseService = CourseService;
