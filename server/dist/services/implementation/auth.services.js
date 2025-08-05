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
exports.AuthService = void 0;
const otpGenerator_1 = __importStar(require("../../utils/otpGenerator"));
const sendMail_1 = require("../../utils/sendMail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const razorpay_config_1 = __importDefault(require("../../config/razorpay.config"));
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    constructor(_userRepository, _otpRepository, _adminRepository, _instructorRepository, _courseRepository, _orderRepsitory, _progressRepository, _walletRepository, _complaintRepository, _notificationRepository) {
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
    }
    registerUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingAdmin = yield this._adminRepository.findAdminByEmail(email);
            if (existingAdmin) {
                throw new Error("This email is used by admin. Please register with new one");
            }
            const existingInstructor = yield this._instructorRepository.findByEmail(email);
            if (existingInstructor) {
                throw new Error("This email is used by instrcutor. Please register with new one");
            }
            const existingUser = yield this._userRepository.findByEmail(email);
            if (existingUser)
                throw new Error("User already exists");
            const otp = (0, otpGenerator_1.default)();
            yield this._otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry,
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield this._otpRepository.findOtpbyEmail(data.email);
            if (!otpRecord)
                throw new Error("OTP not found");
            if (otpRecord.otp !== data.otp)
                throw new Error("Invalid OTP");
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const user = yield this._userRepository.createUser(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            yield this._otpRepository.deleteOtpbyEmail(data.email);
            const token = (0, jwt_1.generateToken)(user._id, user.email, "user");
            const userRefreshToken = (0, jwt_1.generateRefreshToken)(user._id, user.email, "user");
            return { user, token, userRefreshToken };
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                throw new Error("user doesn't exist");
            }
            if (user.isBlocked) {
                throw new Error("User is blocked");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
            const token = (0, jwt_1.generateToken)(user._id, user.email, "user");
            const userRefreshToken = (0, jwt_1.generateRefreshToken)(user._id, user.email, "user");
            return { user, token, userRefreshToken };
        });
    }
    handleForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                throw new Error("No user found");
            }
            const otp = (0, otpGenerator_1.default)();
            yield this._otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry,
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
    verifyForgotOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield this._otpRepository.findOtpbyEmail(data.email);
            if (!otpRecord) {
                throw new Error("Couldn't find otp in email");
            }
            if (otpRecord.otp !== data.otp) {
                throw new Error("otp doesn't match");
            }
            return true;
        });
    }
    handleResetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(data.email);
            if (!user) {
                throw new Error("User not found");
            }
            if (data.newPassword !== data.confirmPassword) {
                throw new Error("Password didn't match");
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.newPassword, 10);
            user.password = hashedPassword;
            yield user.save();
            return true;
        });
    }
    handleResendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._otpRepository.findOtpbyEmail(email);
            if (!user) {
                throw new Error("NO user found");
            }
            const otp = (0, otpGenerator_1.default)();
            yield this._otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry,
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
    getProfileByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findForProfile(email);
            if (!user) {
                throw new Error("User not exist");
            }
            return user;
        });
    }
    updateProfileService(email_1, _a) {
        return __awaiter(this, arguments, void 0, function* (email, { name, phone, profilePicture, }) {
            const updateFields = { name, phone };
            if (profilePicture === null || profilePicture === void 0 ? void 0 : profilePicture.path) {
                const result = yield cloudinary_config_1.default.uploader.upload(profilePicture.path, {
                    folder: "profilePicture",
                    use_filename: true,
                    unique_filename: true,
                });
                updateFields.profilePicture = result.secure_url;
            }
            const user = yield this._userRepository.updateUserByEmail(email, updateFields);
            if (!user)
                throw new Error("User not found");
            return user;
        });
    }
    getCoursesService() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.findAll();
        });
    }
    findCourseByIdService(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error("course not found");
            }
            const isEnrolled = yield this._orderRepsitory.isUserEnrolled(courseId, userId);
            return {
                course: course.toObject(),
                isEnrolled,
            };
        });
    }
    createOrder(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error("Course dont't exist");
            }
            const existing = yield this._orderRepsitory.findExistingOrder({
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
            const razorpayOrder = yield razorpay_config_1.default.orders.create(options);
            const amount = course.price;
            const order = yield this._orderRepsitory.createOrderRecord({
                userId,
                courseId,
                amount: amount,
                currency: "INR",
                razorpayOrderId: razorpayOrder.id,
                status: "created",
            });
            return order;
        });
    }
    verifyPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, }) {
            var _b;
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                .update(body)
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new Error("Invalid signature");
            }
            const order = yield this._orderRepsitory.getOrderByRazorpayId(razorpay_order_id);
            if (!order)
                throw new Error("Order not found");
            yield this._orderRepsitory.markOrderAsPaid(order._id);
            const user = yield this._userRepository.findById(order.userId);
            yield this._courseRepository.addEnrolledUser(order.courseId.toString(), order.userId.toString());
            const course = yield this._courseRepository.findCourseById((_b = order.courseId) === null || _b === void 0 ? void 0 : _b.toString());
            if (!course || !course.instructor)
                throw new Error("Course or instructor not found");
            const instructorAmount = order.amount * 0.8;
            instructorAmount.toFixed(2);
            const adminCommission = order.amount * 0.2;
            adminCommission.toFixed(2);
            const courseId = typeof order.courseId === "string"
                ? order.courseId
                : order.courseId.toString();
            yield this._walletRepository.creditWallet({
                ownerType: "instructors",
                ownerId: course.instructor._id.toString(),
                courseId: courseId,
                amount: instructorAmount,
                description: `Credited for the course named ${course.title} by ${user === null || user === void 0 ? void 0 : user.name}`,
            });
            yield this._walletRepository.creditWallet({
                ownerType: "admin",
                courseId: courseId,
                amount: adminCommission,
                description: `Admin Commission for the course named ${course.title} by ${user === null || user === void 0 ? void 0 : user.name}`,
            });
            yield this._notificationRepository.createNotification({
                receiverId: course.instructor.id.toString(),
                receiverModel: "Instructor",
                message: `Your course "${course.title}" was purchased by ${user === null || user === void 0 ? void 0 : user.name}. ₹${instructorAmount.toFixed(2)} has been credited to your wallet.`
            });
            const admin = yield this._adminRepository.findOneAdmin();
            if (admin) {
                yield this._notificationRepository.createNotification({
                    receiverId: admin.id,
                    receiverModel: "Admin",
                    message: `The course "${course.title}" was purchased by ${user === null || user === void 0 ? void 0 : user.name}. ₹${adminCommission.toFixed(2)} credited to the Admin wallet.`
                });
            }
            return { success: true };
        });
    }
    updateLectureProgress(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            let progress = yield this._progressRepository.findProgress(userId, courseId);
            if (!progress)
                progress = yield this._progressRepository.createProgress(userId, courseId, lectureId);
            else {
                progress = yield this._progressRepository.addWatchedLecture(userId, courseId, lectureId);
            }
            const course = yield this._courseRepository.findCourseById(courseId);
            const totalLectures = course === null || course === void 0 ? void 0 : course.lectures.length;
            if (totalLectures &&
                (progress === null || progress === void 0 ? void 0 : progress.watchedLectures.length) === totalLectures &&
                !(progress === null || progress === void 0 ? void 0 : progress.isCompleted)) {
                yield this._progressRepository.markAsCompleted(userId, courseId);
            }
            return progress;
        });
    }
    getUserCourseProgress(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield this._progressRepository.findProgress(userId, courseId);
            return (progress === null || progress === void 0 ? void 0 : progress.watchedLectures) || [];
        });
    }
    fetchPurchasedInstructors(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructorIds = yield this._courseRepository.findByPurchasedUser(userId);
            if (!instructorIds.length)
                return [];
            return this._instructorRepository.findInstructorsByIds(instructorIds);
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._notificationRepository.getAllNotifications(userId);
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this._notificationRepository.updateNotification(notificationId);
            return notification;
        });
    }
    checkStatus(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isCompleted } = yield this._progressRepository.CheckStatus(userId, courseId);
            if (!isCompleted) {
                throw new Error("Course is not fully completed");
            }
            return isCompleted;
        });
    }
    submitComplaint(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._complaintRepository.createComplaint(data);
        });
    }
    getPurchases(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchases = yield this._orderRepsitory.getPurchases(userId, page, limit);
            return purchases;
        });
    }
}
exports.AuthService = AuthService;
