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
    lectures: course.lectures.map((lecture) => ({
        _id: lecture._id.toString(),
        title: lecture.title,
        description: lecture.description,
        videoUrl: lecture.videoUrl,
        duration: lecture.duration,
    })),
    instructor: course.instructor,
    thumbnail: course.thumbnail,
});
exports.toCourseDTO = toCourseDTO;
const toCourseDTOList = (courses) => {
    return courses.map(exports.toCourseDTO);
};
exports.toCourseDTOList = toCourseDTOList;
