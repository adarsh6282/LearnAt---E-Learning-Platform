import type { VerifyInstructor } from "../types/instructor.types";
import type { VerifyOtpResponse } from "../types/user.types";
import { createApi } from "./newApiService";

const userApi=createApi("user")
const instructorApi=createApi("instructor")

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

export const sentOtp=async(role:string,userData:any,otp:string)=>{
  const selectedApi=role==="users"?userApi:instructorApi
  return await selectedApi.post<
          VerifyOtpResponse | VerifyInstructor
        >(`/${role}/verify-otp`, {
          ...userData,
          otp,
        });
}