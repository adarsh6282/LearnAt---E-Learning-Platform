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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const otpModel_1 = __importDefault(require("../../models/implementations/otpModel"));
class OtpRepository {
    saveOTP(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let saveotp;
            const existing = yield otpModel_1.default.findOne({ email: data.email });
            if (existing) {
                saveotp = yield otpModel_1.default.findOneAndUpdate({ email: data.email }, { otp: data.otp, expiresAt: new Date() }, { new: true });
            }
            else {
                saveotp = yield otpModel_1.default.create(data);
            }
            return saveotp;
        });
    }
    findOtpbyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield otpModel_1.default.findOne({ email });
            return otp;
        });
    }
    deleteOtpbyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otpModel_1.default.findOneAndDelete({ email });
        });
    }
}
exports.OtpRepository = OtpRepository;
