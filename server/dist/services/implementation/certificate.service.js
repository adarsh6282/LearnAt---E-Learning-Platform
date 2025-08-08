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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const generateCertificate_1 = require("../../utils/generateCertificate");
class CertificateService {
    constructor(_certificateRepository) {
        this._certificateRepository = _certificateRepository;
    }
    createCertificateForUser(user, course) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfBuffer = yield (0, generateCertificate_1.generateCertificate)({
                name: user.name,
                course: course.title,
                date: new Date(),
            });
            console.log(pdfBuffer);
            const cloudinaryResponse = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, `${user.id}_${course.id}_certificate`);
            const newCertificate = yield this._certificateRepository.createCertificate({
                user: user.id,
                course: course.id,
                certificateUrl: cloudinaryResponse.secure_url,
                issuedDate: new Date(),
            });
            return newCertificate;
        });
    }
}
exports.CertificateService = CertificateService;
