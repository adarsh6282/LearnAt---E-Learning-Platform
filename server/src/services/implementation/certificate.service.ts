import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { CertificateDTO } from "../../DTO/certificate.dto";
import { toCertificateDTO } from "../../Mappers/certificate.mapper";
import { ICertificateReopsitory } from "../../repository/interfaces/certificate.interface";
import { generateCertificate } from "../../utils/generateCertificate";
import { ICertificateService } from "../interfaces/certificate.interface";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
export class CertificateService implements ICertificateService {
  constructor(private _certificateRepository: ICertificateReopsitory) {}

  async createCertificateForUser(
    user: { id: string; name: string },
    course: { id: string; title: string }
  ): Promise<CertificateDTO> {
    const pdfBuffer = await generateCertificate({
      name: user.name,
      course: course.title,
      date: new Date(),
    });

    const cloudinaryResponse = (await uploadBufferToCloudinary(
      pdfBuffer,
      `${user.id}_${course.id}_certificate`
    )) as CloudinaryUploadResult

    const newCertificate = await this._certificateRepository.createCertificate({
      user: user.id,
      course: course.id,
      certificateUrl: cloudinaryResponse.secure_url,
      issuedDate: new Date(),
    });

    if(!newCertificate){
      throw new Error("failed to create certificate")
    }

    return toCertificateDTO(newCertificate);
  }
}
