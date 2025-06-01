"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpExpiry = void 0;
exports.default = generateOtp;
const otp_generator_1 = __importDefault(require("otp-generator"));
function generateOtp() {
    const otp = otp_generator_1.default.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    return otp;
}
exports.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
