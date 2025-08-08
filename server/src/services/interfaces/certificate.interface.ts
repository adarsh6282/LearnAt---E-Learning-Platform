import { ICertificate } from "../../models/interfaces/certificate.interface";

export interface ICertificateService {
  createCertificateForUser(
    user: { id: string; name: string },
    course: { id: string; title: string }
  ): Promise<Partial<ICertificate> | null>;
}
