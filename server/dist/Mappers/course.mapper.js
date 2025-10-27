"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCourseDTOList = exports.toCourseDTO = void 0;
const toCourseDTO = (course) => ({
    _id: course._id.toString(),
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    isActive: course.isActive,
    thumbnail: course.thumbnail ?? "",
    instructor: course.instructor,
    modules: course.modules.map((module) => ({
        _id: module._id?.toString() || "",
        title: module.title,
        description: module.description,
        chapters: module.chapters.map((chapter) => ({
            _id: chapter._id?.toString() || "",
            title: chapter.title,
            description: chapter.description,
            lessons: chapter.lectures.map((lecture) => ({
                _id: lecture._id.toString(),
                title: lecture.title,
                description: lecture.description,
                url: lecture.url ?? "",
                duration: lecture.duration,
                type: lecture.type,
            })),
        })),
    })),
});
exports.toCourseDTO = toCourseDTO;
const toCourseDTOList = (courses) => {
    return courses.map(exports.toCourseDTO);
};
exports.toCourseDTOList = toCourseDTOList;
