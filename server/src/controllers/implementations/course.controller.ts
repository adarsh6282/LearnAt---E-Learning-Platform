import { Request, Response } from "express";
import { ICourseService } from "../../services/interfaces/course.services";
import { httpStatus } from "../../constants/statusCodes";
import { ICourseController } from "../../controllers/interfaces/course.interfaces";

export class CourseController implements ICourseController {
  constructor(private _courseService: ICourseService) {}

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const videoFiles = (req.files as any)?.videos || [];
      const thumbnailFile = (req.files as any)?.thumbnail?.[0];

      if (!videoFiles.length || !thumbnailFile) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Missing required files" });
        return;
      }

      const instructorId=req.instructor?.id

      const courseData = {
        ...req.body,
        instructorId,
        lectures: JSON.parse(req.body.lectures),
        videos: videoFiles,
        thumbnail: thumbnailFile,
      };

      const course = await this._courseService.createCourse(courseData);
      res.status(httpStatus.CREATED).json(course);
    } catch (error: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to create course",
      });
    }
  }
}

export default CourseController;
