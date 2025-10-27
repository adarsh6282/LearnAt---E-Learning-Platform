import { CourseDTO } from "../../DTO/course.dto";
import { UpdateCourseInput } from "../../models/interfaces/course.interface";

export interface CreateCourseInput {
  title: string;
  description: string;
  category: string;
  price: number;
  isActive?: boolean;
  instructorId: string;
  lessonFiles?: Express.Multer.File[];
  thumbnail?: Express.Multer.File;
  lessonMeta: {
    moduleIndex: number;
    chapterIndex: number;
    lessonIndex: number;
    type: "video" | "pdf";
  }[];

  modules: {
    title: string;
    description?: string;
    chapters: {
      title: string;
      description?: string;
      lessons: {
        title: string;
        description?: string;
        duration?: string;
        order?: number;
        type: "video" | "pdf";
        url?: string;
      }[];
    }[];
  }[];
}


export interface ICourseService {
  createCourse(courseData: CreateCourseInput): Promise<CourseDTO>;
  updateCourse(
    courseId: string,
    courseData: UpdateCourseInput
  ): Promise<CourseDTO>;
}
