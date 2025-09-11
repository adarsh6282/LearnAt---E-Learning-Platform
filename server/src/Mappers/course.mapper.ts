import { CourseDTO } from "../DTO/course.dto";
import { ICourse } from "../models/interfaces/course.interface";

export const toCourseDTO = (course: ICourse): CourseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  description: course.description,
  category: course.category,
  price: course.price,
  isActive: course.isActive,
  lectures: course.lectures.map((lecture) => ({
    _id:lecture._id!.toString(),
    title: lecture.title,
    description: lecture.description,
    videoUrl: lecture.videoUrl,
    duration: lecture.duration,
  })),
  instructor: course.instructor,
  thumbnail: course.thumbnail,
});

export const toCourseDTOList=(courses:ICourse[]):CourseDTO[]=>{
    return courses.map(toCourseDTO)
}
