import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../interfaces/course.interface";
import Course from "../../models/implementations/courseModel";
import { BaseRepository } from "../base.repository";

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

  async findAll(): Promise<ICourse[]> {
    const courses = await this.model
      .find({})
      .populate("instructor", "name email").populate({
      path: "category",
      match: { isDeleted: false },
      select: "name",
    });
    return courses;
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    const course = await this.model
      .findById(courseId)
      .populate("instructor", "name");

    return course;
  }

  async findCoursesByInstructor(instructorId: string): Promise<ICourse[]> {
    return await this.model
      .find({ instructor: instructorId })
      .sort({ createdAt: -1 });
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
  ): Promise<ICourse|null> {
    return await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
  }
}
