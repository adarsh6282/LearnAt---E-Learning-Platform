"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInstructorDTOList = exports.toInstructorDTO = void 0;
const toInstructorDTO = (instructor) => ({
    _id: instructor._id.toString(),
    name: instructor.name,
    email: instructor.email,
    username: instructor.username,
    phone: instructor.phone,
    title: instructor.title,
    isBlocked: instructor.isBlocked,
    yearsOfExperience: instructor.yearsOfExperience,
    resume: instructor.resume,
    profilePicture: instructor.profilePicture,
    role: instructor.role,
    isRejected: instructor.isRejected,
    education: instructor.education,
    accountStatus: instructor.accountStatus,
    isVerified: instructor.isVerified,
});
exports.toInstructorDTO = toInstructorDTO;
const toInstructorDTOList = (instructors) => (instructors.map(exports.toInstructorDTO));
exports.toInstructorDTOList = toInstructorDTOList;
