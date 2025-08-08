import Certificate from "../../models/implementations/certificateModel";
import { ICertificateReopsitory } from "../interfaces/certificate.interface";
import { ICertificate } from "../../models/interfaces/certificate.interface";

export class CertificateRepository implements ICertificateReopsitory {
  async createCertificate(data: Partial<ICertificate>): Promise<ICertificate | null> {
    return await Certificate.create(data);
  }

  async getCertificates(userId: string): Promise<{ id: string; user: string; course: string; courseTitle: string; certificateUrl: string; issuedDate: Date; }[]> {
      const certificates= await Certificate.find({user:userId}).populate("course","title")
      return certificates.map((cert)=>({
        id:cert.id.toString(),
        user:userId,
        course:cert.course.toString(),
        courseTitle:(cert.course as any).title,
        certificateUrl:cert.certificateUrl,
        issuedDate:cert.issuedDate
      }))
  }
}
