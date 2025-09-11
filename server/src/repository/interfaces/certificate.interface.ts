import { ICertificate } from "../../models/interfaces/certificate.interface";

export interface ICertificateReopsitory {
  createCertificate(data: Partial<ICertificate>): Promise<ICertificate | null>;
  getCertificates(userId: string): Promise<{
    _id: string;
    user: string;
    course: string;
    courseTitle: string;
    certificateUrl: string;
    issuedDate: Date;
  }[]>;
}
