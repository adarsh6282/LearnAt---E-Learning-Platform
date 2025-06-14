import {
  ICourseService,
  CreateCourseInput,
} from "../interfaces/course.services";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { Types } from "mongoose";
import cloudinary from "../../config/cloudinary.config";
import streamifier from "streamifier";

export class CourseService implements ICourseService {
  constructor(private _courseRepository: ICourseRepository) {}

  private async uploadToCloudinary(file: Express.Multer.File, type: "image" | "video"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: type,
        folder: type === "image" ? "courses/thumbnails" : "courses/lectures",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        format: type === "image" ? "jpg" : "mp4",
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


  async createCourse(courseData: CreateCourseInput): Promise<ICourse> {
  try {
    let thumbnailUrl: string | undefined = undefined;
    if (courseData.thumbnail) {
      thumbnailUrl = await this.uploadToCloudinary(courseData.thumbnail,"image");
    }

    const videoUploadPromises = courseData.videos.map((file) =>
      this.uploadToCloudinary(file, "video")
    );

    const videoUrls = await Promise.all(videoUploadPromises);

    const lectures = courseData.lectures.map((lecture, index) => ({
      title: lecture.title,
      description: lecture.description,
      videoUrl: videoUrls[index],
      duration: lecture.duration,
      order: lecture.order,
    }));

    const course = await this._courseRepository.createCourse({
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      price: courseData.price,
      instructor:new Types.ObjectId(courseData.instructorId),
      isActive: courseData.isActive ?? true,
      thumbnail:thumbnailUrl,
      lectures,
    });

    return course;
  } catch (error) {
    console.error("Course creation error:", error);
    throw error;
  }
}
}
