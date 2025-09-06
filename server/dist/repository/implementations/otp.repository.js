"use strict";
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
    async saveOTP(data) {
        let saveotp;
        const existing = await this.model.findOne({ email: data.email });
        if (existing) {
            saveotp = await this.model.findOneAndUpdate({ email: data.email }, { otp: data.otp, expiresAt: data.expiresAt ?? new Date() }, { new: true });
        }
        else {
            saveotp = await this.model.create({
                email: data.email,
                otp: data.otp,
                expiresAt: data.expiresAt ?? new Date(),
            });
        }
        return saveotp;
    }
    async findOtpbyEmail(email) {
        const otp = await this.model.findOne({ email });
        return otp;
    }
    async deleteOtpbyEmail(email) {
        await this.model.findOneAndDelete({ email });
    }
}
exports.OtpRepository = OtpRepository;
