"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRejectionMail = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendMail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Verify your Account`,
        html: `<p>We received a request to verify your account. Your One-Time Password (OTP) is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #edf2f7; border: 1px dashed #cbd5e0; border-radius: 6px; padding: 15px 30px;">
                        <span style="font-family: 'Courier New', monospace; font-size: 28px; font-weight: bold; color: #3182ce; letter-spacing: 5px;">${otp}</span>
                    </div>
                </div>
                <p style="text-align: center;">This code will expire in 5 minutes.</p>`
    };
    await transporter.sendMail(mailOptions);
};
exports.sendMail = sendMail;
const sendRejectionMail = async (email, reason) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Tutor Application Rejected`,
        html: `
      <p>We regret to inform you that your tutor application has been rejected.</p>
      <p><strong>Reason:</strong></p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="display: inline-block; background-color: #fef2f2; border: 1px dashed #f87171; border-radius: 6px; padding: 15px 30px;">
          <span style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #b91c1c;">${reason}</span>
        </div>
      </div>
      <p style="text-align: center;">If you believe this is a mistake or want more details, please contact support.</p>
    `
    };
    await transporter.sendMail(mailOptions);
};
exports.sendRejectionMail = sendRejectionMail;
