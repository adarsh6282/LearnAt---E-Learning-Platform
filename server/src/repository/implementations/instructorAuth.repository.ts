import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../interfaces/instructorAuth.interface";
import Instructor from "../../models/implementations/instructorModel";
import Course from "../../models/implementations/courseModel";
import { BaseRepository } from "../base.repository";
import Order from "../../models/implementations/orderModel";

interface Dashboard {
  totalUsers: number;
  totalCourses: number;
}

export class InstructorAuth
  extends BaseRepository<IInstructor>
  implements IInstructorAuthRepository
{
  constructor() {
    super(Instructor);
  }
  async createInstructor(userData: Partial<IInstructor>): Promise<IInstructor> {
    const instructor = await this.model.create(userData);
    return instructor;
  }

  async findByEmail(email: string): Promise<IInstructor | null> {
    const instructor = await this.model.findOne({ email });
    return instructor;
  }

  async findById(id: string): Promise<IInstructor | null> {
    const instructor = await this.model.findById(id);
    return instructor;
  }

  async findInstructorsByIds(ids: string[]): Promise<IInstructor[]> {
    return Instructor.find({ _id: { $in: ids } });
  }

  async updateTutor(
    email: string,
    isVerified: boolean,
    isRejected: boolean,
    accountStatus: string
  ): Promise<IInstructor | null> {
    const tutor = await this.model.findOneAndUpdate(
      { email },
      { isVerified, accountStatus, isRejected },
      { new: true }
    );
    return tutor;
  }

  async deleteTutor(email: string): Promise<IInstructor | null> {
    return await this.model.findOneAndDelete({ email });
  }

  async findForProfile(email: string): Promise<IInstructor | null> {
    const instructor = await this.model.findOne({ email }).select("-password");
    return instructor;
  }

  async updateInstructorByEmail(
    email: string,
    updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
      education: string;
      yearsOfExperience: number;
      title: string;
    }>
  ): Promise<IInstructor | null> {
    const updatedInstructor = await this.model.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );
    return updatedInstructor;
  }

  async updateInstructor(
    email: string,
    updatedData: Partial<IInstructor>
  ): Promise<IInstructor | null> {
    return await Instructor.findOneAndUpdate(
      { email },
      { $set: updatedData },
      { new: true }
    );
  }

  async getDashboard(instructorId: string): Promise<Dashboard | null> {
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id"
    );
    const courseIds = courses.map((course) => course._id);

    const totalCourses = courseIds.length;

    const enrolledUserIds = await Order.distinct("userId", {
      courseId: { $in: courseIds },
    });

    const totalUsers = enrolledUserIds.length;
    return {
      totalCourses,
      totalUsers,
    };
  }
}
