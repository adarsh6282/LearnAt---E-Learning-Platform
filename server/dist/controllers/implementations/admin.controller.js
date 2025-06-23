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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { token, email: adminEmail } = yield this._adminService.login(email, password);
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
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({
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
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({
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
                const users = yield this._adminService.getAllUsers();
                res.status(statusCodes_1.httpStatus.OK).json(users);
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
                const tutors = yield this._adminService.getAllTutors();
                res.status(statusCodes_1.httpStatus.OK).json(tutors);
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
                const category = yield this._adminService.getCategories();
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
                const courses = yield this._adminService.getCoursesService(page, limit);
                res.status(statusCodes_1.httpStatus.OK).json(courses);
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
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Course disabled successfully" });
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
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Course enabled successfully" });
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
                const reviews = yield this._adminService.getAllReviews();
                res.status(statusCodes_1.httpStatus.OK).json(reviews);
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    unhideReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const review = yield this._adminService.unhideReview(id);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Review retrieved successfully" });
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const review = this._adminService.deleteReview(id);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Review Deleted Successfully" });
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield this._adminService.getWallet();
                res.status(statusCodes_1.httpStatus.OK).json({ balance: wallet === null || wallet === void 0 ? void 0 : wallet.balance, transactions: wallet === null || wallet === void 0 ? void 0 : wallet.transactions });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
}
exports.AdminController = AdminController;
