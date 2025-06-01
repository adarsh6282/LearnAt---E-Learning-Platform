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
class InstructorAuthSerivce {
    constructor(instructorAuthRepository, otpRepository) {
        this.instructorAuthRepository = instructorAuthRepository;
        this.otpRepository = otpRepository;
    }
    registerInstructor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.instructorAuthRepository.findByEmail(email);
            if (existing) {
                throw new Error("Instructor already exists");
            }
            const otp = (0, otpGenerator_1.default)();
            yield this.otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield this.otpRepository.findOtpbyEmail(data.email);
            console.log(data.otp);
            console.log(otpRecord === null || otpRecord === void 0 ? void 0 : otpRecord.otp);
            if (!otpRecord)
                throw new Error("OTP not found");
            if (otpRecord.otp !== data.otp) {
                throw new Error("Invalid OTP");
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const instructor = yield this.instructorAuthRepository.createInstructor(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            yield this.otpRepository.deleteOtpbyEmail(data.email);
            return instructor;
        });
    }
    loginInstructor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.instructorAuthRepository.findByEmail(email);
            if (!instructor) {
                throw new Error("Instructor not registered");
            }
            const isMatch = yield bcrypt_1.default.compare(password, instructor.password);
            if (!isMatch) {
                throw new Error("Passowrd doesn't match");
            }
            return { instructor };
        });
    }
    handleForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.instructorAuthRepository.findByEmail(email);
            if (!instructor) {
                throw new Error("No Instructor found");
            }
            const otp = (0, otpGenerator_1.default)();
            yield this.otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
    verifyForgotOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield this.otpRepository.findOtpbyEmail(data.email);
            if (!otpRecord) {
                throw new Error("Couldn't find otp in email");
            }
            if (otpRecord.otp !== data.otp) {
                throw new Error("otp doesn't match");
            }
            yield this.otpRepository.deleteOtpbyEmail(data.email);
            return true;
        });
    }
    handleResetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.instructorAuthRepository.findByEmail(data.email);
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
            const instructor = yield this.otpRepository.findOtpbyEmail(email);
            if (!instructor) {
                throw new Error("NO user found");
            }
            const otp = (0, otpGenerator_1.default)();
            yield this.otpRepository.saveOTP({
                email: email,
                otp: otp,
                expiresAt: otpGenerator_1.otpExpiry
            });
            yield (0, sendMail_1.sendMail)(email, otp);
        });
    }
}
exports.InstructorAuthSerivce = InstructorAuthSerivce;
