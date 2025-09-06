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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
    const { courseId } = req.params;
    const instructorId = req.instructor?.id;

    const videoFiles = (req.files as any)?.videos || [];
    const thumbnailFile = (req.files as any)?.thumbnail?.[0];

    const existingLectures = JSON.parse(req.body.existingLectures || "[]");
    const newLectures = JSON.parse(req.body.newLectures || "[]");

    const updateData = {
      ...req.body,
      instructorId,
      existingLectures,
      newLectures,
      videos: videoFiles,
      thumbnail: thumbnailFile,
    };

    const updatedCourse = await this._courseService.updateCourse(courseId, updateData);

    res.status(httpStatus.OK).json(updatedCourse);
  } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}

export default CourseController;
