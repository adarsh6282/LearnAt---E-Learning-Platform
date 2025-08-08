import { Request, Response } from "express";

export interface ICourseController {
    createCourse(req: Request, res: Response): Promise<void>;
    updateCourse(req: Request, res: Response): Promise<void>;
}