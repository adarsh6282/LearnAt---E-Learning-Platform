"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
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
        console.log(pdfBuffer);
        const cloudinaryResponse = (await (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, `${user.id}_${course.id}_certificate`));
        const newCertificate = await this._certificateRepository.createCertificate({
            user: user.id,
            course: course.id,
            certificateUrl: cloudinaryResponse.secure_url,
            issuedDate: new Date(),
        });
        return newCertificate;
    }
}
exports.CertificateService = CertificateService;
