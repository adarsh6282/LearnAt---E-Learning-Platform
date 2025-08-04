import instructorApi from "./instructorApiService";
import userApi from "./userApiService";

export const forgotPasswordS = async (role: string, email: string) => {
  const selectedApi=role==="users"?userApi:instructorApi
  return await selectedApi.post(`/${role}/forgotpassword`, {
    email: email,
  });
};

export const forgotVerifyOtpS = async (role:string,email:string,otp:string) => {
  const selectedApi=role==="users"?userApi:instructorApi
  return await selectedApi.post(`/${role}/reset-verify-otp`, {
    email,
    otp,
  });
};

export const resendOtpS=async(role:string,email:string)=>{
  const selectedApi=role==="users"?userApi:instructorApi
    return await selectedApi.post(`/${role}/resend-otp`, { email: email });
}

