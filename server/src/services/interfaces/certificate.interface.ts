import { CertificateDTO } from "../../DTO/certificate.dto";

export interface ICertificateService {
  createCertificateForUser(
    user: { id: string; name: string },
    course: { id: string; title: string }
  ): Promise<CertificateDTO>;
}
