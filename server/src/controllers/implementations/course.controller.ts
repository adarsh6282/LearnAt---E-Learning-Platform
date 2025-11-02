import { Request, Response } from "express";
import { ICourseService } from "../../services/interfaces/course.services";
import { httpStatus } from "../../constants/statusCodes";
import { ICourseController } from "../../controllers/interfaces/course.interfaces";
import { LectureFileWithMeta } from "../../services/implementation/course.services";
import {
  IChapter,
  IModule,
  UpdateCourseInput,
} from "../../models/interfaces/course.interface";

export class CourseController implements ICourseController {
  constructor(private _courseService: ICourseService) {}

  async createCourse(
    req: Request & {
      files?: {
        lessonFiles?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
      };
      instructor?: { id: string };
    },
    res: Response
  ): Promise<void> {
    try {
      const instructorId = req.instructor?.id;
      const thumbnailFile = req.files?.thumbnail?.[0];
      const lessonFiles = req.files?.lessonFiles || [];

      if (!instructorId) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Missing instructor" });
        return;
      }

      if (!thumbnailFile) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Thumbnail is required" });
        return;
      }

      const modules = JSON.parse(req.body.modules);

      const lessonMeta = Array.isArray(req.body.lessonMeta)
        ? req.body.lessonMeta.map((m: string) => JSON.parse(m))
        : [JSON.parse(req.body.lessonMeta)];

      const courseData = {
        ...req.body,
        instructorId,
        modules,
        lessonFiles,
        lessonMeta,
        thumbnail: thumbnailFile,
      };

      const course = await this._courseService.createCourse(courseData);
      res.status(httpStatus.CREATED).json(course);
    } catch (err: unknown) {
      console.error("Error creating course:", err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async updateCourse(
    req: Request & {
      files?: {
        lectureFiles?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
      };
      instructor?: { id: string };
    },
    res: Response
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      let modulesRaw: IModule[] = [];
      if (req.body.modules) {
        modulesRaw =
          typeof req.body.modules === "string"
            ? JSON.parse(req.body.modules)
            : req.body.modules;
      }

      const lectureMeta = req.body.lectureMeta
        ? Array.isArray(req.body.lectureMeta)
          ? req.body.lectureMeta.map((m: string) => JSON.parse(m))
          : [JSON.parse(req.body.lectureMeta as string)]
        : [];

      const lectureFiles = req.files?.lectureFiles || [];
      const thumbnailFile = req.files?.thumbnail?.[0];

      const lectureFilesWithMeta: LectureFileWithMeta[] = lectureFiles.map(
        (file, i) => ({
          file,
          meta: lectureMeta[i],
        })
      );

      const updateData: UpdateCourseInput & {
        lectureFiles?: LectureFileWithMeta[];
      } = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        isActive: req.body.isActive,
        modules: modulesRaw.map((mod: IModule) => ({
          _id: mod._id,
          title: mod.title,
          description: mod.description,
          chapters: (mod.chapters || []).map((ch: IChapter) => ({
            _id: ch._id,
            title: ch.title,
            description: ch.description,
            existingLectures: (ch.lectures || []).filter(
              (lec: {
                _id?: string;
                title: string;
                description: string;
                duration: string;
                type: "video" | "pdf";
                url?: string;
              }) => lec._id
            ),
            newLectures: (ch.lectures || []).filter(
              (lec: {
                _id?: string;
                title: string;
                description: string;
                duration: string;
                type: "video" | "pdf";
                url?: string;
              }) => !lec._id
            ),
          })),
        })),
        lectureFiles: lectureFilesWithMeta,
        thumbnail: thumbnailFile,
      };

      const updatedCourse = await this._courseService.updateCourse(
        courseId,
        updateData
      );
      res.status(httpStatus.OK).json(updatedCourse);
    } catch (err: unknown) {
      console.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }
}

export default CourseController;
