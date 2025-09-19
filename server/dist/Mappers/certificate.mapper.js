"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCertificateDTOList = exports.toCertificateDTO = void 0;
const toCertificateDTO = (certificate) => {
    return {
        _id: certificate._id.toString(),
        user: certificate.user,
        course: certificate.course,
        certificateUrl: certificate.certificateUrl,
        issuedDate: certificate.issuedDate
    };
};
exports.toCertificateDTO = toCertificateDTO;
const toCertificateDTOList = (certificates) => {
    return certificates.map(exports.toCertificateDTO);
};
exports.toCertificateDTOList = toCertificateDTOList;
