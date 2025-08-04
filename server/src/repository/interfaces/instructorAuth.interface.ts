import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

interface Dashboard{
  totalUsers:number,
  totalCourses:number
}

export interface IInstructorAuthRepository {
  createInstructor(userData: Partial<IInstructor>): Promise<IInstructor>;
  findByEmail(email: string): Promise<IInstructor | null>;
  findById(id: string): Promise<IInstructor | null>;
  updateTutor(
    email: string,
    isVerified: boolean,
    isRejected:boolean,
    accountStatus: string,
  ): Promise<IInstructor | null>;
  deleteTutor(email: string): Promise<IInstructor | null>;
  updateInstructor(
    email: string,
    updatedData: Partial<IInstructor>
  ): Promise<IInstructor | null>;
  findForProfile(email: string): Promise<IInstructor | null>;
  findInstructorsByIds(ids: string[]): Promise<IInstructor[]>;
  updateInstructorByEmail(
    email: string,
    updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
      education: string;
      yearsOfExperience: number;
      title: string;
    }>
  ): Promise<IInstructor | null>;
  getDashboard(instructorId:string):Promise<Dashboard|null>
}