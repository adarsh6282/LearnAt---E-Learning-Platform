"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class CourseController {
    constructor(_courseService) {
        this._courseService = _courseService;
    }
    async createCourse(req, res) {
        try {
            const instructorId = req.instructor?.id;
            const thumbnailFile = req.files?.thumbnail?.[0];
            const lessonFiles = req.files?.lessonFiles || [];
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.BAD_REQUEST)
                    .json({ message: "Missing instructor" });
                return;
            }
            if (!thumbnailFile) {
                res
                    .status(statusCodes_1.httpStatus.BAD_REQUEST)
                    .json({ message: "Thumbnail is required" });
                return;
            }
            const modules = JSON.parse(req.body.modules);
            const lessonMeta = Array.isArray(req.body.lessonMeta)
                ? req.body.lessonMeta.map((m) => JSON.parse(m))
                : [JSON.parse(req.body.lessonMeta)];
            const courseData = {
                ...req.body,
                instructorId,
                modules,
                lessonFiles,
                lessonMeta,
                thumbnail: thumbnailFile,
            };
            const course = await this._courseService.createCourse(courseData);
            res.status(statusCodes_1.httpStatus.CREATED).json(course);
        }
        catch (err) {
            console.error("Error creating course:", err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async updateCourse(req, res) {
        try {
            const { courseId } = req.params;
            let modulesRaw = [];
            if (req.body.modules) {
                modulesRaw =
                    typeof req.body.modules === "string"
                        ? JSON.parse(req.body.modules)
                        : req.body.modules;
            }
            const lectureMeta = req.body.lectureMeta
                ? Array.isArray(req.body.lectureMeta)
                    ? req.body.lectureMeta.map((m) => JSON.parse(m))
                    : [JSON.parse(req.body.lectureMeta)]
                : [];
            const lectureFiles = req.files?.lectureFiles || [];
            const thumbnailFile = req.files?.thumbnail?.[0];
            const lectureFilesWithMeta = lectureFiles.map((file, i) => ({
                file,
                meta: lectureMeta[i],
            }));
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                isActive: req.body.isActive,
                modules: modulesRaw.map((mod) => ({
                    _id: mod._id,
                    title: mod.title,
                    description: mod.description,
                    chapters: (mod.chapters || []).map((ch) => ({
                        _id: ch._id,
                        title: ch.title,
                        description: ch.description,
                        existingLectures: (ch.lectures || []).filter((lec) => lec._id),
                        newLectures: (ch.lectures || []).filter((lec) => !lec._id),
                    })),
                })),
                lectureFiles: lectureFilesWithMeta,
                thumbnail: thumbnailFile,
            };
            const updatedCourse = await this._courseService.updateCourse(courseId, updateData);
            res.status(statusCodes_1.httpStatus.OK).json(updatedCourse);
        }
        catch (err) {
            console.error(err);
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({
                message: err instanceof Error ? err.message : "Something went wrong",
            });
        }
    }
}
exports.CourseController = CourseController;
exports.default = CourseController;
