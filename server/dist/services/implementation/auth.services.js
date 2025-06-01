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
class AuthService {
    constructor(userRepository, otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    registerUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser)
                throw new Error("User already exists");
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
            if (!otpRecord)
                throw new Error("OTP not found");
            if (otpRecord.otp !== data.otp)
                throw new Error("Invalid OTP");
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const user = yield this.userRepository.createUser(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            yield this.otpRepository.deleteOtpbyEmail(data.email);
            return user;
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("user doesn't exist");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
            return { user };
        });
    }
    handleForgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("No user found");
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
            return true;
        });
    }
    handleResetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(data.email);
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
            const user = yield this.otpRepository.findOtpbyEmail(email);
            if (!user) {
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
exports.AuthService = AuthService;
