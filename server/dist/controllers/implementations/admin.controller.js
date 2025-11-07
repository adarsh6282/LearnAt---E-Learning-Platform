"use strict";
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
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, email: adminEmail, adminRefreshToken, } = await this._adminService.login(email, password);
            res.cookie("adminRefreshToken", adminRefreshToken, {
                path: "/api/admin",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: Number(process.env.COOKIE_MAXAGE),
            });
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Login successful", token, email: adminEmail });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getDashboard(req, res) {
        try {
            const dashboardData = await this._adminService.getDashboardData();
            res.status(statusCodes_1.httpStatus.OK).json(dashboardData);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async blockUnblockUser(req, res) {
        const { email } = req.params;
        const { blocked } = req.body;
        try {
            const updatedUser = await this._adminService.blockUnblockUser(email, blocked);
            res.status(statusCodes_1.httpStatus.OK).json({
                message: `Tutor has been ${blocked ? "blocked" : "unblocked"}`,
                user: updatedUser,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async blockUnblockTutor(req, res) {
        const { email } = req.params;
        const { blocked } = req.body;
        try {
            const updatedTutor = await this._adminService.blockUnblockTutor(email, blocked);
            res.status(statusCodes_1.httpStatus.OK).json({
                message: `User has been ${blocked ? "blocked" : "unblocked"}`,
                tutor: updatedTutor,
            });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const { users, total, totalPages } = await this._adminService.getAllUsers(page, limit, search);
            console.log(users);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ users, total, totalPages, currentPage: page });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getAllTutors(req, res) {
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
            const { tutors, total, totalPages } = await this._adminService.getAllTutors(page, limit, filter);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ tutors, total, totalPages, currentPage: page });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async approveTutor(req, res) {
        const { email } = req.body;
        try {
            await this._adminService.verifyTutor(email);
            res.status(statusCodes_1.httpStatus.OK).json("Tutor Approved Successfully");
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async rejectTutor(req, res) {
        const { email } = req.params;
        const { reason } = req.body;
        try {
            const deleted = await this._adminService.rejectTutor(email, reason);
            if (!deleted) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Tutor Not Found" });
            }
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Tutor rejected successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async addCategory(req, res) {
        try {
            const { name } = req.body;
            await this._adminService.addCategory(name);
            res
                .status(statusCodes_1.httpStatus.CREATED)
                .json({ message: "Category Added Successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: message });
        }
    }
    async getCatgeories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const status = req.query.status || "";
            const category = await this._adminService.getCategories(page, limit, search, status);
            res.status(statusCodes_1.httpStatus.OK).json(category);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: message });
        }
    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await this._adminService.deleteCategory(id);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Category disabled" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async restoreCategory(req, res) {
        try {
            const { id } = req.params;
            await this._adminService.restoreCategory(id);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Category restored" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCourses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const { course, total, totalPage } = await this._adminService.getCoursesService(page, limit, search);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ course: course, total, totalPage, currentPage: page });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async softDeleteCourse(req, res) {
        try {
            const { id } = req.params;
            await this._adminService.softDeleteCourseS(id);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Course disabled successfully" });
        }
        catch (error) {
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Soft delete failed", error });
        }
    }
    async recoverCourse(req, res) {
        try {
            const { id } = req.params;
            await this._adminService.recoverCourseS(id);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Course enabled successfully" });
        }
        catch (error) {
            res
                .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Soft delete failed", error });
        }
    }
    async getAllReviews(req, res) {
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
            const { reviews, total, totalPages } = await this._adminService.getAllReviews(page, limit, search, rating, sort);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ reviews, total, totalPages, currentPage: page });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async hideReview(req, res) {
        const { id } = req.params;
        try {
            await this._adminService.hideReview(id);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Review hidden successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async unhideReview(req, res) {
        const { id } = req.params;
        try {
            await this._adminService.unhideReview(id);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Review retrieved successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async deleteReview(req, res) {
        const { id } = req.params;
        try {
            await this._adminService.deleteReview(id);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Review Deleted Successfully" });
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
            const { wallet, total, totalPages, transactions } = await this._adminService.getWallet(page, limit);
            res.status(statusCodes_1.httpStatus.OK).json({
                balance: wallet.balance,
                transactions,
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
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getComplaints(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const filter = req.query.status || "";
            const { complaints, total, totalPages } = await this._adminService.getComplaints(page, limit, search, filter);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ complaints: complaints, total, totalPages, currentPage: page });
        }
        catch (err) {
            console.log(err);
        }
    }
    async responseComplaint(req, res) {
        try {
            const { status, response } = req.body;
            const { id } = req.params;
            await this._adminService.responseComplaint(id, status, response);
            res
                .status(statusCodes_1.httpStatus.OK)
                .json({ message: "Response Submitted successfully" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getCourseStats(req, res) {
        try {
            const courseStats = await this._adminService.getCourseStats();
            res.status(statusCodes_1.httpStatus.OK).json(courseStats);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getIncomeStats(req, res) {
        try {
            const incomeStats = await this._adminService.getIncomeStats();
            res.status(statusCodes_1.httpStatus.OK).json(incomeStats);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getSpecificCourseforAdmin(req, res) {
        try {
            const { courseId } = req.params;
            if (!courseId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Course not found" });
                return;
            }
            const course = await this._adminService.getSpecificCourseForAdmin(courseId);
            res.status(statusCodes_1.httpStatus.OK).json(course);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getSpecificTutor(req, res) {
        try {
            const { id } = req.params;
            const tutor = await this._adminService.getSpecificTutor(id);
            res.status(statusCodes_1.httpStatus.OK).json(tutor);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async getNotifications(req, res) {
        try {
            const { userId } = req.params;
            const notifications = await this._adminService.getNotifications(userId);
            res.status(statusCodes_1.httpStatus.OK).json(notifications);
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            await this._adminService.markAsRead(notificationId);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "Message Read" });
        }
        catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Something went wrong";
            res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message });
        }
    }
    async logOut(req, res) {
        res.clearCookie("adminRefreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/admin",
        });
        res.status(statusCodes_1.httpStatus.OK).json({ message: "Logged out successfully" });
    }
}
exports.AdminController = AdminController;
