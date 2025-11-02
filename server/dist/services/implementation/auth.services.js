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
exports.AuthService = void 0;
const otpGenerator_1 = __importStar(require("../../utils/otpGenerator"));
const sendMail_1 = require("../../utils/sendMail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const razorpay_config_1 = __importDefault(require("../../config/razorpay.config"));
const crypto_1 = __importDefault(require("crypto"));
const socket_1 = require("../../socket/socket");
const user_mapper_1 = require("../../Mappers/user.mapper");
const instructor_mapper_1 = require("../../Mappers/instructor.mapper");
const course_mapper_1 = require("../../Mappers/course.mapper");
const order_mapper_1 = require("../../Mappers/order.mapper");
const progress_mapper_1 = require("../../Mappers/progress.mapper");
const notification_mapper_1 = require("../../Mappers/notification.mapper");
const complaint_mapper_1 = require("../../Mappers/complaint.mapper");
class AuthService {
    constructor(_userRepository, _otpRepository, _adminRepository, _instructorRepository, _courseRepository, _orderRepsitory, _progressRepository, _walletRepository, _complaintRepository, _notificationRepository, _certificateRepository, _categoryRepository, _quizRepository, _quizResultRepository, _livesessionRepository) {
        this._userRepository = _userRepository;
        this._otpRepository = _otpRepository;
        this._adminRepository = _adminRepository;
        this._instructorRepository = _instructorRepository;
        this._courseRepository = _courseRepository;
        this._orderRepsitory = _orderRepsitory;
        this._progressRepository = _progressRepository;
        this._walletRepository = _walletRepository;
        this._complaintRepository = _complaintRepository;
        this._notificationRepository = _notificationRepository;
        this._certificateRepository = _certificateRepository;
        this._categoryRepository = _categoryRepository;
        this._quizRepository = _quizRepository;
        this._quizResultRepository = _quizResultRepository;
        this._livesessionRepository = _livesessionRepository;
    }
    async registerUser(email) {
        const existingAdmin = await this._adminRepository.findAdminByEmail(email);
        if (existingAdmin) {
            throw new Error("This email is used by admin. Please register with new one");
        }
        const existingInstructor = await this._instructorRepository.findByEmail(email);
        if (existingInstructor) {
            throw new Error("This email is used by instrcutor. Please register with new one");
        }
        const existingUser = await this._userRepository.findByEmail(email);
        if (existingUser)
            throw new Error("User already exists");
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
        if (otpRecord.otp !== data.otp)
            throw new Error("Invalid OTP");
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await this._userRepository.createUser({
            ...data,
            password: hashedPassword,
        });
        await this._otpRepository.deleteOtpbyEmail(data.email);
        const token = (0, jwt_1.generateToken)(user._id, user.email, "user");
        const userRefreshToken = (0, jwt_1.generateRefreshToken)(user._id, user.email, "user");
        return { user, token, userRefreshToken };
    }
    async loginUser(email, password) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error("user doesn't exist");
        }
        if (user.isBlocked) {
            throw new Error("User is blocked");
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const token = (0, jwt_1.generateToken)(user._id, user.email, "user");
        const userRefreshToken = (0, jwt_1.generateRefreshToken)(user._id, user.email, "user");
        return { user: (0, user_mapper_1.toUserDTO)(user), token, userRefreshToken };
    }
    async handleForgotPassword(email) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error("No user found");
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
        return true;
    }
    async handleResetPassword(data) {
        const user = await this._userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error("User not found");
        }
        if (data.newPassword !== data.confirmPassword) {
            throw new Error("Password didn't match");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return true;
    }
    async handleResendOtp(email) {
        const user = await this._otpRepository.findOtpbyEmail(email);
        if (!user) {
            throw new Error("NO user found");
        }
        const otp = (0, otpGenerator_1.default)();
        await this._otpRepository.saveOTP({
            email: email,
            otp: otp,
            expiresAt: otpGenerator_1.otpExpiry,
        });
        await (0, sendMail_1.sendMail)(email, otp);
    }
    async getProfileByEmail(email) {
        const user = await this._userRepository.findForProfile(email);
        if (!user) {
            throw new Error("User not exist");
        }
        return (0, user_mapper_1.toUserDTO)(user);
    }
    async updateProfileService(email, { name, phone, profilePicture, }) {
        const updateFields = { name, phone };
        if (profilePicture?.path) {
            const result = await cloudinary_config_1.default.uploader.upload(profilePicture.path, {
                folder: "profilePicture",
                use_filename: true,
                unique_filename: true,
            });
            updateFields.profilePicture = result.secure_url;
        }
        const user = await this._userRepository.updateUserByEmail(email, updateFields);
        if (!user)
            throw new Error("User not found");
        return (0, user_mapper_1.toUserDTO)(user);
    }
    async getCoursesService(page, limit, search, category, minPrice, maxPrice) {
        const { courses, total, totalPages } = await this._courseRepository.findCourses(page, limit, search, category, minPrice, maxPrice);
        return { courses: (0, course_mapper_1.toCourseDTOList)(courses), total, totalPages };
    }
    async getCategory() {
        return await this._categoryRepository.getCategory();
    }
    async findCourseByIdService(courseId, userId) {
        const course = await this._courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("course not found");
        }
        const isEnrolled = await this._orderRepsitory.isUserEnrolled(courseId, userId);
        return {
            course: (0, course_mapper_1.toCourseDTO)(course),
            isEnrolled,
        };
    }
    async createOrder(courseId, userId) {
        const course = await this._courseRepository.findCourseById(courseId);
        if (!course) {
            throw new Error("Course dont't exist");
        }
        const existing = await this._orderRepsitory.findExistingOrder({
            userId,
            courseId,
            status: { $in: ["created", "paid"] },
        });
        if (existing) {
            throw new Error("Course is purchased or payment in progress");
        }
        const options = {
            amount: course.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const razorpayOrder = await razorpay_config_1.default.orders.create(options);
        const amount = course.price;
        const order = await this._orderRepsitory.createOrderRecord({
            userId,
            courseId,
            amount: amount,
            currency: "INR",
            razorpayOrderId: razorpayOrder.id,
            status: "created",
        });
        if (!order) {
            throw new Error("failed to create order");
        }
        return (0, order_mapper_1.toOrderDTO)(order);
    }
    async cancelOrder(orderId) {
        const order = await this._orderRepsitory.getOrderById(orderId);
        if (!order)
            throw new Error("Order not found");
        if (order.status === "paid")
            throw new Error("Cannot cancel a paid order");
        const updated = await this._orderRepsitory.cancelOrder(orderId, "failed");
        if (!updated) {
            throw new Error("failed to update the order");
        }
        return (0, order_mapper_1.toOrderDTO)(updated);
    }
    async retryPayment(orderId) {
        const existingOrder = await this._orderRepsitory.getOrderById(orderId);
        if (!existingOrder) {
            throw new Error("Order not found");
        }
        if (existingOrder.status === "paid") {
            throw new Error("Order already paid");
        }
        const course = await this._courseRepository.findCourseById(existingOrder.courseId.toString());
        if (!course)
            throw new Error("Course not found");
        const razorPayOrder = await razorpay_config_1.default.orders.create({
            amount: existingOrder.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });
        const updatedOrder = await this._orderRepsitory.updateOrderForRetry(existingOrder._id.toString(), razorPayOrder.id);
        if (!updatedOrder) {
            throw new Error("failed to retry the order");
        }
        return (0, order_mapper_1.toOrderDTO)(updatedOrder);
    }
    async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, }) {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            throw new Error("Invalid signature");
        }
        const order = await this._orderRepsitory.getOrderByRazorpayId(razorpay_order_id);
        if (!order)
            throw new Error("Order not found");
        await this._orderRepsitory.markOrderAsPaid(order._id);
        const user = await this._userRepository.findById(order.userId);
        await this._courseRepository.addEnrolledUser(order.courseId.toString(), order.userId.toString());
        const course = await this._courseRepository.findCourseById(order.courseId?.toString());
        if (!course || !course.instructor)
            throw new Error("Course or instructor not found");
        const instructorAmount = order.amount * 0.8;
        instructorAmount.toFixed(2);
        const adminCommission = order.amount * 0.2;
        adminCommission.toFixed(2);
        const courseId = typeof order.courseId === "string"
            ? order.courseId
            : order.courseId.toString();
        await this._walletRepository.creditWallet({
            ownerType: "instructors",
            ownerId: course.instructor._id.toString(),
            courseId: courseId,
            amount: instructorAmount,
            description: `Credited for the course named ${course.title} by ${user?.name}`,
        });
        await this._walletRepository.creditWallet({
            ownerType: "admin",
            courseId: courseId,
            amount: adminCommission,
            description: `Admin Commission for the course named ${course.title} by ${user?.name}`,
        });
        await this._notificationRepository.createNotification({
            receiverId: course.instructor.id.toString(),
            receiverModel: "Instructor",
            message: `Your course "${course.title}" was purchased by ${user?.name}. ₹${instructorAmount.toFixed(2)} has been credited to your wallet.`,
        });
        (0, socket_1.sendNotificationToUser)(course.instructor.id.toString(), "you have new notification");
        await this._notificationRepository.createNotification({
            receiverId: user?.id.toString(),
            receiverModel: "User",
            message: `Your Purchased course "${course.title}" of rupees ${course.price}`,
        });
        (0, socket_1.sendNotificationToUser)(user?.id.toString(), "you have new notification");
        const admin = await this._adminRepository.findOneAdmin();
        if (admin) {
            await this._notificationRepository.createNotification({
                receiverId: admin.id,
                receiverModel: "Admin",
                message: `The course "${course.title}" was purchased by ${user?.name}. ₹${adminCommission.toFixed(2)} credited to the Admin wallet.`,
            });
            (0, socket_1.sendNotificationToUser)(admin.id.toString(), "you have new notification");
        }
        return { success: true };
    }
    async getPreviousOrder(userId, courseId) {
        const order = await this._orderRepsitory.getPreviousOrder(userId, courseId);
        if (!order) {
            throw new Error("failed to get previous order");
        }
        return (0, order_mapper_1.toOrderDTO)(order);
    }
    async updateLectureProgress(userId, courseId, lectureId) {
        let progress = await this._progressRepository.findProgress(userId, courseId);
        if (!progress)
            progress = await this._progressRepository.createProgress(userId, courseId, lectureId);
        else {
            progress = await this._progressRepository.addWatchedLecture(userId, courseId, lectureId);
        }
        const course = await this._courseRepository.findCourseById(courseId);
        const totalLectures = course?.modules?.reduce((moduleAcc, mod) => {
            const chapterLectures = mod.chapters?.reduce((chapAcc, chap) => chapAcc + (chap.lectures?.length ?? 0), 0);
            return moduleAcc + (chapterLectures ?? 0);
        }, 0) ?? 0;
        if (totalLectures &&
            progress?.watchedLectures.length === totalLectures &&
            !progress?.isCompleted) {
            await this._progressRepository.markAsCompleted(userId, courseId);
        }
        if (!progress) {
            throw new Error("failed to update progress");
        }
        return (0, progress_mapper_1.toProgressDTO)(progress);
    }
    async getUserCourseProgress(userId, courseId) {
        const progress = await this._progressRepository.findProgress(userId, courseId);
        if (!progress) {
            throw new Error("failed to fetch progress");
        }
        return (0, progress_mapper_1.toProgressDTO)(progress);
    }
    async fetchPurchasedInstructors(userId) {
        const instructorIds = await this._courseRepository.findByPurchasedUser(userId);
        if (!instructorIds.length)
            return [];
        return this._instructorRepository.findInstructorsByIds(instructorIds);
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
    async checkStatus(userId, courseId) {
        const { isCompleted } = await this._progressRepository.CheckStatus(userId, courseId);
        if (!isCompleted) {
            throw new Error("Course is not fully completed");
        }
        return isCompleted;
    }
    async submitComplaint(data) {
        const complaint = await this._complaintRepository.createComplaint(data);
        if (!complaint) {
            throw new Error("failed to submit complaint");
        }
        return (0, complaint_mapper_1.toComplaintDTO)(complaint);
    }
    async getPurchases(userId, page, limit) {
        const purchases = await this._orderRepsitory.getPurchases(userId, page, limit);
        return purchases;
    }
    async changePassword(userId, oldPassword, newPassword, confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new Error("Please fill in all fields");
        }
        if (newPassword != confirmPassword) {
            throw new Error("new password and confirm password dont match");
        }
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old password is incorrect");
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this._userRepository.updatePassword(userId, hashedPassword);
    }
    async getSpecificInstructor(instructorId) {
        const instructor = await this._instructorRepository.findById(instructorId);
        if (!instructor) {
            throw new Error("No Instructor Found");
        }
        return (0, instructor_mapper_1.toInstructorDTO)(instructor);
    }
    async purchasedCourses(userId, page, limit) {
        return await this._orderRepsitory.purchasedCourses(userId, page, limit);
    }
    async getCertificates(userId) {
        return await this._certificateRepository.getCertificates(userId);
    }
    async getQuiz(courseId) {
        if (!courseId) {
            throw new Error("no course found");
        }
        const quiz = await this._quizRepository.findQuizByCouseId(courseId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz;
    }
    async submitQuiz(quizId, userId, courseId, answers) {
        const quiz = await this._quizRepository.findQuizById(quizId);
        if (!quiz)
            throw new Error("Quiz not found");
        let score = 0;
        quiz.questions.forEach((q) => {
            if (!q._id)
                return;
            const selected = answers[q._id];
            const correct = q.options.find((o) => o.isCorrect);
            if (selected && correct && selected === correct.text) {
                score++;
            }
        });
        const percentage = Math.floor((score / quiz.questions.length) * 100);
        const passed = percentage >= quiz.passPercentage;
        const isCertificateIssued = passed;
        await this._quizResultRepository.create({
            quizId,
            userId,
            courseId,
            answers,
            score,
            percentage,
            passed,
            isCertificateIssued: passed,
        });
        await this._progressRepository.makeCertificateIssued(userId, courseId, isCertificateIssued);
        return { score, percentage, passed, isCertificateIssued };
    }
}
exports.AuthService = AuthService;
