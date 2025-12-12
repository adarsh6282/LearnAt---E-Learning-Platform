import { CategoryDTO } from "../../DTO/category.dto";
import { CourseDTO } from "../../DTO/course.dto";
import { InstructorDTO } from "../../DTO/instructor.dto";
import { NotificationDTO } from "../../DTO/notification.dto";
import { QuizDTO } from "../../DTO/quiz.dto";
import { ReviewDTO } from "../../DTO/review.dto";
import { UserDTO } from "../../DTO/user.dto";
import { ICoupon } from "../../models/interfaces/coupon.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { InstructorQuizResponse, IQuiz } from "../../models/interfaces/quiz.interface";
import { ITransaction, IWallet } from "../../models/interfaces/wallet.interface";
import { IEnrollment } from "../../types/enrollment.types";
interface Dashboard{
  totalUsers:number,
  totalCourses:number
}

export interface IInstructorAuthService{
    registerInstructor(email:string):Promise<void>
    loginInstructor(email:string,password:string):Promise<{instructor:InstructorDTO,token:string,instructorRefreshToken:string}>
    reApplyS(email: string, resume: string):Promise<InstructorDTO>
    verifyOtp(data:IInstructor&{otp:string}):Promise<{instructor:InstructorDTO,token:string,instructorRefreshToken:string}>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>,
    getProfileService(email:string):Promise<InstructorDTO>
    getReviewsByInstructor(instructorId:string,page:number,limit:number,rating:number):Promise<{reviews:ReviewDTO[],total:number,totalPages:number}>
    updateProfileService(
      email: string,
      {
        name,
        phone,
        title,
        yearsOfExperience,
        education,
        profilePicture,
      }: { name?: string; phone?: string; profilePicture?: Express.Multer.File ;title?:string;yearsOfExperience?:number,education?:string}
    ): Promise<InstructorDTO>
    getCoursesByInstructor(instructorId:string,page:number,limit:number,search:string):Promise<{courses:CourseDTO[],total:number,totalPages:number}>
    getCategory():Promise<CategoryDTO[]>
    getCourseById(courseId:string):Promise<CourseDTO>
    getEnrollments(instructorId:string,page:number,limit:number,search:string,status:string):Promise<{enrollments:IEnrollment[],total:number;totalPages:number}>
    getWallet(instructorId:string,page:number,limit:number):Promise<{wallet:Partial<IWallet>,total:number,totalPages:number,transactions:ITransaction[]}>
    getCouresStats(instructorId:string):Promise<{title:string,enrolledCount:number}[]>
    getIncomeStats(instructorId:string):Promise<{month:string,revenue:number}[]>
    getNotifications(userId:string):Promise<NotificationDTO[]>
    markAsRead(notificationId:string):Promise<NotificationDTO>
    getPurchasedUsers(instructorId:string):Promise<UserDTO[]>
    createQuiz(instructorId:string,quiz:Partial<IQuiz>,courseID:string):Promise<QuizDTO>
    getQuizzes(instructor:string):Promise<InstructorQuizResponse[]|null>
    deleteQuiz(quizId:string):Promise<QuizDTO>
    restoreQuiz(quizId:string):Promise<QuizDTO>
    getQuiz(quizId:string):Promise<QuizDTO>
    updateQuiz(quizId:string,updateData:Partial<IQuiz>):Promise<QuizDTO>
    addCoupon(code:string,discount:string,expiresAt:string,maxUses:string,courseId:string,instructorId:string):Promise<ICoupon|null>
    getCouponsForInstructors(instructorId:string):Promise<ICoupon[]|null>
    updateCoupon(id:string,instructorId:string,code:string,discount:string,expiresAt:string,maxUses:string):Promise<ICoupon|null>
    getDashboard(instructorId:string):Promise<Dashboard|null>
}