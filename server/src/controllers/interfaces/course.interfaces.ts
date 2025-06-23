import { Request, Response } from "express";

export interface ICourseController {
    createCourse(req: Request, res: Response): Promise<void>;
    // getCourseById(req: Request, res: Response): Promise<void>;
    // getInstructorCourses(req: Request, res: Response): Promise<void>;
    updateCourse(req: Request, res: Response): Promise<void>;
    // deleteCourse(req: Request, res: Response): Promise<void>;
    // getAllCourses(req: Request, res: Response): Promise<void>;
}