import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../interfaces/instructorAuth.interface";
import Instructor from "../../models/implementations/instructorModel";
import { BaseRepository } from "../base.repository";

export class InstructorAuth extends BaseRepository<IInstructor> implements IInstructorAuthRepository {
  constructor(){
    super(Instructor)
  }
  async createInstructor(userData: Partial<IInstructor>): Promise<IInstructor> {
    const instructor = await this.model.create(userData);
    return instructor;
  }

  async findByEmail(email: string): Promise<IInstructor | null> {
    const instructor = await this.model.findOne({ email });
    return instructor;
  }

  async updateTutor(
    email: string,
    isVerified: boolean,
    accountStatus:string
  ): Promise<IInstructor | null> {
    const tutor = await this.model.findOneAndUpdate(
      { email },
      { isVerified: true ,accountStatus},
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
        education:string;
        yearsOfExperience:number;
        title:string
      }>
    ): Promise<IInstructor | null> {
      const updatedInstructor = await this.model.findOneAndUpdate(
        { email },
        { $set: updateFields },
        { new: true }
      );
      return updatedInstructor;
    }
}
