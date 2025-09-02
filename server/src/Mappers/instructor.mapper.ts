import { InstructorDTO } from "../DTO/instructor.dto";
import { IInstructor } from "../models/interfaces/instructorAuth.interface";

export const toInstructorDTO=(instructor:IInstructor):InstructorDTO=>({
    _id:instructor._id.toString(),
    name:instructor.name,
    email:instructor.email,
    username:instructor.username,
    phone:instructor.phone,
    title:instructor.title,
    isBlocked:instructor.isBlocked,
    yearsOfExperience:instructor.yearsOfExperience,
    resume:instructor.resume,
    profilePicture:instructor.profilePicture,
    role:instructor.role,
    isRejected:instructor.isRejected,
    education:instructor.education,
    accountStatus:instructor.accountStatus,
    isVerified:instructor.isVerified,
})

export const toInstructorDTOList=(instructors:IInstructor[]):InstructorDTO[]=>(
    instructors.map(toInstructorDTO)
)