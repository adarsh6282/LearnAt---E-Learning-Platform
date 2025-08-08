import { ICourse } from "../../models/interfaces/course.interface";
import { Types } from "mongoose";

export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse>;
  findAllCourse(page:number,limit:number,search:string): Promise<{course:ICourse[],total:number,totalPage:number}>;
  findCourses():Promise<ICourse[]|null>
  findCourseById(courseId: string): Promise<ICourse | null>;
  findCoursesByInstructor(
    instructorId: string,
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number; totalPages: number }>;
  updateCourseStatus(
    courseId: string,
    isActive: boolean
  ): Promise<ICourse | null>;
  updateCourseById(
    courseId: string,
    courseData: Partial<ICourse>
  ): Promise<ICourse | null>;
  addEnrolledUser(courseId: string, userId: string): Promise<ICourse | null>;
  getCourseStats(): Promise<{ title: string; enrolledCount: number }[]>;
  findByPurchasedUser(userId:string):Promise<string[]>
  getUsersByInstructor(instructorId:string):Promise<string[]>
  getCourseStatsOfInstructor(instructorId:string):Promise<{title:string,enrolledCount:number}[]>
}
