"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authcontroller = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const jwt_1 = require("../../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authcontroller {
    constructor(_authService, _messageService, _certificateService, _livesessionService) {
        this._authService = _authService;
        this._messageService = _messageService;
        this._certificateService = _certificateService;
        this._livesessionService = _livesessionService;
    }
    async signup(req, res) {
        try {
            const { email } = req.body;
            await this._authService.registerUser(email);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Otp sent successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token, userRefreshToken } = await this._authService.loginUser(email, password);
            res.cookie("userRefreshToken", userRefreshToken, {
                httpOnly: true,
                path: "/api/users",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: Number(process.env.COOKIE_MAXAGE),
            });
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ user, token, message: "User Login Successfull" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async verifyOtp(req, res) {
        try {
            const userData = req.body;
            const { user, token, userRefreshToken } = await this._authService.verifyOtp(userData);
            res.cookie("userRefreshToken", userRefreshToken, {
                path: "/api/users",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: Number(process.env.COOKIE_MAXAGE),
            });
            res
                .status(statusCodes_1.httpStatus.CREATED)
                .json({ user, token, message: "User Registered Successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async googleAuth(req, res) {
        if (!req.user) {
            res
                .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                .json({ message: "Authentication failed" });
            return;
        }
        const { id, email } = req.user;
        const token = (0, jwt_1.generateToken)(id, email, "user");
        const refreshToken = (0, jwt_1.generateRefreshToken)(id, email, "user");
        res.cookie("userRefreshToken", refreshToken, {
            httpOnly: true,
            path: "/api/users",
            secure: process.env.NOD_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.COOKIE_MAXAGE),
        });
        const redirectUrl = process.env.GOOGLE_VERIFY_URL;
        res.redirect(`${redirectUrl}?token=${token}`);
    }
    async verifyGoogle(req, res) {
        const { token } = req.body;
        if (!token)
            res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Token missing" });
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Verified", user: decoded });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await this._authService.handleForgotPassword(email);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP Sent Successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async verifyForgotOtp(req, res) {
        try {
            const data = req.body;
            await this._authService.verifyForgotOtp(data);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP verified." });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async resetPassword(req, res) {
        try {
            const data = req.body;
            await this._authService.handleResetPassword(data);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Password resetted successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async resentOtp(req, res) {
        try {
            const { email } = req.body;
            await this._authService.handleResendOtp(email);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP resent Successsfully!" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getProfile(req, res) {
        try {
            const email = req.user?.email;
            if (!email)
                return;
            const user = await this._authService.getProfileByEmail(email);
            res.status(statusCodes_1.httpStatus.OK).json(user);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async updateProfile(req, res) {
        try {
            const { name, phone } = req.body;
            const profilePicture = req.file;
            const email = req.user?.email;
            if (!email) {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Email not found" });
            }
            const updatedUser = await this._authService.updateProfileService(email, {
                name,
                phone,
                profilePicture,
            });
            res.status(statusCodes_1.httpStatus.OK).json(updatedUser);
        }
        catch (err) {
            console.error("Error updating profile:", err);
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to update profile" });
        }
    }
    async getCourses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const category = req.query.category || "";
            const minPrice = parseInt(req.query.minPrice) || 0;
            const maxPrice = parseInt(req.query.maxPrice) || 10000;
            const { courses, total, totalPages } = await this._authService.getCoursesService(page, limit, search, category, minPrice, maxPrice);
            res.status(statusCodes_1.httpStatus.OK).json({ courses: courses, total, totalPages });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCategory(req, res) {
        try {
            const category = await this._authService.getCategory();
            res.status(statusCodes_1.httpStatus.OK).json(category);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async findCourseById(req, res) {
        const { courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return;
        }
        try {
            const { course, isEnrolled } = await this._authService.findCourseByIdService(courseId, userId);
            res.status(statusCodes_1.httpStatus.OK).json({ course, isEnrolled });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async buyCourse(req, res) {
        try {
            const { courseId } = req.body;
            const userId = req.user?.id;
            const order = await this._authService.createOrder(courseId, userId);
            res.status(statusCodes_1.httpStatus.OK).json(order);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async verifyOrder(req, res) {
        try {
            const result = await this._authService.verifyPayment(req.body);
            res.status(statusCodes_1.httpStatus.OK).json(result);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async markLectureWatched(req, res) {
        try {
            const { courseId } = req.params;
            const { lectureId } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const progress = await this._authService.updateLectureProgress(userId, courseId, lectureId);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ watchedLectures: progress?.watchedLectures });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCourseProgress(req, res) {
        try {
            const { courseId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const watchedLectures = await this._authService.getUserCourseProgress(userId, courseId);
            res.status(statusCodes_1.httpStatus.OK).json(watchedLectures);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message });
        }
    }
    async checkStatus(req, res) {
        const { courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "NO user found" });
            return;
        }
        const isCompleted = await this._authService.checkStatus(userId, courseId);
        res.status(statusCodes_1.httpStatus.OK).json(isCompleted);
    }
    async refreshToken(req, res) {
        const token = req.cookies.userRefreshToken;
        if (!token) {
            res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            if (decoded.role !== "user") {
                res.status(statusCodes_1.httpStatus.FORBIDDEN).json({ message: "Invalid role" });
                return;
            }
            const usersToken = (0, jwt_1.generateToken)(decoded._id, decoded.email, decoded.role);
            res.status(statusCodes_1.httpStatus.OK).json({ token: usersToken });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async logOut(req, res) {
        res.clearCookie("userRefreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/users",
        });
        res.status(statusCodes_1.httpStatus.OK).json({ message: "Logged out successfully" });
    }
    async getPurchasedInstructors(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "user not found" });
                return;
            }
            const instructors = await this._authService.fetchPurchasedInstructors(userId);
            res.status(statusCodes_1.httpStatus.OK).json(instructors);
        }
        catch (error) {
            console.log(error);
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Error fetching instructors", error });
        }
    }
    async getNotifications(req, res) {
        try {
            const { userId } = req.params;
            const notifications = await this._authService.getNotifications(userId);
            res.status(statusCodes_1.httpStatus.OK).json(notifications);
        }
        catch (err) {
            console.log(err);
        }
    }
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            await this._authService.markAsRead(notificationId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async submitComplaint(req, res) {
        try {
            const { type, subject, message, targetId } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            if (!type || !subject || !message) {
                res
                    .status(statusCodes_1.httpStatus.BAD_REQUEST)
                    .json({ message: "All fields are required" });
                return;
            }
            await this._authService.submitComplaint({
                userId,
                type,
                subject,
                message,
                targetId,
            });
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Complaint submitted successfully" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async getPurchases(req, res) {
        try {
            const userId = req.user?.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const { purchases, total, totalPages } = await this._authService.getPurchases(userId, page, limit);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ purchases: purchases, total, totalPages, currentPage: page });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            const { oldPassword, newPassword, confirmPassword } = req.body;
            await this._authService.changePassword(userId, oldPassword, newPassword, confirmPassword);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Password changed successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async courseInstructorView(req, res) {
        try {
            const instructorId = req.params.instructorId;
            const instructor = await this._authService.getSpecificInstructor(instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(instructor);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async purchasedCourses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const userId = req.user?.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "user not found" });
                return;
            }
            const { purchasedCourses, total, totalPages } = await this._authService.purchasedCourses(userId, page, limit);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ purchasedCourses, total, totalPages, currentPage: page });
        }
        catch (err) {
            console.log(err);
        }
    }
    async getCertificates(req, res) {
        try {
            const user = req.user?.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!user) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "user not authorized" });
                return;
            }
            const certificates = await this._authService.getCertificates(user, page, limit);
            res.status(statusCodes_1.httpStatus.OK).json(certificates);
        }
        catch (err) {
            console.log(err);
        }
    }
    async markRead(req, res) {
        try {
            const chatId = req.params.chatId;
            const { userId, userModel } = req.body;
            await this._messageService.markRead(chatId, userId, userModel);
            res.sendStatus(statusCodes_1.httpStatus.OK);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getUnreadCounts(req, res) {
        try {
            const { userId, userModel } = req.query;
            const counts = await this._messageService.getUnreadCounts(userId, userModel);
            res.json(counts);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getQuiz(req, res) {
        try {
            const { courseId } = req.params;
            const quiz = await this._authService.getQuiz(courseId);
            res.status(statusCodes_1.httpStatus.OK).json({ quiz });
        }
        catch (err) {
            console.log(err);
        }
    }
    async submitQuiz(req, res) {
        try {
            const { quizId } = req.params;
            const { answers, courseId } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                throw new Error("no user found");
            }
            const result = await this._authService.submitQuiz(quizId, userId, courseId, answers);
            res.status(statusCodes_1.httpStatus.OK).json({
                score: result.score,
                percentage: result.percentage,
                passed: result.passed,
                isCertificateIssued: result.isCertificateIssued,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async createCertificate(req, res) {
        try {
            const { userId, courseId } = req.body;
            const file = req.file;
            if (!userId || !courseId || !file) {
                res.status(400).json({ message: "Missing required data" });
                return;
            }
            const certificate = await this._certificateService.createCertificate({
                user: userId,
                course: courseId,
                file: file
            });
            res.status(statusCodes_1.httpStatus.CREATED).json({ certificate });
        }
        catch (err) {
            console.error(err);
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
        }
    }
    async getSessionToken(req, res) {
        try {
            const { sessionId, role } = req.query;
            const userId = req.user?.id;
            if (role !== "instructor" && role !== "user") {
                res.status(400).json({ error: "Invalid role" });
                return;
            }
            const { token, appId, roomId, courseId } = await this._livesessionService.generateToken(sessionId, userId, role);
            res.status(statusCodes_1.httpStatus.OK).json({ token, appId, roomId, userId, courseId });
        }
        catch (error) {
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async getLiveSessionByCourseId(req, res) {
        try {
            const { courseId } = req.params;
            const liveSession = await this._livesessionService.getLiveSessionByCourseId(courseId);
            if (!liveSession) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "No active live session found." });
                return;
            }
            res.status(statusCodes_1.httpStatus.OK).json(liveSession);
        }
        catch (error) {
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    }
}
exports.Authcontroller = Authcontroller;
