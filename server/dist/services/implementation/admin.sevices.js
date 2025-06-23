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
exports.AdminService = void 0;
const jwt_1 = require("../../utils/jwt");
const sendMail_1 = require("../../utils/sendMail");
class AdminService {
    constructor(_adminRepository, _instructorRepository, _userRepository, _categoryRepository, _courseRepository, _reviewRepository, _walletRepository) {
        this._adminRepository = _adminRepository;
        this._instructorRepository = _instructorRepository;
        this._userRepository = _userRepository;
        this._categoryRepository = _categoryRepository;
        this._courseRepository = _courseRepository;
        this._reviewRepository = _reviewRepository;
        this._walletRepository = _walletRepository;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepository.findAdminByEmail(email);
            if (!admin) {
                throw new Error("Admin not found");
            }
            if (admin.password !== password) {
                throw new Error("Password doesn't match");
            }
            const token = (0, jwt_1.generateToken)(admin._id.toString(), admin.email, "admin");
            return { token, email: admin.email };
        });
    }
    blockUnblockUser(email, blocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            console.log(user);
            if (!user) {
                throw new Error("User not found");
            }
            return yield this._adminRepository.updateUserBlockStatus(email, blocked);
        });
    }
    blockUnblockTutor(email, blocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this._instructorRepository.findByEmail(email);
            console.log(tutor);
            if (!tutor) {
                throw new Error("Tutor not found");
            }
            return yield this._adminRepository.updateTutorBlockStatus(email, blocked);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this._adminRepository.getAllUsers();
            return users;
        });
    }
    getAllTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            const instrcutors = yield this._adminRepository.getAllTutors();
            return instrcutors;
        });
    }
    verifyTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._instructorRepository.updateTutor(email, true, false, "active");
        });
    }
    rejectTutor(email, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._instructorRepository.findByEmail(email);
            if (!instructor) {
                throw new Error("Tutor not found");
            }
            instructor.isVerified = false;
            instructor.isRejected = true;
            instructor.accountStatus = "rejected";
            yield (0, sendMail_1.sendRejectionMail)(instructor.email, reason);
            return yield instructor.save();
        });
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield this._adminRepository.getTotalUsers();
            const totalTutors = yield this._adminRepository.getTotalTutors();
            return { totalUsers, totalTutors };
        });
    }
    addCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._categoryRepository.findCategory(name);
            if (category) {
                throw new Error("Category already exists");
            }
            return yield this._categoryRepository.createCategory(name);
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._categoryRepository.getCatgeories();
            if (!categories) {
                throw new Error("No categories found");
            }
            return categories;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._categoryRepository.findCategoryById(id);
            if (!category) {
                throw new Error("No category found");
            }
            return yield this._categoryRepository.deleteCategory(id);
        });
    }
    restoreCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._categoryRepository.findCategoryById(id);
            if (!category) {
                throw new Error("No category found");
            }
            return yield this._categoryRepository.restoreCategory(id);
        });
    }
    getCoursesService() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.findAll();
        });
    }
    softDeleteCourseS(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.updateCourseStatus(courseId, false);
        });
    }
    recoverCourseS(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.updateCourseStatus(courseId, true);
        });
    }
    getAllReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._reviewRepository.getAllReviews();
        });
    }
    hideReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this._reviewRepository.findReviewAndHide(id);
            if (!review) {
                throw new Error("Review not found");
            }
            return review;
        });
    }
    unhideReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this._reviewRepository.findReviewAndUnhide(id);
            if (!review) {
                throw new Error("Review not found");
            }
            return review;
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this._reviewRepository.deleteReview(id);
            if (!review) {
                throw new Error("Review not found");
            }
            return review;
        });
    }
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._walletRepository.findWalletOfAdmin();
            return wallet;
        });
    }
}
exports.AdminService = AdminService;
