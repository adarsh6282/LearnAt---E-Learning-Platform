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
exports.InstructorAuthSerivce = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGenerator_1 = __importStar(require("../../utils/otpGenerator"));
const sendMail_1 = require("../../utils/sendMail");
const generateToken_1 = require("../../utils/generateToken");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
class InstructorAuthSerivce {
    constructor(_instructorAuthRepository, _otpRepository, _adminRepository, _userRepository, _courseRepository) {
        this._instructorAuthRepository = _instructorAuthRepository;
        this._otpRepository = _otpRepository;
        this._adminRepository = _adminRepository;
        this._userRepository = _userRepository;
        this._courseRepository = _courseRepository;
    }
    registerInstructor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingAdmin = yield this._adminRepository.findAdminByEmail(email);
            if (existingAdmin) {
                throw new Error("This email is used by admin. Please register with new one");
            }
            const existingUser = yield this._userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error("This email is used by user. Please register with new one");
            }
            const existing = yield this._instructorAuthRepository.findByEmail(email);
            if (existing) {
                throw new Error("Instructor already exists");
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
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield this._otpRepository.findOtpbyEmail(data.email);
            if (!otpRecord)
                throw new Error("OTP not found");
            if (otpRecord.otp !== data.otp) {
                throw new Error("Invalid OTP");
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const instructor = yield this._instructorAuthRepository.createInstructor(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            yield this._otpRepository.deleteOtpbyEmail(data.email);
            const token = (0, generateToken_1.generateToken)(instructor._id, instructor.email);
            return { instructor, token };
        });
    }
    loginInstructor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._instructorAuthRepository.findByEmail(email);
            if (!instructor) {
                throw new Error("Instructor not registered");
            }
            if (instructor.isBlocked) {
                throw new Error("Instructor is blocked");
            }
            const isMatch = yield bcrypt_1.default.compare(password, instructor.password);
            if (!isMatch) {
                throw new Error("Passowrd doesn't match");
            }
            const token = (0, generateToken_1.generateToken)(instructor._id, instructor.email);
            return { instructor, token };
        });
    }
    handleForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._instructorAuthRepository.findByEmail(email);
            if (!instructor) {
                throw new Error("No Instructor found");
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
            yield this._otpRepository.deleteOtpbyEmail(data.email);
            return true;
        });
    }
    handleResetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._instructorAuthRepository.findByEmail(data.email);
            if (!instructor) {
                throw new Error("User not found");
            }
            if (data.newPassword !== data.confirmPassword) {
                throw new Error("Password didn't match");
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.newPassword, 10);
            instructor.password = hashedPassword;
            yield instructor.save();
            return true;
        });
    }
    handleResendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._otpRepository.findOtpbyEmail(email);
            if (!instructor) {
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
    getProfileService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this._instructorAuthRepository.findForProfile(email);
            if (!instructor) {
                throw new Error("Inbstructor not exist");
            }
            return instructor;
        });
    }
    updateProfileService(email_1, _a) {
        return __awaiter(this, arguments, void 0, function* (email, { name, phone, title, yearsOfExperience, education, profilePicture, }) {
            const updateFields = { name, phone, title, yearsOfExperience, education };
            if (profilePicture === null || profilePicture === void 0 ? void 0 : profilePicture.path) {
                const result = yield cloudinary_config_1.default.uploader.upload(profilePicture.path, {
                    folder: "profilePicture",
                    use_filename: true,
                    unique_filename: true,
                });
                updateFields.profilePicture = result.secure_url;
            }
            const instructor = yield this._instructorAuthRepository.updateInstructorByEmail(email, updateFields);
            if (!instructor)
                throw new Error("Instructor not found");
            return instructor;
        });
    }
    getCoursesByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._courseRepository.findCoursesByInstructor(instructorId);
        });
    }
}
exports.InstructorAuthSerivce = InstructorAuthSerivce;
