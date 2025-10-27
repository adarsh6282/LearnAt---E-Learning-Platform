import {
  ICourseService,
  CreateCourseInput,
} from "../interfaces/course.services";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { UpdateCourseInput } from "../../models/interfaces/course.interface";
import { Types } from "mongoose";
import cloudinary from "../../config/cloudinary.config";
import streamifier from "streamifier";
import { CourseDTO } from "../../DTO/course.dto";
import { toCourseDTO } from "../../Mappers/course.mapper";

export interface LectureFileWithMeta {
  file: Express.Multer.File;
  meta: {
    moduleIndex: number;
    chapterIndex: number;
    lectureIndex: number;
    type?: string;
    lectureId?: string;
  };
}

export class CourseService implements ICourseService {
  constructor(private _courseRepository: ICourseRepository) {}

  private async uploadToCloudinary(
    file: Express.Multer.File,
    type: "image" | "video" | "pdf"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type:
            type === "image" ? "image" : type === "video" ? "video" : "raw",
          folder:
            type === "image"
              ? "courses/thumbnails"
              : type == "video"
                ? "courses/lectures/videos"
                : "courses/lectures/pdf",
          public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        },
        (error, result) => {
          if (error) {
            console.error(`Cloudinary ${type} upload error:`, error);
            return reject(new Error(`Failed to upload ${type} to Cloudinary`));
          }
          resolve(result!.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async createCourse(courseData: CreateCourseInput): Promise<CourseDTO> {
    try {
      let thumbnailUrl: string | undefined = undefined;
      if (courseData.thumbnail) {
        thumbnailUrl = await this.uploadToCloudinary(
          courseData.thumbnail,
          "image"
        );
      }

      const lessonUrls = await Promise.all(
        (courseData.lessonFiles || []).map((file, i) => {
          const meta = courseData.lessonMeta[i];
          if (!meta) throw new Error(`Missing metadata for lesson file ${i}`);
          return this.uploadToCloudinary(
            file,
            meta.type === "video" ? "video" : "pdf"
          );
        })
      );

      const modules = courseData.modules.map((mod, modIdx) => ({
        title: mod.title,
        description: mod.description ?? "",
        chapters: mod.chapters.map((chap, chapIdx) => ({
          title: chap.title,
          description: chap.description ?? "",
          lectures: chap.lessons.map((les, lesIdx) => {
            const metaIndex = courseData.lessonMeta.findIndex(
              (m) =>
                m.moduleIndex === modIdx &&
                m.chapterIndex === chapIdx &&
                m.lessonIndex === lesIdx
            );

            const fileUrl =
              metaIndex !== -1 ? lessonUrls[metaIndex] : undefined;

            if (!fileUrl)
              throw new Error(`URL missing for lesson ${les.title}`);

            return {
              title: les.title,
              description: les.description ?? "",
              duration: les.duration ?? "",
              order: les.order ?? 0,
              type: les.type,
              url: fileUrl,
            };
          }),
        })),
      }));

      const course = await this._courseRepository.createCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: courseData.price,
        instructor: new Types.ObjectId(courseData.instructorId),
        thumbnail: thumbnailUrl,
        modules,
        isActive: true,
      });

      return toCourseDTO(course);
    } catch (error) {
      console.error("Course creation failed:", error);
      throw error;
    }
  }

  async updateCourse(
    courseId: string,
    courseData: UpdateCourseInput & { lectureFiles?: LectureFileWithMeta[] }
  ): Promise<CourseDTO> {
    let thumbnailUrl: string | undefined;

    if (courseData.thumbnail) {
      thumbnailUrl = await this.uploadToCloudinary(
        courseData.thumbnail,
        "image"
      );
    }

    const existingCourse =
      await this._courseRepository.findCourseById(courseId);
    if (!existingCourse) throw new Error("Course not found");

    const updatedModules = await Promise.all(
      (courseData.modules || []).map(async (mod, modIndex) => {
        const existingModule = mod._id
          ? existingCourse.modules.find(
              (m: any) => m._id.toString() === mod._id
            )
          : null;
          
        if (!existingModule) {
          const newChapters = await Promise.all(
            (mod.chapters || []).map(async (ch, chIndex) => {
              const newLectures = await Promise.all(
                (ch.newLectures || []).map(async (lec, lecIndex) => {
                  const fileMeta = courseData.lectureFiles?.find(
                    (lf) =>
                      lf.meta.moduleIndex === modIndex &&
                      lf.meta.chapterIndex === chIndex &&
                      lf.meta.lectureIndex === lecIndex
                  );

                  if (fileMeta) {
                    const resourceType = fileMeta.file.mimetype.includes("pdf")
                      ? "pdf"
                      : "video";
                    lec.url = await this.uploadToCloudinary(
                      fileMeta.file,
                      resourceType
                    );
                  }

                  return lec;
                })
              );

              return {
                title: ch.title,
                description: ch.description,
                lectures: newLectures,
              };
            })
          );

          return {
            title: mod.title,
            description: mod.description,
            chapters: newChapters,
          };
        }

        const updatedChapters = await Promise.all(
          (mod.chapters || []).map(async (ch, chIndex) => {
            const updatedExistingLectures = await Promise.all(
              (ch.existingLectures || []).map(async (lec) => {
                const fileMeta = courseData.lectureFiles?.find(
                  (lf) => lf.meta.lectureId === lec._id
                );

                if (fileMeta) {
                  const resourceType = fileMeta.file.mimetype.includes("pdf")
                    ? "pdf"
                    : "video";
                  lec.url = await this.uploadToCloudinary(
                    fileMeta.file,
                    resourceType
                  );
                }

                return lec;
              })
            );

            const updatedNewLectures = await Promise.all(
              (ch.newLectures || []).map(async (lec, lecIndex) => {
                const fileMeta = courseData.lectureFiles?.find(
                  (lf) =>
                    !lf.meta.lectureId &&
                    lf.meta.moduleIndex === modIndex &&
                    lf.meta.chapterIndex === chIndex &&
                    lf.meta.lectureIndex === lecIndex
                );

                if (fileMeta) {
                  const resourceType = fileMeta.file.mimetype.includes("pdf")
                    ? "pdf"
                    : "video";
                  lec.url = await this.uploadToCloudinary(
                    fileMeta.file,
                    resourceType
                  );
                }

                return lec;
              })
            );

            return {
              _id: ch._id,
              title: ch.title,
              description: ch.description,
              lectures: [...updatedExistingLectures, ...updatedNewLectures],
            };
          })
        );

        return {
          _id: mod._id,
          title: mod.title,
          description: mod.description,
          chapters: updatedChapters,
        };
      })
    );

    const updatedCourseData: any = {
      title: courseData.title ?? existingCourse.title,
      description: courseData.description ?? existingCourse.description,
      category: courseData.category ?? existingCourse.category,
      price: courseData.price ?? existingCourse.price,
      isActive: courseData.isActive ?? existingCourse.isActive,
      modules: updatedModules,
    };

    if (thumbnailUrl) updatedCourseData.thumbnail = thumbnailUrl;

    const updatedCourse = await this._courseRepository.updateCourseById(
      courseId,
      updatedCourseData
    );

    if (!updatedCourse) throw new Error("Course not found");
    return toCourseDTO(updatedCourse);
  }
}
