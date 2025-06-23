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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class CourseController {
    constructor(_courseService) {
        this._courseService = _courseService;
    }
    createCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const videoFiles = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.videos) || [];
                const thumbnailFile = (_c = (_b = req.files) === null || _b === void 0 ? void 0 : _b.thumbnail) === null || _c === void 0 ? void 0 : _c[0];
                if (!videoFiles.length || !thumbnailFile) {
                    res
                        .status(statusCodes_1.httpStatus.BAD_REQUEST)
                        .json({ message: "Missing required files" });
                    return;
                }
                const instructorId = (_d = req.instructor) === null || _d === void 0 ? void 0 : _d.id;
                const courseData = Object.assign(Object.assign({}, req.body), { instructorId, lectures: JSON.parse(req.body.lectures), videos: videoFiles, thumbnail: thumbnailFile });
                const course = yield this._courseService.createCourse(courseData);
                res.status(statusCodes_1.httpStatus.CREATED).json(course);
            }
            catch (error) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: error.message || "Failed to create course",
                });
            }
        });
    }
    updateCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { courseId } = req.params;
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                const videoFiles = ((_b = req.files) === null || _b === void 0 ? void 0 : _b.videos) || [];
                const thumbnailFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.thumbnail) === null || _d === void 0 ? void 0 : _d[0];
                const existingLectures = JSON.parse(req.body.existingLectures || "[]");
                const newLectures = JSON.parse(req.body.newLectures || "[]");
                const updateData = Object.assign(Object.assign({}, req.body), { instructorId,
                    existingLectures,
                    newLectures, videos: videoFiles, thumbnail: thumbnailFile });
                const updatedCourse = yield this._courseService.updateCourse(courseId, updateData);
                res.status(statusCodes_1.httpStatus.OK).json(updatedCourse);
            }
            catch (error) {
                console.error("Course update error:", error);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: error.message || "Failed to update course",
                });
            }
        });
    }
}
exports.CourseController = CourseController;
exports.default = CourseController;
