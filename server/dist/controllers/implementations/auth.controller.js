"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authcontroller = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const jwt_1 = require("../../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authcontroller {
    constructor(_authService, _messageService) {
        this._authService = _authService;
        this._messageService = _messageService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._authService.registerUser(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Otp sent successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, token, userRefreshToken } = yield this._authService.loginUser(email, password);
                res.cookie("userRefreshToken", userRefreshToken, {
                    httpOnly: true,
                    path: "/api/users",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ user, token, message: "User Login Successfull" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const { user, token, userRefreshToken } = yield this._authService.verifyOtp(userData);
                res.cookie("userRefreshToken", userRefreshToken, {
                    path: "/api/users",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res
                    .status(statusCodes_1.httpStatus.CREATED)
                    .json({ user, token, message: "User Registered Successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Authentication failed" });
                return;
            }
            const { id, email } = req.user;
            const token = (0, jwt_1.generateToken)(id, email, "user");
            const redirectUrl = process.env.GOOGLE_VERIFY_URL;
            res.redirect(`${redirectUrl}?token=${token}`);
        });
    }
    verifyGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            if (!token)
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Token missing" });
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Verified", user: decoded });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._authService.handleForgotPassword(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP Sent Successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userData = yield this._authService.verifyForgotOtp(data);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP verified." });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                yield this._authService.handleResetPassword(data);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Password resetted successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    resentOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                yield this._authService.handleResendOtp(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP resent Successsfully!" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email)
                    return;
                const user = yield this._authService.getProfileByEmail(email);
                res.status(statusCodes_1.httpStatus.OK).json(user);
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, phone } = req.body;
                const profilePicture = req.file;
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Email not found" });
                }
                const updatedUser = yield this._authService.updateProfileService(email, {
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
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const category = req.query.category || "";
                const minPrice = parseInt(req.query.minPrice) || 0;
                const maxPrice = parseInt(req.query.maxPrice) || 10000;
                const { courses, total, totalPages } = yield this._authService.getCoursesService(page, limit, search, category, minPrice, maxPrice);
                res.status(statusCodes_1.httpStatus.OK).json({ courses: courses, total, totalPages });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this._authService.getCategory();
                res.status(statusCodes_1.httpStatus.OK).json(category);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    findCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return;
            }
            try {
                const { course, isEnrolled } = yield this._authService.findCourseByIdService(courseId, userId);
                res.status(statusCodes_1.httpStatus.OK).json({ course, isEnrolled });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    buyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const order = yield this._authService.createOrder(courseId, userId);
                res.status(statusCodes_1.httpStatus.OK).json(order);
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
            }
        });
    }
    verifyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._authService.verifyPayment(req.body);
                res.status(statusCodes_1.httpStatus.OK).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ error: err.message });
            }
        });
    }
    markLectureWatched(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const { lectureId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                const progress = yield this._authService.updateLectureProgress(userId, courseId, lectureId);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ watchedLectures: progress === null || progress === void 0 ? void 0 : progress.watchedLectures });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: err.message });
            }
        });
    }
    getCourseProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                const watchedLectures = yield this._authService.getUserCourseProgress(userId, courseId);
                res.status(statusCodes_1.httpStatus.OK).json({
                    success: true,
                    watchedLectures,
                });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({
                    success: false,
                    message: err.message,
                });
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "NO user found" });
                return;
            }
            const isCompleted = yield this._authService.checkStatus(userId, courseId);
            res.status(statusCodes_1.httpStatus.OK).json(isCompleted);
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("userRefreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/api/users",
            });
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Logged out successfully" });
        });
    }
    getPurchasedInstructors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "user not found" });
                    return;
                }
                const instructors = yield this._authService.fetchPurchasedInstructors(userId);
                res.status(statusCodes_1.httpStatus.OK).json(instructors);
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Error fetching instructors", error });
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const notifications = yield this._authService.getNotifications(userId);
                res.status(statusCodes_1.httpStatus.OK).json(notifications);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    markAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                const notification = yield this._authService.markAsRead(notificationId);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    submitComplaint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { type, subject, message, targetId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                const complaint = yield this._authService.submitComplaint({
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
        });
    }
    getPurchases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                const { purchases, total, totalPages } = yield this._authService.getPurchases(userId, page, limit);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ purchases: purchases, total, totalPages, currentPage: page });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "User not found" });
                    return;
                }
                const { oldPassword, newPassword, confirmPassword } = req.body;
                yield this._authService.changePassword(userId, oldPassword, newPassword, confirmPassword);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Password changed successfully" });
            }
            catch (error) {
                console.log(error);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: error.message });
            }
        });
    }
    courseInstructorView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructorId = req.params.instructorId;
                const instructor = yield this._authService.getSpecificInstructor(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(instructor);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    purchasedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "user not found" });
                    return;
                }
                const { purchasedCourses, total, totalPages } = yield this._authService.purchasedCourses(userId, page, limit);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ purchasedCourses, total, totalPages, currentPage: page });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                if (!user) {
                    res
                        .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                        .json({ message: "user not authorized" });
                    return;
                }
                const certificates = yield this._authService.getCertificates(user, page, limit);
                res.status(statusCodes_1.httpStatus.OK).json(certificates);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    markRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                const { userId, userModel } = req.body;
                yield this._messageService.markRead(chatId, userId, userModel);
                res.sendStatus(200);
            }
            catch (err) {
                res.status(500).json({ error: "Failed to mark messages as read" });
            }
        });
    }
    getUnreadCounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, userModel } = req.query;
                const counts = yield this._messageService.getUnreadCounts(userId, userModel);
                res.json(counts);
            }
            catch (err) {
                res.status(500).json({ error: "Failed to fetch unread counts" });
            }
        });
    }
}
exports.Authcontroller = Authcontroller;
