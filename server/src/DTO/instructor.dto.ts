export interface InstructorDTO{
    _id:string,
    name:string,
    email:string,
    username:string,
    phone:string,
    title:string,
    isBlocked:boolean,
    yearsOfExperience:number,
    resume:string
    profilePicture?:string
    role:"user"|"admin"|"instructor"
    isRejected:boolean
    education:string,
    accountStatus:"pending"|"blocked"|"active"|"rejected",
    isVerified:boolean,
}