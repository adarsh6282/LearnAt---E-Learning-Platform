import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../interfaces/course.interface";
import Course from "../../models/implementations/courseModel";
import { BaseRepository } from "../base.repository";
import { FilterQuery, Types } from "mongoose";

export class CourseRepository
  extends BaseRepository<ICourse>
  implements ICourseRepository
{
  constructor() {
    super(Course);
  }
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = await this.model.create(courseData);
    return course;
  }

  async findAllCourse(
    page: number,
    limit: number,
    search: string
  ): Promise<{ course: ICourse[]; total: number; totalPage: number }> {
    const skip = (page - 1) * limit;

    const searchQuery = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    console.log(searchQuery);

    const [course, total] = await Promise.all([
      this.model
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .populate("instructor", "name email")
        .populate({
          path: "category",
          match: { isDeleted: false },
          select: "name",
        }),
      this.model.countDocuments(searchQuery),
    ]);

    const totalPage = Math.ceil(total / limit);

    return { course, total, totalPage };
  }

  async findCourses(
    page: number,
    limit: number,
    search: string,
    category: string,
    minPrice: number,
    maxPrice: number
  ): Promise<{ courses: ICourse[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<ICourse> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
      query.price = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
      query.price = { $lte: maxPrice };
    }

    const [courses, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate("instructor", "name email"),
      this.model.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { courses, total, totalPages };
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    const course = await this.model
      .findById(courseId)
      .populate("instructor", "name");

    return course;
  }

  async findCoursesByInstructor(
    instructorId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ courses: ICourse[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<ICourse> = { instructor: instructorId };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [courses, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit),
      this.model.countDocuments(query),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { courses, total, totalPages };
  }

  async addEnrolledUser(
    courseId: string,
    userId: string
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId },
    });
  }

  async updateCourseStatus(
    courseId: string,
    isActive: boolean
  ): Promise<ICourse | null> {
    return await this.model.findByIdAndUpdate(
      courseId,
      { isActive },
      { new: true }
    );
  }

  async updateCourseById(
    courseId: string,
    updateData: Partial<ICourse>
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
  }

  async getCourseStats(): Promise<{ title: string; enrolledCount: number }[]> {
    const courses = await Course.find().select("title enrolledStudents");
    return courses.map((course) => ({
      title: course.title,
      enrolledCount: course.enrolledStudents?.length || 0,
    }));
  }

  async getCourseStatsOfInstructor(
    instructorId: string
  ): Promise<{ title: string; enrolledCount: number }[]> {
    const courses = await Course.find({ instructor: instructorId }).select(
      "title enrolledStudents"
    );
    return courses.map((course) => ({
      title: course.title,
      enrolledCount: course.enrolledStudents?.length || 0,
    }));
  }

  async findByPurchasedUser(userId: string): Promise<string[]> {
    const courses = await Course.find({ enrolledStudents: userId }).select(
      "instructor"
    );

    const instructorIds = [
      ...new Set(courses.map((c: any) => c.instructor.toString())),
    ];

    return instructorIds;
  }

  async getUsersByInstructor(instructorId: string): Promise<string[]> {
    const courses = await Course.find({ instructor: instructorId }).select(
      "enrolledStudents"
    );

    const userIds = new Set<string>();
    courses.forEach((course: ICourse) => {
      course.enrolledStudents.forEach((userId: string|Types.ObjectId) => {
        userIds.add(userId.toString());
      });
    });

    return Array.from(userIds);
  }
}
