"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/implementations/auth.controller");
const auth_repository_1 = require("../repository/implementations/auth.repository");
const otp_repository_1 = require("../repository/implementations/otp.repository");
const auth_services_1 = require("../services/implementation/auth.services");
const passport_config_1 = __importDefault(require("../config/passport.config"));
const admin_repository_1 = require("../repository/implementations/admin.repository");
const instructorAuth_repository_1 = require("../repository/implementations/instructorAuth.repository");
const course_repository_1 = require("../repository/implementations/course.repository");
const multer_1 = __importDefault(require("../utils/multer"));
const order_repository_1 = require("../repository/implementations/order.repository");
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const progress_repository_1 = require("../repository/implementations/progress.repository");
const wallet_repository_1 = require("../repository/implementations/wallet.repository");
const authRepository = new auth_repository_1.AuthRepository();
const instructorRepository = new instructorAuth_repository_1.InstructorAuth();
const otpRepository = new otp_repository_1.OtpRepository();
const adminRepository = new admin_repository_1.AdminRepository();
const courseRepository = new course_repository_1.CourseRepository();
const orderRepository = new order_repository_1.OrderRepository();
const progressRepository = new progress_repository_1.ProgressRepository();
const walletRepository = new wallet_repository_1.WalletRepository();
const authService = new auth_services_1.AuthService(authRepository, otpRepository, adminRepository, instructorRepository, courseRepository, orderRepository, progressRepository, walletRepository);
const authController = new auth_controller_1.Authcontroller(authService);
const router = (0, express_1.Router)();
router.post("/register", authController.signup.bind(authController));
router.post("/login", authController.signin.bind(authController));
router.post("/verify-otp", authController.verifyOtp.bind(authController));
router.post("/forgotpassword", authController.forgotPassword.bind(authController));
router.post("/reset-verify-otp", authController.verifyForgotOtp.bind(authController));
router.put("/resetpassword", authController.resetPassword.bind(authController));
router.post("/verifygoogle", authController.verifyGoogle.bind(authController));
router.post("/resend-otp", authController.resentOtp.bind(authController));
router.get("/profile", (0, authRole_1.default)(["user"]), authController.getProfile.bind(authController));
router.put("/profile", (0, authRole_1.default)(["user"]), multer_1.default.single("profilePicture"), authController.updateProfile.bind(authController));
router.get("/courses", authController.getCourses.bind(authController));
router.post("/orders", (0, authRole_1.default)(["user"]), authController.buyCourse.bind(authController));
router.post("/orders/verify", (0, authRole_1.default)(["user"]), authController.verifyOrder.bind(authController));
router.get("/courses/:courseId", (0, authRole_1.default)(["user"]), authController.findCourseById.bind(authController));
router.post("/course-view/progress/:courseId", (0, authRole_1.default)(["user"]), authController.markLectureWatched.bind(authController));
router.get("/course-view/progress/:courseId", (0, authRole_1.default)(["user"]), authController.getCourseProgress.bind(authController));
router.get("/auth/google", passport_config_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));
router.get("/auth/google/callback", passport_config_1.default.authenticate("google", {
    failureRedirect: "/register",
    session: false,
}), authController.googleAuth.bind(authController));
exports.default = router;
