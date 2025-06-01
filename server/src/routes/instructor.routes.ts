import {Router} from "express"
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository"
import { InstructorAuthController } from "../controllers/implementations/instructorAuth.controller"
import { InstructorAuthSerivce } from "../services/implementation/instructorAuth.services"
import { OtpRepository } from "../repository/implementations/otp.repository"


const instructorAuthRepository=new InstructorAuth()
const otpRepository=new OtpRepository()
const instructorAuthService=new InstructorAuthSerivce(instructorAuthRepository,otpRepository)
const instructorAuthController=new InstructorAuthController(instructorAuthService)

const router=Router()

router.post("/register",instructorAuthController.signup.bind(instructorAuthController))
router.post("/login",instructorAuthController.signin.bind(instructorAuthController))
router.post("/verify-otp",instructorAuthController.verifyOtp.bind(instructorAuthController))
router.post("/forgotpassword",instructorAuthController.forgotPassword.bind(instructorAuthController))
router.post("/reset-verify-otp",instructorAuthController.verifyForgotOtp.bind(instructorAuthController))
router.put("/resetpassword",instructorAuthController.resetPassword.bind(instructorAuthController))
router.post("/resend-otp",instructorAuthController.resentOtp.bind(instructorAuthController))

export default router