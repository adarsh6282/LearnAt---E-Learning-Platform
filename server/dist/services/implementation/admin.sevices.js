"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const jwt_1 = require("../../utils/jwt");
const sendMail_1 = require("../../utils/sendMail");
const user_mapper_1 = require("../../Mappers/user.mapper");
const instructor_mapper_1 = require("../../Mappers/instructor.mapper");
const course_mapper_1 = require("../../Mappers/course.mapper");
const category_mapper_1 = require("../../Mappers/category.mapper");
const review_mapper_1 = require("../../Mappers/review.mapper");
const complaint_mapper_1 = require("../../Mappers/complaint.mapper");
const notification_mapper_1 = require("../../Mappers/notification.mapper");
class AdminService {
    constructor(_adminRepository, _instructorRepository, _userRepository, _categoryRepository, _courseRepository, _reviewRepository, _walletRepository, _complaintRepository, _notificationRepository) {
        this._adminRepository = _adminRepository;
        this._instructorRepository = _instructorRepository;
        this._userRepository = _userRepository;
        this._categoryRepository = _categoryRepository;
        this._courseRepository = _courseRepository;
        this._reviewRepository = _reviewRepository;
        this._walletRepository = _walletRepository;
        this._complaintRepository = _complaintRepository;
        this._notificationRepository = _notificationRepository;
    }
    async login(email, password) {
        const admin = await this._adminRepository.findAdminByEmail(email);
        if (!admin) {
            throw new Error("Admin not found");
        }
        if (admin.password !== password) {
            throw new Error("Password doesn't match");
        }
        const token = (0, jwt_1.generateToken)(admin._id.toString(), admin.email, "admin");
        const adminRefreshToken = (0, jwt_1.generateRefreshToken)(admin._id.toString(), admin.email, "admin");
        return { token, email: admin.email, adminRefreshToken };
    }
    async blockUnblockUser(email, blocked) {
        const user = await this._userRepository.findByEmail(email);
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        const updateUser = await this._adminRepository.updateUserBlockStatus(email, blocked);
        if (!updateUser) {
            throw new Error("Failed to update user");
        }
        return (0, user_mapper_1.toUserDTO)(updateUser);
    }
    async blockUnblockTutor(email, blocked) {
        const tutor = await this._instructorRepository.findByEmail(email);
        console.log(tutor);
        if (!tutor) {
            throw new Error("Tutor not found");
        }
        const updateTutor = await this._adminRepository.updateTutorBlockStatus(email, blocked);
        if (!updateTutor) {
            throw new Error("Failed to update tutor");
        }
        return (0, instructor_mapper_1.toInstructorDTO)(updateTutor);
    }
    async getAllUsers(page, limit, search) {
        const { users, total, totalPages } = await this._adminRepository.getAllUsers(page, limit, search);
        return { users: (0, user_mapper_1.toUserDTOList)(users), total, totalPages };
    }
    async getAllTutors(page, limit, filter) {
        const { tutors, total, totalPages } = await this._adminRepository.getAllTutors(page, limit, filter);
        return { tutors: (0, instructor_mapper_1.toInstructorDTOList)(tutors), total, totalPages };
    }
    async verifyTutor(email) {
        return await this._instructorRepository.updateTutor(email, true, false, "active");
    }
    async rejectTutor(email, reason) {
        const instructor = await this._instructorRepository.findByEmail(email);
        if (!instructor) {
            throw new Error("Tutor not found");
        }
        instructor.isVerified = false;
        instructor.isRejected = true;
        instructor.accountStatus = "rejected";
        await (0, sendMail_1.sendRejectionMail)(instructor.email, reason);
        return await instructor.save();
    }
    async getDashboardData() {
        return await this._adminRepository.getDashboardData();
    }
    async addCategory(name) {
        const category = await this._categoryRepository.findCategory(name);
        if (category) {
            throw new Error("Category already exists");
        }
        return await this._categoryRepository.createCategory(name);
    }
    async getCategories(page, limit, search, status) {
        const { category, total, totalPages } = await this._categoryRepository.getCatgeories(page, limit, search, status);
        if (!category) {
            throw new Error("No categories found");
        }
        return { category: (0, category_mapper_1.toCategoryDTOList)(category), total, totalPages };
    }
    async deleteCategory(id) {
        const category = await this._categoryRepository.findCategoryById(id);
        if (!category) {
            throw new Error("No category found");
        }
        return await this._categoryRepository.deleteCategory(id);
    }
    async restoreCategory(id) {
        const category = await this._categoryRepository.findCategoryById(id);
        if (!category) {
            throw new Error("No category found");
        }
        return await this._categoryRepository.restoreCategory(id);
    }
    async getCoursesService(page, limit, search) {
        const { course, total, totalPage } = await this._courseRepository.findAllCourse(page, limit, search);
        return { course: (0, course_mapper_1.toCourseDTOList)(course), total, totalPage };
    }
    async softDeleteCourseS(courseId) {
        return await this._courseRepository.updateCourseStatus(courseId, false);
    }
    async recoverCourseS(courseId) {
        return await this._courseRepository.updateCourseStatus(courseId, true);
    }
    async getAllReviews(page, limit, search, rating, sort) {
        const { reviews, total, totalPages } = await this._reviewRepository.getAllReviews(page, limit, search, rating, sort);
        return { reviews: (0, review_mapper_1.toReviewDTOList)(reviews), total, totalPages };
    }
    async hideReview(id) {
        const review = await this._reviewRepository.findReviewAndHide(id);
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    }
    async unhideReview(id) {
        const review = await this._reviewRepository.findReviewAndUnhide(id);
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    }
    async deleteReview(id) {
        const review = await this._reviewRepository.deleteReview(id);
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    }
    async getWallet(page, limit) {
        const { wallet, total, totalPages, transactions } = await this._walletRepository.findWalletOfAdmin(page, limit);
        return { wallet, total, totalPages, transactions };
    }
    async getComplaints(page, limit, search, filter) {
        const { complaints, total, totalPages } = await this._complaintRepository.getComplaints(page, limit, search, filter);
        return { complaints: (0, complaint_mapper_1.toComplaintDTOList)(complaints), total, totalPages };
    }
    async responseComplaint(id, status, response) {
        if (!response || response.trim() == "") {
            throw new Error("Please fill in a response");
        }
        const complaint = await this._complaintRepository.updateComplaint(id, status, response);
        return complaint;
    }
    async getCourseStats() {
        return await this._courseRepository.getCourseStats();
    }
    async getIncomeStats() {
        return await this._walletRepository.getIncomeStats();
    }
    async getSpecificCourseForAdmin(courseId) {
        const course = await this._courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        return (0, course_mapper_1.toCourseDTO)(course);
    }
    async getNotifications(userId) {
        const notification = await this._notificationRepository.getAllNotifications(userId);
        return (0, notification_mapper_1.toNotificationDTOList)(notification);
    }
    async markAsRead(notificationId) {
        const notification = await this._notificationRepository.updateNotification(notificationId);
        return notification;
    }
    async getSpecificTutor(id) {
        const tutor = await this._instructorRepository.findById(id);
        if (!tutor) {
            throw new Error("Tutor not found");
        }
        return (0, instructor_mapper_1.toInstructorDTO)(tutor);
    }
}
exports.AdminService = AdminService;
