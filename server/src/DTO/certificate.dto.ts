import { Types } from "mongoose";

export interface CertificateDTO {
  _id: string;
  user: Types.ObjectId | string;
  course: Types.ObjectId | string;
  certificateUrl: string;
  issuedDate: Date;
}
