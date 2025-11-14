import Certificate from "../../models/implementations/certificateModel";
import { ICertificateReopsitory } from "../interfaces/certificate.interface";
import { ICertificate } from "../../models/interfaces/certificate.interface";
import mongoose from "mongoose";

export class CertificateRepository implements ICertificateReopsitory {
  async createCertificate(
    data: Partial<ICertificate>
  ): Promise<ICertificate | null> {
    const cert = await Certificate.create({
      user: new mongoose.Types.ObjectId(data.user),
      course: new mongoose.Types.ObjectId(data.course),
      certificateUrl: data.certificateUrl,
      issuedDate: new Date(),
    });

    console.log("Certificate saved:", cert);
    return cert;
  }

  async getCertificates(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    certificates: {
      _id: string;
      user: string;
      course: string;
      courseTitle: string;
      certificateUrl: string;
      issuedDate: Date;
    }[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      Certificate.find({ user: userId })
        .populate<{
          course: { _id: mongoose.Types.ObjectId; title: string };
        }>("course", "title")
        .skip(skip)
        .limit(limit),
      Certificate.countDocuments(),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      certificates: certificates.map((cert) => ({
        _id: cert._id.toString(),
        user: userId,
        course: cert.course._id.toString(),
        courseTitle: cert.course.title,
        certificateUrl: cert.certificateUrl,
        issuedDate: cert.issuedDate,
      })),
      totalPages: totalPages,
    };
  }
}
