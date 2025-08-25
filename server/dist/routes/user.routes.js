"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_config_1 = __importDefault(require("../config/passport.config"));
const multer_1 = __importDefault(require("../utils/multer"));
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const user_dependencyhandler_1 = require("../dependencyHandlers/user.dependencyhandler");
const router = (0, express_1.Router)();
router.post("/register", user_dependencyhandler_1.authController.signup.bind(user_dependencyhandler_1.authController));
router.post("/refresh-token", user_dependencyhandler_1.authController.refreshToken.bind(user_dependencyhandler_1.authController));
router.post("/login", user_dependencyhandler_1.authController.signin.bind(user_dependencyhandler_1.authController));
router.post("/verify-otp", user_dependencyhandler_1.authController.verifyOtp.bind(user_dependencyhandler_1.authController));
router.post("/forgotpassword", user_dependencyhandler_1.authController.forgotPassword.bind(user_dependencyhandler_1.authController));
router.post("/reset-verify-otp", user_dependencyhandler_1.authController.verifyForgotOtp.bind(user_dependencyhandler_1.authController));
router.put("/resetpassword", user_dependencyhandler_1.authController.resetPassword.bind(user_dependencyhandler_1.authController));
router.post("/verifygoogle", user_dependencyhandler_1.authController.verifyGoogle.bind(user_dependencyhandler_1.authController));
router.post("/resend-otp", user_dependencyhandler_1.authController.resentOtp.bind(user_dependencyhandler_1.authController));
router.get("/profile", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getProfile.bind(user_dependencyhandler_1.authController));
router.patch("/profile", (0, authRole_1.default)(["user"]), multer_1.default.single("profilePicture"), user_dependencyhandler_1.authController.updateProfile.bind(user_dependencyhandler_1.authController));
router.get("/courses", user_dependencyhandler_1.authController.getCourses.bind(user_dependencyhandler_1.authController));
router.get("/category", user_dependencyhandler_1.authController.getCategory.bind(user_dependencyhandler_1.authController));
router.post("/orders", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.buyCourse.bind(user_dependencyhandler_1.authController));
router.post("/orders/verify", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.verifyOrder.bind(user_dependencyhandler_1.authController));
router.get("/courses/:courseId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.findCourseById.bind(user_dependencyhandler_1.authController));
router.post("/course-view/progress/:courseId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.markLectureWatched.bind(user_dependencyhandler_1.authController));
router.get("/course-view/progress/:courseId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getCourseProgress.bind(user_dependencyhandler_1.authController));
router.get("/courses/progress/:courseId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.checkStatus.bind(user_dependencyhandler_1.authController));
router.get("/auth/google", passport_config_1.default.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));
router.get("/auth/google/callback", passport_config_1.default.authenticate("google", {
    failureRedirect: "/register",
    session: false,
}), user_dependencyhandler_1.authController.googleAuth.bind(user_dependencyhandler_1.authController));
router.get("/instructors/purchased", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getPurchasedInstructors.bind(user_dependencyhandler_1.authController));
router.post("/complaints", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.submitComplaint.bind(user_dependencyhandler_1.authController));
router.get("/notifications/:userId", user_dependencyhandler_1.authController.getNotifications.bind(user_dependencyhandler_1.authController));
router.put("/notifications/read/:notificationId", user_dependencyhandler_1.authController.markAsRead.bind(user_dependencyhandler_1.authController));
router.get("/purchase-history", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getPurchases.bind(user_dependencyhandler_1.authController));
router.get("/purchased-courses", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.purchasedCourses.bind(user_dependencyhandler_1.authController));
router.post("/change-password", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.changePassword.bind(user_dependencyhandler_1.authController));
router.get("/courseinstructor/:instructorId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.courseInstructorView.bind(user_dependencyhandler_1.authController));
router.get("/certificates/:id", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getCertificates.bind(user_dependencyhandler_1.authController));
router.get("/chats/unread-counts", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.getUnreadCounts.bind(user_dependencyhandler_1.authController));
router.post("/messages/mark-as-read/:chatId", (0, authRole_1.default)(["user"]), user_dependencyhandler_1.authController.markRead.bind(user_dependencyhandler_1.authController));
router.post("/logout", user_dependencyhandler_1.authController.logOut.bind(user_dependencyhandler_1.authController));
exports.default = router;
