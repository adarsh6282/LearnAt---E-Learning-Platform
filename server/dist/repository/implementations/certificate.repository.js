"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateRepository = void 0;
const certificateModel_1 = __importDefault(require("../../models/implementations/certificateModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class CertificateRepository {
    async createCertificate(data) {
        const cert = await certificateModel_1.default.create({
            user: new mongoose_1.default.Types.ObjectId(data.user),
            course: new mongoose_1.default.Types.ObjectId(data.course),
            certificateUrl: data.certificateUrl,
            issuedDate: new Date(),
        });
        console.log("Certificate saved:", cert);
        return cert;
    }
    async getCertificates(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [certificates, total] = await Promise.all([
            certificateModel_1.default.find({ user: userId })
                .populate("course", "title")
                .skip(skip)
                .limit(limit),
            certificateModel_1.default.countDocuments(),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            certificates: certificates.map((cert) => ({
                _id: cert._id.toString(),
                user: userId,
                course: cert.course._id.toString(),
                courseTitle: cert.course.title,
                certificateUrl: cert.certificateUrl,
                issuedDate: cert.issuedDate,
            })),
            totalPages: totalPages,
        };
    }
}
exports.CertificateRepository = CertificateRepository;
