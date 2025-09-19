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
            const videoFiles = req.files?.videos || [];
            const thumbnailFile = req.files?.thumbnail?.[0];
            if (!videoFiles.length || !thumbnailFile) {
                res
                    .status(statusCodes_1.httpStatus.BAD_REQUEST)
                    .json({ message: "Missing required files" });
                return;
            }
            const instructorId = req.instructor?.id;
            const courseData = {
                ...req.body,
                instructorId,
                lectures: JSON.parse(req.body.lectures),
                videos: videoFiles,
                thumbnail: thumbnailFile,
            };
            const course = await this._courseService.createCourse(courseData);
            res.status(statusCodes_1.httpStatus.CREATED).json(course);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async updateCourse(req, res) {
        try {
            const { courseId } = req.params;
            const instructorId = req.instructor?.id;
            const videoFiles = (req.files)?.videos || [];
            const thumbnailFile = (req.files)?.thumbnail?.[0];
            const existingLectures = JSON.parse(req.body.existingLectures || "[]");
            const newLectures = JSON.parse(req.body.newLectures || "[]");
            const updateData = {
                ...req.body,
                instructorId,
                existingLectures,
                newLectures,
                videos: videoFiles,
                thumbnail: thumbnailFile,
            };
            const updatedCourse = await this._courseService.updateCourse(courseId, updateData);
            res.status(statusCodes_1.httpStatus.OK).json(updatedCourse);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
}
exports.CourseController = CourseController;
exports.default = CourseController;
