"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorAuthSerivce = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGenerator_1 = __importStar(require("../../utils/otpGenerator"));
const sendMail_1 = require("../../utils/sendMail");
const jwt_1 = require("../../utils/jwt");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const instructor_mapper_1 = require("../../Mappers/instructor.mapper");
const course_mapper_1 = require("../../Mappers/course.mapper");
const review_mapper_1 = require("../../Mappers/review.mapper");
const notification_mapper_1 = require("../../Mappers/notification.mapper");
const category_mapper_1 = require("../../Mappers/category.mapper");
const user_mapper_1 = require("../../Mappers/user.mapper");
class InstructorAuthSerivce {
    constructor(_instructorAuthRepository, _otpRepository, _adminRepository, _userRepository, _courseRepository, _reviewRepository, _orderRepository, _walletRepository, _categoryRepository, _notificationRepository) {
        this._instructorAuthRepository = _instructorAuthRepository;
        this._otpRepository = _otpRepository;
        this._adminRepository = _adminRepository;
        this._userRepository = _userRepository;
        this._courseRepository = _courseRepository;
        this._reviewRepository = _reviewRepository;
        this._orderRepository = _orderRepository;
        this._walletRepository = _walletRepository;
        this._categoryRepository = _categoryRepository;
        this._notificationRepository = _notificationRepository;
    }
    async registerInstructor(email) {
        const existingAdmin = await this._adminRepository.findAdminByEmail(email);
        if (existingAdmin) {
            throw new Error("This email is used by admin. Please register with new one");
        }
        const existingUser = await this._userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("This email is used by user. Please register with new one");
        }
        const existing = await this._instructorAuthRepository.findByEmail(email);
        if (existing) {
            throw new Error("Instructor already exists");
        }
        const otp = (0, otpGenerator_1.default)();
        await this._otpRepository.saveOTP({
            email: email,
            otp: otp,
            expiresAt: otpGenerator_1.otpExpiry,
        });
        await (0, sendMail_1.sendMail)(email, otp);
    }
    async verifyOtp(data) {
        const otpRecord = await this._otpRepository.findOtpbyEmail(data.email);
        if (!otpRecord)
            throw new Error("OTP not found");
        if (otpRecord.otp !== data.otp) {
            throw new Error("Invalid OTP");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const instructor = await this._instructorAuthRepository.createInstructor({
            ...data,
            password: hashedPassword,
            resume: data.resume,
        });
        await this._otpRepository.deleteOtpbyEmail(data.email);
        const token = (0, jwt_1.generateToken)(instructor._id, instructor.email, "instructor");
        const instructorRefreshToken = (0, jwt_1.generateRefreshToken)(instructor._id, instructor.email, "instructor");
        return { instructor: (0, instructor_mapper_1.toInstructorDTO)(instructor), token, instructorRefreshToken };
    }
    async reApplyS(email, resume) {
        const instructor = await this._instructorAuthRepository.findByEmail(email);
        if (!instructor)
            throw new Error("Instructor not found");
        const updatedData = {
            resume: resume,
            isVerified: false,
            isRejected: false,
            accountStatus: "pending",
        };
        const updated = await this._instructorAuthRepository.updateInstructor(instructor.email, updatedData);
        if (!updated) {
            throw new Error("failed to reapply");
        }
        return (0, instructor_mapper_1.toInstructorDTO)(updated);
    }
    async loginInstructor(email, password) {
        const instructor = await this._instructorAuthRepository.findByEmail(email);
        if (!instructor) {
            throw new Error("Instructor not registered");
        }
        if (instructor.isBlocked) {
            throw new Error("Instructor is blocked");
        }
        const isMatch = await bcrypt_1.default.compare(password, instructor.password);
        if (!isMatch) {
            throw new Error("Passowrd doesn't match");
        }
        const token = (0, jwt_1.generateToken)(instructor._id, instructor.email, "instructor");
        const instructorRefreshToken = (0, jwt_1.generateRefreshToken)(instructor._id, instructor.email, "instructor");
        return { instructor: (0, instructor_mapper_1.toInstructorDTO)(instructor), token, instructorRefreshToken };
    }
    async handleForgotPassword(email) {
        const instructor = await this._instructorAuthRepository.findByEmail(email);
        if (!instructor) {
            throw new Error("No Instructor found");
        }
        const otp = (0, otpGenerator_1.default)();
        await this._otpRepository.saveOTP({
            email: email,
            otp: otp,
            expiresAt: otpGenerator_1.otpExpiry,
        });
        await (0, sendMail_1.sendMail)(email, otp);
    }
    async verifyForgotOtp(data) {
        const otpRecord = await this._otpRepository.findOtpbyEmail(data.email);
        if (!otpRecord) {
            throw new Error("Couldn't find otp in email");
        }
        if (otpRecord.otp !== data.otp) {
            throw new Error("otp doesn't match");
        }
        await this._otpRepository.deleteOtpbyEmail(data.email);
        return true;
    }
    async handleResetPassword(data) {
        const instructor = await this._instructorAuthRepository.findByEmail(data.email);
        if (!instructor) {
            throw new Error("User not found");
        }
        if (data.newPassword !== data.confirmPassword) {
            throw new Error("Password didn't match");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
        instructor.password = hashedPassword;
        await instructor.save();
        return true;
    }
    async handleResendOtp(email) {
        const instructor = await this._otpRepository.findOtpbyEmail(email);
        if (!instructor) {
            throw new Error("NO instructor found");
        }
        const otp = (0, otpGenerator_1.default)();
        await this._otpRepository.saveOTP({
            email: email,
            otp: otp,
            expiresAt: otpGenerator_1.otpExpiry,
        });
        await (0, sendMail_1.sendMail)(email, otp);
    }
    async getProfileService(email) {
        const instructor = await this._instructorAuthRepository.findForProfile(email);
        if (!instructor) {
            throw new Error("Inbstructor not exist");
        }
        return (0, instructor_mapper_1.toInstructorDTO)(instructor);
    }
    async updateProfileService(email, { name, phone, title, yearsOfExperience, education, profilePicture, }) {
        const updateFields = {
            name,
            phone,
            title,
            yearsOfExperience,
            education,
        };
        if (profilePicture?.path) {
            const result = await cloudinary_config_1.default.uploader.upload(profilePicture.path, {
                folder: "profilePicture",
                use_filename: true,
                unique_filename: true,
            });
            updateFields.profilePicture = result.secure_url;
        }
        const instructor = await this._instructorAuthRepository.updateInstructorByEmail(email, updateFields);
        if (!instructor)
            throw new Error("Instructor not found");
        return (0, instructor_mapper_1.toInstructorDTO)(instructor);
    }
    async getCoursesByInstructor(instructorId, page, limit, search) {
        const { courses, total, totalPages } = await this._courseRepository.findCoursesByInstructor(instructorId, page, limit, search);
        return { courses: (0, course_mapper_1.toCourseDTOList)(courses), total, totalPages };
    }
    async getCourseById(courseId) {
        const course = await this._courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("No Course Found");
        }
        return (0, course_mapper_1.toCourseDTO)(course);
    }
    async getCategory() {
        const categories = await this._categoryRepository.getCatgeoriesInstructor();
        if (!categories) {
            throw new Error("No categories found");
        }
        return (0, category_mapper_1.toCategoryDTOList)(categories);
    }
    async getReviewsByInstructor(instructorId, page, limit, rating) {
        const { reviews, total, totalPages } = await this._reviewRepository.getReviewsByInstructor(instructorId, page, limit, rating);
        return { reviews: (0, review_mapper_1.toReviewDTOList)(reviews), total, totalPages };
    }
    async getEnrollments(instructorId, page, limit, search, status) {
        const enrollments = await this._orderRepository.getEnrollmentsByInstructor(instructorId, page, limit, search, status);
        return enrollments;
    }
    async getWallet(instructorId, page, limit) {
        const wallet = await this._walletRepository.findWalletOfInstructor(instructorId, page, limit);
        if (!wallet) {
            throw new Error("No wallet found for the instructor");
        }
        return wallet;
    }
    async getCouresStats(instructorId) {
        return await this._courseRepository.getCourseStatsOfInstructor(instructorId);
    }
    async getDashboard(instructorId) {
        return await this._instructorAuthRepository.getDashboard(instructorId);
    }
    async getIncomeStats(instructorId) {
        return await this._walletRepository.getIncome(instructorId);
    }
    async getNotifications(userId) {
        const notification = await this._notificationRepository.getAllNotifications(userId);
        return (0, notification_mapper_1.toNotificationDTOList)(notification);
    }
    async markAsRead(notificationId) {
        const notification = await this._notificationRepository.updateNotification(notificationId);
        if (!notification) {
            throw new Error("failed to update notification");
        }
        return (0, notification_mapper_1.toNotificationDTO)(notification);
    }
    async getPurchasedUsers(instructorId) {
        const userIds = await this._courseRepository.getUsersByInstructor(instructorId);
        if (!userIds.length)
            return [];
        const users = await this._userRepository.findUsersByIds(userIds);
        return (0, user_mapper_1.toUserDTOList)(users);
    }
}
exports.InstructorAuthSerivce = InstructorAuthSerivce;
