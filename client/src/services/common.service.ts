import axiosInstance from "./apiService";

export const forgotPasswordS = async (role: string, email: string) => {
  return await axiosInstance.post(`/${role}/forgotpassword`, {
    email: email,
  });
};

export const forgotVerifyOtpS = async (role:string,email:string,otp:string) => {
  return await axiosInstance.post(`/${role}/reset-verify-otp`, {
    email,
    otp,
  });
};

export const resendOtpS=async(role:string,email:string)=>{
    return await axiosInstance.post(`/${role}/resend-otp`, { email: email });
}

