import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})


export const sendMail=async(email:string,otp:string)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:`Verify your Account`,
        html:`<p>We received a request to verify your account. Your One-Time Password (OTP) is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #edf2f7; border: 1px dashed #cbd5e0; border-radius: 6px; padding: 15px 30px;">
                        <span style="font-family: 'Courier New', monospace; font-size: 28px; font-weight: bold; color: #3182ce; letter-spacing: 5px;">${otp}</span>
                    </div>
                </div>
                <p style="text-align: center;">This code will expire in 5 minutes.</p>`
    }

    await transporter.sendMail(mailOptions)
}

export const sendRejectionMail = async (email: string, reason: string) => {
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
