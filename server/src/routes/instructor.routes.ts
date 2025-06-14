import {Router} from "express"
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository"
import { InstructorAuthController } from "../controllers/implementations/instructorAuth.controller"
import { InstructorAuthSerivce } from "../services/implementation/instructorAuth.services"
import { OtpRepository } from "../repository/implementations/otp.repository"
import { AuthRepository } from "../repository/implementations/auth.repository"
import { AdminRepository } from "../repository/implementations/admin.repository"
import authInstructor from "../middlewares/authInstructor"
import upload from "../utils/multer"
import { CourseRepository } from "../repository/implementations/course.repository"

const instructorAuthRepository=new InstructorAuth()
const userRepository=new AuthRepository()
const adminRepository=new AdminRepository()
const otpRepository=new OtpRepository()
const courseRepository=new CourseRepository()
const instructorAuthService=new InstructorAuthSerivce(instructorAuthRepository,otpRepository,adminRepository,userRepository,courseRepository)
const instructorAuthController=new InstructorAuthController(instructorAuthService)

const router=Router()

router.post("/register",instructorAuthController.signup.bind(instructorAuthController))
router.post("/login",instructorAuthController.signin.bind(instructorAuthController))
router.post("/verify-otp",instructorAuthController.verifyOtp.bind(instructorAuthController))
router.post("/forgotpassword",instructorAuthController.forgotPassword.bind(instructorAuthController))
router.post("/reset-verify-otp",instructorAuthController.verifyForgotOtp.bind(instructorAuthController))
router.put("/resetpassword",instructorAuthController.resetPassword.bind(instructorAuthController))
router.post("/resend-otp",instructorAuthController.resentOtp.bind(instructorAuthController))
router.get("/profile",authInstructor,instructorAuthController.getProfile.bind(instructorAuthController))
router.get("/courses",authInstructor,instructorAuthController.getCourses.bind(instructorAuthController))
router.put("/profile",authInstructor,upload.single("profilePicture"),instructorAuthController.updateProfile.bind(instructorAuthController))

export default router