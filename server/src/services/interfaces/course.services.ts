import { CourseDTO } from "../../DTO/course.dto";
import { UpdateCourseInput } from "../../models/interfaces/course.interface";

export interface CreateCourseInput {
    title: string;
    description: string;
    category: string;
    price: number;
    isActive?: boolean;
    instructorId: string;
    lectures: {
        title: string;
        description: string;
        duration: string;
        order: number;
    }[];
    videos: Express.Multer.File[];
    thumbnail?:Express.Multer.File;
}

export interface ICourseService {
    createCourse(courseData: CreateCourseInput): Promise<CourseDTO>;
    updateCourse(courseId:string,courseData:UpdateCourseInput):Promise<CourseDTO>
} 