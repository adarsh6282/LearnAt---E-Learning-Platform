import { ICourse } from "../../models/interfaces/course.interface";
import { Types } from "mongoose";

export interface ICourseRepository {
    createCourse(courseData: Partial<ICourse>): Promise<ICourse>;
    findAll():Promise<ICourse[]>
    findCourseById(courseId:string):Promise<ICourse|null>,
    findCoursesByInstructor(instructorId:string):Promise<ICourse[]>,
    updateCourseStatus(courseId:string,isActive:boolean):Promise<ICourse|null>,
    updateCourseById(courseId:string,courseData:Partial<ICourse>):Promise<ICourse|null>
} 