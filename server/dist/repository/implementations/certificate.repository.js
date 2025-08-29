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
exports.CertificateRepository = void 0;
const certificateModel_1 = __importDefault(require("../../models/implementations/certificateModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class CertificateRepository {
    createCertificate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cert = yield certificateModel_1.default.create({
                user: new mongoose_1.default.Types.ObjectId(data.user),
                course: new mongoose_1.default.Types.ObjectId(data.course),
                certificateUrl: data.certificateUrl,
                issuedDate: new Date(),
            });
            console.log("Certificate saved:", cert);
            return cert;
        });
    }
    getCertificates(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificates = yield certificateModel_1.default.find({ user: userId }).populate("course", "title");
            return certificates.map((cert) => ({
                id: cert.id.toString(),
                user: userId,
                course: cert.course.toString(),
                courseTitle: cert.course.title,
                certificateUrl: cert.certificateUrl,
                issuedDate: cert.issuedDate,
            }));
        });
    }
}
exports.CertificateRepository = CertificateRepository;
