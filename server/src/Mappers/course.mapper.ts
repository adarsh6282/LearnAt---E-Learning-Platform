import { CourseDTO } from "../DTO/course.dto";
import { ICourse } from "../models/interfaces/course.interface";

export const toCourseDTO = (course: ICourse): CourseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  description: course.description,
  category: course.category,
  price: course.price,
  isActive: course.isActive,
  thumbnail: course.thumbnail ?? "",
  instructor: course.instructor,
  
  modules: course.modules.map((module) => ({
    _id:module._id?.toString()||"",
    title: module.title,
    description: module.description,
    chapters: module.chapters.map((chapter) => ({
      _id:chapter._id?.toString()||"",
      title: chapter.title,
      description: chapter.description,
      lessons: chapter.lectures.map((lecture) => ({
        _id: lecture._id!.toString(),
        title: lecture.title,
        description: lecture.description,
        url: lecture.url ?? "",
        duration: lecture.duration,
        type: lecture.type,
      })),
    })),
  })),
});

export const toCourseDTOList=(courses:ICourse[]):CourseDTO[]=>{
    return courses.map(toCourseDTO)
}
