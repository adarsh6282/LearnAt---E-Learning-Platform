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
                resource_type: type === "image" ? "image" : type === "video" ? "video" : "raw",
                folder: type === "image"
                    ? "courses/thumbnails"
                    : type == "video"
                        ? "courses/lectures/videos"
                        : "courses/lectures/pdf",
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
            const lessonUrls = await Promise.all((courseData.lessonFiles || []).map((file, i) => {
                const meta = courseData.lessonMeta[i];
                if (!meta)
                    throw new Error(`Missing metadata for lesson file ${i}`);
                return this.uploadToCloudinary(file, meta.type === "video" ? "video" : "pdf");
            }));
            const modules = courseData.modules.map((mod, modIdx) => ({
                title: mod.title,
                description: mod.description ?? "",
                chapters: mod.chapters.map((chap, chapIdx) => ({
                    title: chap.title,
                    description: chap.description ?? "",
                    lectures: chap.lessons.map((les, lesIdx) => {
                        const metaIndex = courseData.lessonMeta.findIndex((m) => m.moduleIndex === modIdx &&
                            m.chapterIndex === chapIdx &&
                            m.lessonIndex === lesIdx);
                        const fileUrl = metaIndex !== -1 ? lessonUrls[metaIndex] : undefined;
                        if (!fileUrl)
                            throw new Error(`URL missing for lesson ${les.title}`);
                        return {
                            title: les.title,
                            description: les.description ?? "",
                            duration: les.duration ?? "",
                            order: les.order ?? 0,
                            type: les.type,
                            url: fileUrl,
                        };
                    }),
                })),
            }));
            const course = await this._courseRepository.createCourse({
                title: courseData.title,
                description: courseData.description,
                category: courseData.category,
                price: courseData.price,
                instructor: new mongoose_1.Types.ObjectId(courseData.instructorId),
                thumbnail: thumbnailUrl,
                modules,
                isActive: true,
            });
            return (0, course_mapper_1.toCourseDTO)(course);
        }
        catch (error) {
            console.error("Course creation failed:", error);
            throw error;
        }
    }
    async updateCourse(courseId, courseData) {
        let thumbnailUrl;
        if (courseData.thumbnail) {
            thumbnailUrl = await this.uploadToCloudinary(courseData.thumbnail, "image");
        }
        const existingCourse = await this._courseRepository.findCourseById(courseId);
        if (!existingCourse)
            throw new Error("Course not found");
        const updatedModules = await Promise.all((courseData.modules || []).map(async (mod, modIndex) => {
            const existingModule = mod._id
                ? existingCourse.modules.find((m) => m._id.toString() === mod._id)
                : null;
            if (!existingModule) {
                const newChapters = await Promise.all((mod.chapters || []).map(async (ch, chIndex) => {
                    const newLectures = await Promise.all((ch.newLectures || []).map(async (lec, lecIndex) => {
                        const fileMeta = courseData.lectureFiles?.find((lf) => lf.meta.moduleIndex === modIndex &&
                            lf.meta.chapterIndex === chIndex &&
                            lf.meta.lectureIndex === lecIndex);
                        if (fileMeta) {
                            const resourceType = fileMeta.file.mimetype.includes("pdf")
                                ? "pdf"
                                : "video";
                            lec.url = await this.uploadToCloudinary(fileMeta.file, resourceType);
                        }
                        return lec;
                    }));
                    return {
                        title: ch.title,
                        description: ch.description,
                        lectures: newLectures,
                    };
                }));
                return {
                    title: mod.title,
                    description: mod.description,
                    chapters: newChapters,
                };
            }
            const updatedChapters = await Promise.all((mod.chapters || []).map(async (ch, chIndex) => {
                const updatedExistingLectures = await Promise.all((ch.existingLectures || []).map(async (lec) => {
                    const fileMeta = courseData.lectureFiles?.find((lf) => lf.meta.lectureId === lec._id);
                    if (fileMeta) {
                        const resourceType = fileMeta.file.mimetype.includes("pdf")
                            ? "pdf"
                            : "video";
                        lec.url = await this.uploadToCloudinary(fileMeta.file, resourceType);
                    }
                    return lec;
                }));
                const updatedNewLectures = await Promise.all((ch.newLectures || []).map(async (lec, lecIndex) => {
                    const fileMeta = courseData.lectureFiles?.find((lf) => !lf.meta.lectureId &&
                        lf.meta.moduleIndex === modIndex &&
                        lf.meta.chapterIndex === chIndex &&
                        lf.meta.lectureIndex === lecIndex);
                    if (fileMeta) {
                        const resourceType = fileMeta.file.mimetype.includes("pdf")
                            ? "pdf"
                            : "video";
                        lec.url = await this.uploadToCloudinary(fileMeta.file, resourceType);
                    }
                    return lec;
                }));
                return {
                    _id: ch._id,
                    title: ch.title,
                    description: ch.description,
                    lectures: [...updatedExistingLectures, ...updatedNewLectures],
                };
            }));
            return {
                _id: mod._id,
                title: mod.title,
                description: mod.description,
                chapters: updatedChapters,
            };
        }));
        const updatedCourseData = {
            title: courseData.title ?? existingCourse.title,
            description: courseData.description ?? existingCourse.description,
            category: courseData.category ?? existingCourse.category,
            price: courseData.price ?? existingCourse.price,
            isActive: courseData.isActive ?? existingCourse.isActive,
            modules: updatedModules,
            thumbnail: existingCourse.thumbnail
        };
        if (thumbnailUrl)
            updatedCourseData.thumbnail = thumbnailUrl;
        const updatedCourse = await this._courseRepository.updateCourseById(courseId, updatedCourseData);
        if (!updatedCourse)
            throw new Error("Course not found");
        return (0, course_mapper_1.toCourseDTO)(updatedCourse);
    }
}
exports.CourseService = CourseService;
