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
const base_repository_1 = require("../base.repository");
class OtpRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(otpModel_1.default);
    }
    saveOTP(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let saveotp;
            const existing = yield this.model.findOne({ email: data.email });
            if (existing) {
                saveotp = yield this.model.findOneAndUpdate({ email: data.email }, { otp: data.otp, expiresAt: (_a = data.expiresAt) !== null && _a !== void 0 ? _a : new Date() }, { new: true });
            }
            else {
                saveotp = yield this.model.create({
                    email: data.email,
                    otp: data.otp,
                    expiresAt: (_b = data.expiresAt) !== null && _b !== void 0 ? _b : new Date(),
                });
            }
            return saveotp;
        });
    }
    findOtpbyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this.model.findOne({ email });
            return otp;
        });
    }
    deleteOtpbyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findOneAndDelete({ email });
        });
    }
}
exports.OtpRepository = OtpRepository;
