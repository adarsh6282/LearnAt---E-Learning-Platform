import { IOtpRepository } from "../interfaces/otp.interface";
import { IOtp } from "../../models/interfaces/otp.interface";
import Otp from "../../models/implementations/otpModel";
import { BaseRepository } from "../base.repository";

export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  constructor() {
    super(Otp);
  }

  async saveOTP(data: {
    email: string;
    otp: string;
    expiresAt?: Date;
  }): Promise<IOtp | null> {
    let saveotp: IOtp | null;
    const existing = await this.model.findOne({ email: data.email });

    if (existing) {
      saveotp = await this.model.findOneAndUpdate(
        { email: data.email },
        { otp: data.otp, expiresAt: data.expiresAt ?? new Date() },
        { new: true }
      );
    } else {
      saveotp = await this.model.create({
        email: data.email,
        otp: data.otp,
        expiresAt: data.expiresAt ?? new Date(),
      });
    }

    return saveotp;
  }

  async findOtpbyEmail(email: string): Promise<IOtp | null> {
    const otp = await this.model.findOne({ email });
    return otp;
  }

  async deleteOtpbyEmail(email: string): Promise<void> {
    await this.model.findOneAndDelete({ email });
  }
}
