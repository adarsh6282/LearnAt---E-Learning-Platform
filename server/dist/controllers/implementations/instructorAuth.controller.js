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
exports.InstructorAuthController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const fs_1 = __importDefault(require("fs"));
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../utils/jwt");
class InstructorAuthController {
    constructor(_instructorAuthService) {
        this._instructorAuthService = _instructorAuthService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, username, email, phone, education, title, yearsOfExperience, password, confirmPassword, } = req.body;
                const resumeFile = req.file;
                if (!resumeFile) {
                    throw new Error("Resume file is missing");
                }
                const cloudResult = yield cloudinary_config_1.default.uploader.upload(resumeFile.path, {
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
                yield this._instructorAuthService.registerInstructor(email);
                res.status(statusCodes_1.httpStatus.OK).json({
                    message: "Form received, resume uploaded, OTP sent",
                    data: updatedPayload,
                });
            }
            catch (err) {
                console.error(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    reApply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resumeFile = req.file;
                if (!resumeFile) {
                    return;
                }
                const { email } = req.body;
                console.log(email);
                const cloudResult = yield cloudinary_config_1.default.uploader.upload(resumeFile.path, {
                    folder: "resumes",
                    resource_type: "auto",
                });
                const resumeUrl = cloudResult.secure_url;
                const updatedInstructor = yield this._instructorAuthService.reApplyS(email, resumeUrl);
                res.status(statusCodes_1.httpStatus.OK).json({
                    message: "Reapplied successfully",
                    instructor: updatedInstructor,
                });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Reapply failed", error: err.message });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { instructor, token, instructorRefreshToken } = yield this._instructorAuthService.loginInstructor(email, password);
                res.cookie("instructorRefreshToken", instructorRefreshToken, {
                    path: "/api/instructors",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(statusCodes_1.httpStatus.OK).json({ instructor, token });
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
                const instructorData = req.body;
                const { instructor, token, instructorRefreshToken } = yield this._instructorAuthService.verifyOtp(instructorData);
                res.cookie("instructorRefreshToken", instructorRefreshToken, {
                    path: "/api/instructors",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(statusCodes_1.httpStatus.CREATED).json({
                    instructor,
                    token,
                    message: "Instructor Registered Successfully, Waiting for approval",
                });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._instructorAuthService.handleForgotPassword(email);
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
                const userData = yield this._instructorAuthService.verifyForgotOtp(data);
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
                yield this._instructorAuthService.handleResetPassword(data);
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
                yield this._instructorAuthService.handleResendOtp(email);
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
                const email = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.email;
                if (!email)
                    return;
                const instructor = yield this._instructorAuthService.getProfileService(email);
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
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, phone, title, yearsOfExperience, education } = req.body;
                const profilePicture = req.file;
                const email = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Email not found" });
                }
                const updatedUser = yield this._instructorAuthService.updateProfileService(email, {
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
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
            if (!instructorId) {
                res
                    .status(statusCodes_1.httpStatus.NOT_FOUND)
                    .json({ message: "Instructor not found" });
                return;
            }
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const { courses, total, totalPages } = yield this._instructorAuthService.getCoursesByInstructor(instructorId, page, limit);
                res.status(statusCodes_1.httpStatus.OK).json({
                    courses,
                    total,
                    currentPage: page,
                    totalPages,
                });
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
                const category = yield this._instructorAuthService.getCategory();
                res.status(statusCodes_1.httpStatus.OK).json(category);
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getCoursesById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const course = yield this._instructorAuthService.getCourseById(courseId);
                res.status(statusCodes_1.httpStatus.OK).json(course);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getInstructorReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res
                        .status(statusCodes_1.httpStatus.NOT_FOUND)
                        .json({ message: "Instructor not found" });
                    return;
                }
                const review = yield this._instructorAuthService.getReviewsByInstructor(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(review);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getEnrollments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res
                        .status(statusCodes_1.httpStatus.NOT_FOUND)
                        .json({ message: "Instructor not found" });
                    return;
                }
                const enrollments = yield this._instructorAuthService.getEnrollments(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(enrollments);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res
                        .status(statusCodes_1.httpStatus.NOT_FOUND)
                        .json({ message: "Instructor not found" });
                    return;
                }
                const wallet = yield this._instructorAuthService.getWallet(instructorId);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ balance: wallet === null || wallet === void 0 ? void 0 : wallet.balance, transactions: wallet === null || wallet === void 0 ? void 0 : wallet.transactions });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("instructorRefreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/instructors",
            });
            res.status(200).json({ message: "Logged out successfully" });
        });
    }
    getPurchasedStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "NO Instructors found" });
                    return;
                }
                const users = yield this._instructorAuthService.getPurchasedUsers(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(users);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getCourseStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res
                        .status(statusCodes_1.httpStatus.NOT_FOUND)
                        .json({ message: "Instructor not found" });
                    return;
                }
                const stats = yield this._instructorAuthService.getCouresStats(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(stats);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Instructor not found" });
                    return;
                }
                const data = yield this._instructorAuthService.getDashboard(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(data);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const notifications = yield this._instructorAuthService.getNotifications(userId);
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
                const notification = yield this._instructorAuthService.markAsRead(notificationId);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getIncomeStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
                if (!instructorId) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Instructor not found" });
                    return;
                }
                const incomeStats = yield this._instructorAuthService.getIncomeStats(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(incomeStats);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.InstructorAuthController = InstructorAuthController;
