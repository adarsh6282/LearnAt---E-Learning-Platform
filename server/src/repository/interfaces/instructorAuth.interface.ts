import { IInstructor } from "../../models/interfaces/instructorAuth.interface"

export interface IInstructorAuthRepository{
    createInstructor(userData:Partial<IInstructor>):Promise<IInstructor>
    findByEmail(email:string):Promise<IInstructor|null>,
    updateTutor(email:string,isVerified:boolean,accountStatus:string):Promise<IInstructor|null>,
    deleteTutor(email:string):Promise<IInstructor|null>,
    findForProfile(email:string):Promise<IInstructor|null>,
    updateInstructorByEmail(
        email: string,
        updateFields: Partial<{
          name: string;
        phone: string;
        profilePicture: string;
        education:string;
        yearsOfExperience:number;
        title:string
        }>
      ): Promise<IInstructor|null>
}