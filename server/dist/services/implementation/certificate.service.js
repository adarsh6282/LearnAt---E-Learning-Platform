"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const certificate_mapper_1 = require("../../Mappers/certificate.mapper");
const generateCertificate_1 = require("../../utils/generateCertificate");
class CertificateService {
    constructor(_certificateRepository) {
        this._certificateRepository = _certificateRepository;
    }
    async createCertificateForUser(user, course) {
        const pdfBuffer = await (0, generateCertificate_1.generateCertificate)({
            name: user.name,
            course: course.title,
            date: new Date(),
        });
        const cloudinaryResponse = (await (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, `${user.id}_${course.id}_certificate`));
        const newCertificate = await this._certificateRepository.createCertificate({
            user: user.id,
            course: course.id,
            certificateUrl: cloudinaryResponse.secure_url,
            issuedDate: new Date(),
        });
        if (!newCertificate) {
            throw new Error("failed to create certificate");
        }
        return (0, certificate_mapper_1.toCertificateDTO)(newCertificate);
    }
}
exports.CertificateService = CertificateService;
