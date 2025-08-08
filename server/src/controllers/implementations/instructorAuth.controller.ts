import { IInstructorController } from "../interfaces/instructorAuth.interface";
import { IInstructorAuthService } from "../../services/interfaces/instructorAuth.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";
import fs from "fs";
import path from "path";
import cloudinary from "../../config/cloudinary.config";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import User from "../../models/implementations/userModel";

export class InstructorAuthController implements IInstructorController {
  constructor(private _instructorAuthService: IInstructorAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        username,
        email,
        phone,
        education,
        title,
        yearsOfExperience,
        password,
        confirmPassword,
      } = req.body;

      const resumeFile = req.file;

      if (!resumeFile) {
        throw new Error("Resume file is missing");
      }

      const cloudResult = await cloudinary.uploader.upload(resumeFile.path, {
        folder: "resumes",
        resource_type: "auto",
        format: "jpg",
      });

      const resume = cloudResult.secure_url;
      fs.unlinkSync(resumeFile.path);

      const updatedPayload = {
        name,
        username,
        email,
        phone,
        education,
        title,
        yearsOfExperience,
        password,
        confirmPassword,
        resume,
      };

      await this._instructorAuthService.registerInstructor(email);

      res.status(httpStatus.OK).json({
        message: "Form received, resume uploaded, OTP sent",
        data: updatedPayload,
      });
    } catch (err: any) {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async reApply(req: Request, res: Response): Promise<void> {
    try {
      const resumeFile = req.file;
      if (!resumeFile) {
        return;
      }

      const { email } = req.body;
      console.log(email);

      const cloudResult = await cloudinary.uploader.upload(resumeFile.path, {
        folder: "resumes",
        resource_type: "auto",
      });

      const resumeUrl = cloudResult.secure_url;

      const updatedInstructor = await this._instructorAuthService.reApplyS(
        email,
        resumeUrl
      );

      res.status(httpStatus.OK).json({
        message: "Reapplied successfully",
        instructor: updatedInstructor,
      });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Reapply failed", error: err.message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { instructor, token, instructorRefreshToken } =
        await this._instructorAuthService.loginInstructor(email, password);

      res.cookie("instructorRefreshToken", instructorRefreshToken, {
        path: "/api/instructors",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(httpStatus.OK).json({ instructor, token });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const instructorData = req.body;
      const { instructor, token, instructorRefreshToken } =
        await this._instructorAuthService.verifyOtp(instructorData);

      res.cookie("instructorRefreshToken", instructorRefreshToken, {
        path: "/api/instructors",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(httpStatus.CREATED).json({
        instructor,
        token,
        message: "Instructor Registered Successfully, Waiting for approval",
      });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this._instructorAuthService.handleForgotPassword(
        email
      );

      res.status(httpStatus.OK).json({ message: "OTP Sent Successfully" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async verifyForgotOtp(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userData = await this._instructorAuthService.verifyForgotOtp(data);
      res.status(httpStatus.OK).json({ message: "OTP verified." });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      await this._instructorAuthService.handleResetPassword(data);
      res
        .status(httpStatus.OK)
        .json({ message: "Password resetted successfully" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async resentOtp(req: Request, res: Response): Promise<void> {
    try {
      let { email } = req.body;
      await this._instructorAuthService.handleResendOtp(email);
      res.status(httpStatus.OK).json({ message: "OTP resent Successsfully!" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const email = req.instructor?.email;
      if (!email) return;
      const instructor = await this._instructorAuthService.getProfileService(
        email
      );
      res.status(httpStatus.OK).json(instructor);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { name, phone, title, yearsOfExperience, education } = req.body;
      const profilePicture = req.file;

      const email = req.instructor?.email;

      if (!email) {
        res.status(httpStatus.BAD_REQUEST).json({ message: "Email not found" });
      }

      const updatedUser =
        await this._instructorAuthService.updateProfileService(email!, {
          name,
          phone,
          title,
          yearsOfExperience,
          education,
          profilePicture,
        });

      res.status(httpStatus.OK).json(updatedUser);
    } catch (err) {
      console.error("Error updating profile:", err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to update profile" });
    }
  }

  async getCourses(req: Request, res: Response): Promise<void> {
    const instructorId = req.instructor?.id;

    if (!instructorId) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Instructor not found" });
      return;
    }

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const { courses, total, totalPages } =
        await this._instructorAuthService.getCoursesByInstructor(
          instructorId,
          page,
          limit
        );
      res.status(httpStatus.OK).json({
        courses,
        total,
        currentPage: page,
        totalPages,
      });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this._instructorAuthService.getCategory();
      res.status(httpStatus.OK).json(category);
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getCoursesById(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await this._instructorAuthService.getCourseById(courseId);
      res.status(httpStatus.OK).json(course);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getInstructorReviews(req: Request, res: Response): Promise<void> {
    try {
      const page=parseInt(req.query.page as string)||1
      const limit=parseInt(req.query.limit as string)||10
      const rating = req.query.rating ? parseInt(req.query.rating as string) : 0
      const instructorId = req.instructor?.id;
      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }
      const review = await this._instructorAuthService.getReviewsByInstructor(
        instructorId,
        page,
        limit,
        rating
      );
      res.status(httpStatus.OK).json(review);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getEnrollments(req: Request, res: Response): Promise<void> {
    try {
      const page=parseInt(req.query.page as string)||1
      const limit=parseInt(req.query.limit as string)||10
      const instructorId = req.instructor?.id;
      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }

      const enrollments = await this._instructorAuthService.getEnrollments(
        instructorId,
        page,
        limit
      );
      res.status(httpStatus.OK).json(enrollments);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const page=parseInt(req.query.page as string)||1
      const limit=parseInt(req.query.limit as string)||10
      const instructorId = req.instructor?.id;

      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }

      const {wallet,total,totalPages,transactions} = await this._instructorAuthService.getWallet(instructorId,page,limit);
      res
        .status(httpStatus.OK)
        .json({ balance: wallet?.balance, transactions: transactions,total,totalPages,currentPage:page });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    console.log("Instructor refresh hit");
    console.log("Cookie token:", req.cookies.instructorRefreshToken);
    const token = req.cookies.instructorRefreshToken;

    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        _id: string;
        email: string;
        role: "user" | "instructor" | "admin";
      };

      console.log("Decoded token:", decoded);
      if (decoded.role !== "instructor") {
        res.status(httpStatus.FORBIDDEN).json({ message: "Invalid role" });
        return;
      }

      const instructorsToken = generateToken(
        decoded._id,
        decoded.email,
        decoded.role
      );
      res.status(httpStatus.OK).json({ token: instructorsToken });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("instructorRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/instructors",
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  async getPurchasedStudents(req: Request, res: Response): Promise<void> {
    try{
      const instructorId=req.instructor?.id
    if(!instructorId){
      res.status(httpStatus.NOT_FOUND).json({message:"NO Instructors found"})
      return
    }

    const users=await this._instructorAuthService.getPurchasedUsers(instructorId)
    res.status(httpStatus.OK).json(users)
    }catch(err){
      console.log(err)
    }
  }

  async getCourseStats(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.instructor?.id;
      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }
      const stats = await this._instructorAuthService.getCouresStats(
        instructorId
      );
      res.status(httpStatus.OK).json(stats);
    } catch (err: any) {
      console.log(err);
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try{
      const instructorId=req.instructor?.id

    if(!instructorId){
      res.status(httpStatus.NOT_FOUND).json({message:"Instructor not found"})
      return
    }

    const data=await this._instructorAuthService.getDashboard(instructorId)
    res.status(httpStatus.OK).json(data)
    }catch(err){
      console.log(err)
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this._instructorAuthService.getNotifications(userId);
      res.status(httpStatus.OK).json(notifications);
    } catch (err) {
      console.log(err)
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const notification = await this._instructorAuthService.markAsRead(notificationId);
      res.status(httpStatus.OK).json({ message: "Message Read" });
    } catch (err) {
      console.log(err)
    }
  }

  async getIncomeStats(req: Request, res: Response): Promise<void> {
    try{
      const instructorId=req.instructor?.id
      if(!instructorId){
        res.status(httpStatus.NOT_FOUND).json({message:"Instructor not found"})
        return
      }
      const incomeStats=await this._instructorAuthService.getIncomeStats(instructorId)
      res.status(httpStatus.OK).json(incomeStats)
    }catch(err:any){
      console.log(err)
    }
  }
}
