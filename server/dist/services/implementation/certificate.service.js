"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
class CertificateService {
    constructor(_certificateRepository) {
        this._certificateRepository = _certificateRepository;
    }
    async createCertificate(data) {
        const base64 = `data:${data.file.mimetype};base64,${data.file.buffer.toString("base64")}`;
        const uploadResult = await cloudinary_config_1.default.uploader.upload(base64, {
            folder: "certificates",
            format: "pdf",
        });
        const cert = await this._certificateRepository.createCertificate({
            user: data.user,
            course: data.course,
            certificateUrl: uploadResult.secure_url,
        });
        return cert;
    }
}
exports.CertificateService = CertificateService;
