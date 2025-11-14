import otpGenerator from "otp-generator"

export default function generateOtp(){
    const otp=otpGenerator.generate(6,{
        digits:true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })
    return otp
}

export function generateOtpExpiry() {
  return new Date(Date.now() + 5 * 60 * 1000);
}