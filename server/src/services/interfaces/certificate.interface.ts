// import { CertificateDTO } from "../../DTO/certificate.dto";
import { ICertificate } from "../../models/interfaces/certificate.interface";

export interface ICertificateService {
  createCertificate(data: { user: string; course: string; file: Express.Multer.File }):Promise<ICertificate|null>
}
