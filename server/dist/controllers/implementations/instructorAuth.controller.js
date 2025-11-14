"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorAuthController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const fs_1 = __importDefault(require("fs"));
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../utils/jwt");
class InstructorAuthController {
    constructor(_instructorAuthService, _messageService, _livesessionService) {
        this._instructorAuthService = _instructorAuthService;
        this._messageService = _messageService;
        this._livesessionService = _livesessionService;
    }
    async signup(req, res) {
        try {
            const { name, username, email, phone, education, title, yearsOfExperience, password, confirmPassword, } = req.body;
            const resumeFile = req.file;
            if (!resumeFile) {
                throw new Error("Resume file is missing");
            }
            const cloudResult = await cloudinary_config_1.default.uploader.upload(resumeFile.path, {
                folder: "resumes",
                resource_type: "auto",
                format: "jpg",
            });
            const resume = cloudResult.secure_url;
            fs_1.default.unlinkSync(resumeFile.path);
            const updatedPayload = {
                name,
                username,
                email,
                phone,
                education,
                title,
                yearsOfExperience,
                password,
                confirmPassword,
                resume,
            };
            await this._instructorAuthService.registerInstructor(email);
            res.status(statusCodes_1.httpStatus.OK).json({
                message: "Form received, resume uploaded, OTP sent",
                data: updatedPayload,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async reApply(req, res) {
        try {
            const resumeFile = req.file;
            if (!resumeFile) {
                return;
            }
            const { email } = req.body;
            console.log(email);
            const cloudResult = await cloudinary_config_1.default.uploader.upload(resumeFile.path, {
                folder: "resumes",
                resource_type: "auto",
            });
            const resumeUrl = cloudResult.secure_url;
            const updatedInstructor = await this._instructorAuthService.reApplyS(email, resumeUrl);
            res.status(statusCodes_1.httpStatus.OK).json({
                message: "Reapplied successfully",
                instructor: updatedInstructor,
            });
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
            const { instructor, token, instructorRefreshToken } = await this._instructorAuthService.loginInstructor(email, password);
            res.cookie("instructorRefreshToken", instructorRefreshToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: "learnat.serveftp.com",
                maxAge: Number(process.env.COOKIE_MAXAGE),
            });
            res.status(statusCodes_1.httpStatus.OK).json({ instructor, token });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async verifyOtp(req, res) {
        try {
            const instructorData = req.body;
            const { instructor, token, instructorRefreshToken } = await this._instructorAuthService.verifyOtp(instructorData);
            res.cookie("instructorRefreshToken", instructorRefreshToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: "learnat.serveftp.com",
                maxAge: Number(process.env.COOKIE_MAXAGE),
            });
            res.status(statusCodes_1.httpStatus.CREATED).json({
                instructor,
                token,
                message: "Instructor Registered Successfully, Waiting for approval",
            });
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
            await this._instructorAuthService.handleForgotPassword(email);
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
            await this._instructorAuthService.verifyForgotOtp(data);
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
            await this._instructorAuthService.handleResetPassword(data);
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
            await this._instructorAuthService.handleResendOtp(email);
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
            const email = req.instructor?.email;
            if (!email)
                return;
            const instructor = await this._instructorAuthService.getProfileService(email);
            res.status(statusCodes_1.httpStatus.OK).json(instructor);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async updateProfile(req, res) {
        try {
            const { name, phone, title, yearsOfExperience, education } = req.body;
            const profilePicture = req.file;
            const email = req.instructor?.email;
            if (!email) {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Email not found" });
            }
            const updatedUser = await this._instructorAuthService.updateProfileService(email, {
                name,
                phone,
                title,
                yearsOfExperience,
                education,
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
        const instructorId = req.instructor?.id;
        if (!instructorId) {
            res
                .status(statusCodes_1.httpStatus.NOT_FOUND)
                .json({ message: "Instructor not found" });
            return;
        }
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const search = req.query.search || "";
            const { courses, total, totalPages } = await this._instructorAuthService.getCoursesByInstructor(instructorId, page, limit, search);
            res.status(statusCodes_1.httpStatus.OK).json({
                courses,
                total,
                currentPage: page,
                totalPages,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCategory(req, res) {
        try {
            const category = await this._instructorAuthService.getCategory();
            res.status(statusCodes_1.httpStatus.OK).json(category);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCoursesById(req, res) {
        try {
            const { courseId } = req.params;
            const course = await this._instructorAuthService.getCourseById(courseId);
            res.status(statusCodes_1.httpStatus.OK).json(course);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getInstructorReviews(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const rating = req.query.rating
                ? parseInt(req.query.rating)
                : 0;
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const review = await this._instructorAuthService.getReviewsByInstructor(instructorId, page, limit, rating);
            res.status(statusCodes_1.httpStatus.OK).json(review);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getEnrollments(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const status = req.query.status || "";
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const enrollments = await this._instructorAuthService.getEnrollments(instructorId, page, limit, search, status);
            res.status(statusCodes_1.httpStatus.OK).json(enrollments);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getWallet(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const { wallet, total, totalPages, transactions } = await this._instructorAuthService.getWallet(instructorId, page, limit);
            res.status(statusCodes_1.httpStatus.OK).json({
                balance: wallet?.balance,
                transactions: transactions,
                total,
                totalPages,
                currentPage: page,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async refreshToken(req, res) {
        console.log("Instructor refresh hit");
        console.log("Cookie token:", req.cookies.instructorRefreshToken);
        const token = req.cookies.instructorRefreshToken;
        if (!token) {
            res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            console.log("Decoded token:", decoded);
            if (decoded.role !== "instructor") {
                res.status(statusCodes_1.httpStatus.FORBIDDEN).json({ message: "Invalid role" });
                return;
            }
            const instructorsToken = (0, jwt_1.generateToken)(decoded._id, decoded.email, decoded.role);
            res.status(statusCodes_1.httpStatus.OK).json({ token: instructorsToken });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async logOut(req, res) {
        res.clearCookie("instructorRefreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: "learnat.serveftp.com",
            path: "/",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    async getPurchasedStudents(req, res) {
        try {
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "NO Instructors found" });
                return;
            }
            const users = await this._instructorAuthService.getPurchasedUsers(instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(users);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getCourseStats(req, res) {
        try {
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const stats = await this._instructorAuthService.getCouresStats(instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(stats);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getDashboard(req, res) {
        try {
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const data = await this._instructorAuthService.getDashboard(instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(data);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getNotifications(req, res) {
        try {
            const { userId } = req.params;
            const notifications = await this._instructorAuthService.getNotifications(userId);
            res.status(statusCodes_1.httpStatus.OK).json(notifications);
        }
        catch (err) {
            console.log(err);
        }
    }
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            await this._instructorAuthService.markAsRead(notificationId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async getIncomeStats(req, res) {
        try {
            const instructorId = req.instructor?.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            const incomeStats = await this._instructorAuthService.getIncomeStats(instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(incomeStats);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getUnreadCounts(req, res) {
        try {
            const { userId, userModel } = req.query;
            const counts = await this._messageService.getUnreadCounts(userId, userModel);
            res.status(statusCodes_1.httpStatus.OK).json(counts);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
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
    async createQuiz(req, res) {
        try {
            const instructor = req.instructor?.id;
            const { courseId } = req.params;
            if (!instructor) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "Not authorized" });
                return;
            }
            const transformedQuestions = req.body.questions.map((q) => ({
                questionText: q.questionText,
                options: q.options,
                explanation: q.explanation || "",
            }));
            const quizData = {
                ...req.body,
                courseId,
                instructorId: instructor,
                questions: transformedQuestions,
            };
            const quiz = await this._instructorAuthService.createQuiz(instructor, quizData, courseId);
            res
                .status(statusCodes_1.httpStatus.CREATED)
                .json({ message: "Quiz created successfully", quiz });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getQuizzes(req, res) {
        try {
            const instructor = req.instructor?.id;
            if (!instructor) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Instructor not found" });
                return;
            }
            const quiz = await this._instructorAuthService.getQuizzes(instructor);
            res.status(statusCodes_1.httpStatus.OK).json(quiz);
        }
        catch (err) {
            console.log(err);
        }
    }
    async deleteQuiz(req, res) {
        try {
            const instructor = req.instructor?.id;
            const { quizId } = req.params;
            if (!instructor) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Instructor not found" });
                return;
            }
            await this._instructorAuthService.deleteQuiz(quizId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Quiz deleted successfully" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async restoreQuiz(req, res) {
        try {
            const instructor = req.instructor?.id;
            const { quizId } = req.params;
            if (!instructor) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Instructor not found" });
                return;
            }
            await this._instructorAuthService.restoreQuiz(quizId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Quiz restored successfully" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async getQuiz(req, res) {
        try {
            const instructor = req.instructor?.id;
            const { quizId } = req.params;
            if (!instructor) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Instructor not found" });
                return;
            }
            const quiz = await this._instructorAuthService.getQuiz(quizId);
            res.status(statusCodes_1.httpStatus.OK).json(quiz);
        }
        catch (err) {
            console.log(err);
        }
    }
    async createSession(req, res) {
        try {
            const instructor = req.instructor?.id;
            const { courseId, startTime } = req.body;
            const session = await this._livesessionService.createSession(courseId, instructor, startTime);
            res.status(statusCodes_1.httpStatus.CREATED).json(session);
        }
        catch (error) {
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
        }
    }
    async getSessionToken(req, res) {
        try {
            const { sessionId, userId, role } = req.query;
            if (role !== "instructor" && role !== "user") {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ error: "Invalid role" });
                return;
            }
            const token = await this._livesessionService.generateToken(sessionId, userId, role);
            res.status(statusCodes_1.httpStatus.OK).json({ token });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateQuiz(req, res) {
        try {
            const { quizId } = req.params;
            const instructor = req.instructor?.id;
            const updateData = req.body;
            console.log(updateData);
            if (!instructor) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Instructor not found" });
                return;
            }
            await this._instructorAuthService.updateQuiz(quizId, updateData);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Quiz Updated Successfull" });
        }
        catch (err) {
            console.log(err);
        }
    }
    async endSession(req, res) {
        try {
            const { isLive, sessionId } = req.body;
            await this._livesessionService.endSession(isLive, sessionId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Session Ended" });
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.InstructorAuthController = InstructorAuthController;
