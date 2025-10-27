import cloudinary from "../../config/cloudinary.config";
// import { CertificateDTO } from "../../DTO/certificate.dto";
// import { toCertificateDTO } from "../../Mappers/certificate.mapper";
import { ICertificate } from "../../models/interfaces/certificate.interface";
import { ICertificateReopsitory } from "../../repository/interfaces/certificate.interface";
import { ICertificateService } from "../interfaces/certificate.interface";

export class CertificateService implements ICertificateService {
  constructor(private _certificateRepository: ICertificateReopsitory) {}

  async createCertificate(
    data: { user: string; course: string; file: Express.Multer.File }
  ): Promise<ICertificate | null> {
    const base64 = `data:${data.file.mimetype};base64,${data.file.buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
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
