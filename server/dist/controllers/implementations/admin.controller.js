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
exports.AdminController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../utils/jwt");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { token, email: adminEmail, adminRefreshToken, } = yield this._adminService.login(email, password);
                res.cookie("adminRefreshToken", adminRefreshToken, {
                    path: "/api/admin",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Login successful", token, email: adminEmail });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield this._adminService.getDashboardData();
                res.status(statusCodes_1.httpStatus.OK).json(dashboardData);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    blockUnblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            const { blocked } = req.body;
            try {
                const updatedUser = yield this._adminService.blockUnblockUser(email, blocked);
                res.status(statusCodes_1.httpStatus.OK).json({
                    message: `Tutor has been ${blocked ? "blocked" : "unblocked"}`,
                    user: updatedUser,
                });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    blockUnblockTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            const { blocked } = req.body;
            try {
                const updatedTutor = yield this._adminService.blockUnblockTutor(email, blocked);
                res.status(statusCodes_1.httpStatus.OK).json({
                    message: `User has been ${blocked ? "blocked" : "unblocked"}`,
                    tutor: updatedTutor,
                });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const { users, total, totalPages } = yield this._adminService.getAllUsers(page, limit, search);
                console.log(users);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ users, total, totalPages, currentPage: page });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getAllTutors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const isVerified = req.query.isVerified;
                const search = req.query.search || "";
                const filter = {};
                if (isVerified === "true")
                    filter.isVerified = true;
                if (isVerified === "false")
                    filter.isVerified = false;
                if (search.trim() !== "") {
                    filter.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ];
                }
                const { tutors, total, totalPages } = yield this._adminService.getAllTutors(page, limit, filter);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ tutors, total, totalPages, currentPage: page });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    approveTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const approve = yield this._adminService.verifyTutor(email);
                res.status(statusCodes_1.httpStatus.OK).json("Tutor Approved Successfully");
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    rejectTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            const { reason } = req.body;
            try {
                const deleted = yield this._adminService.rejectTutor(email, reason);
                if (!deleted) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Tutor Not Found" });
                }
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Tutor rejected successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const category = yield this._adminService.addCategory(name);
                res
                    .status(statusCodes_1.httpStatus.CREATED)
                    .json({ message: "Category Added Successfully" });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getCatgeories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const status = req.query.status || "";
                const category = yield this._adminService.getCategories(page, limit, search, status);
                res.status(statusCodes_1.httpStatus.OK).json(category);
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this._adminService.deleteCategory(id);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Category disabled" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    restoreCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this._adminService.restoreCategory(id);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Category restored" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const { course, total, totalPage } = yield this._adminService.getCoursesService(page, limit, search);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ course: course, total, totalPage, currentPage: page });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    softDeleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updated = yield this._adminService.softDeleteCourseS(id);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Course disabled successfully" });
            }
            catch (error) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Soft delete failed", error });
            }
        });
    }
    recoverCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updated = yield this._adminService.recoverCourseS(id);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Course enabled successfully" });
            }
            catch (error) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Soft delete failed", error });
            }
        });
    }
    getAllReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const search = typeof req.query.search === "string" ? req.query.search : "";
                let rating = null;
                if (req.query.rating && req.query.rating !== "null") {
                    const parsed = parseInt(req.query.rating, 10);
                    if (!isNaN(parsed)) {
                        rating = parsed;
                    }
                }
                const sort = typeof req.query.sort === "string" ? req.query.sort : "desc";
                const { reviews, total, totalPages } = yield this._adminService.getAllReviews(page, limit, search, rating, sort);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ reviews, total, totalPages, currentPage: page });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    hideReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const review = yield this._adminService.hideReview(id);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Review hidden successfully" });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    unhideReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const review = yield this._adminService.unhideReview(id);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Review retrieved successfully" });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const review = this._adminService.deleteReview(id);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Review Deleted Successfully" });
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
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { wallet, total, totalPages, transactions } = yield this._adminService.getWallet(page, limit);
                res.status(statusCodes_1.httpStatus.OK).json({
                    balance: wallet.balance,
                    transactions,
                    total,
                    totalPages,
                    currentPage: page,
                });
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
            const token = req.cookies.adminRefreshToken;
            if (!token) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
                return;
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
                if (decoded.role !== "admin") {
                    res.status(statusCodes_1.httpStatus.FORBIDDEN).json({ message: "Invalid role" });
                    return;
                }
                const adminToken = (0, jwt_1.generateToken)(decoded._id, decoded.email, decoded.role);
                res.status(statusCodes_1.httpStatus.OK).json({ token: adminToken });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getComplaints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || "";
                const filter = req.query.status || "";
                const { complaints, total, totalPages } = yield this._adminService.getComplaints(page, limit, search, filter);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ complaints: complaints, total, totalPages, currentPage: page });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    responseComplaint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, response } = req.body;
                const { id } = req.params;
                const complaint = yield this._adminService.responseComplaint(id, status, response);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Response Submitted successfully" });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getCourseStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseStats = yield this._adminService.getCourseStats();
                res.status(statusCodes_1.httpStatus.OK).json(courseStats);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getIncomeStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const incomeStats = yield this._adminService.getIncomeStats();
                res.status(statusCodes_1.httpStatus.OK).json(incomeStats);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getSpecificCourseforAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            if (!courseId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Course not found" });
                return;
            }
            const course = yield this._adminService.getSpecificCourseForAdmin(courseId);
            res.status(statusCodes_1.httpStatus.OK).json(course);
        });
    }
    getSpecificTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tutor = yield this._adminService.getSpecificTutor(id);
                res.status(statusCodes_1.httpStatus.OK).json(tutor);
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
                const notifications = yield this._adminService.getNotifications(userId);
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
                const notification = yield this._adminService.markAsRead(notificationId);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("adminRefreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/admin",
            });
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Logged out successfully" });
        });
    }
}
exports.AdminController = AdminController;
