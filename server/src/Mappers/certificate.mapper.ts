import { CertificateDTO } from "../DTO/certificate.dto";
import { ICertificate } from "../models/interfaces/certificate.interface";

export const toCertificateDTO=(certificate:ICertificate):CertificateDTO=>{
    return{
        _id:certificate._id.toString(),
        user:certificate.user,
        course:certificate.course,
        certificateUrl:certificate.certificateUrl,
        issuedDate:certificate.issuedDate
    }
}

export const toCertificateDTOList=(certificates:ICertificate[]):CertificateDTO[]=>{
    return certificates.map(toCertificateDTO)
}