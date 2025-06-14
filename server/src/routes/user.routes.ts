import {Router} from "express"
import {Authcontroller} from "../controllers/implementations/auth.controller"
import {AuthRepository} from "../repository/implementations/auth.repository"
import {OtpRepository} from "../repository/implementations/otp.repository"
import {AuthService} from "../services/implementation/auth.services"
import authUser from "../middlewares/authUser"
import passport from "../config/passport.config"
import { AdminRepository } from "../repository/implementations/admin.repository"
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository"
import { CourseRepository } from "../repository/implementations/course.repository"
import upload from "../utils/multer"
import { OrderRepository } from "../repository/implementations/order.repository"


const authRepository = new AuthRepository();
const instructorRepository=new InstructorAuth()
const otpRepository = new OtpRepository()
const adminRepository=new AdminRepository()
const courseRepository=new CourseRepository()
const orderRepository=new OrderRepository()
const authService = new AuthService(authRepository,otpRepository,adminRepository,instructorRepository,courseRepository,orderRepository);
const authController = new Authcontroller(authService);

const router=Router()

router.post("/register",authController.signup.bind(authController))
router.post("/login",authController.signin.bind(authController))
router.post("/verify-otp",authController.verifyOtp.bind(authController))
router.post("/forgotpassword",authController.forgotPassword.bind(authController))
router.post("/reset-verify-otp",authController.verifyForgotOtp.bind(authController))
router.put("/resetpassword",authController.resetPassword.bind(authController))
router.post("/verifygoogle",authController.verifyGoogle.bind(authController))
router.post("/resend-otp",authController.resentOtp.bind(authController))
router.get("/profile",authUser,authController.getProfile.bind(authController))
router.put("/profile",authUser,upload.single("profilePicture"),authController.updateProfile.bind(authController))
router.get("/courses",authController.getCourses.bind(authController))
router.post("/orders",authUser,authController.buyCourse.bind(authController))
router.post("/orders/verify",authUser,authController.verifyOrder.bind(authController))
router.get("/courses/:courseId",authUser,authController.findCourseById.bind(authController))
router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"],session:false}))
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/register", session: false }),
  authController.googleAuth.bind(authController))

export default router