import { Request, Response } from "express";

export interface ICourseController {
  createCourse(
    req: Request & {
      files?: {
        videos?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
      };
      instructor?: { id: string };
    },
    res: Response
  ): Promise<void>;
  updateCourse(
    req: Request & {
      files?: {
        videos?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
      };
      instructor?: { id: string };
    },
    res: Response
  ): Promise<void>;
}
