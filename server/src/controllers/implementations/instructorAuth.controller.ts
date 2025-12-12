import { IInstructorController } from "../interfaces/instructorAuth.interface";
import { IInstructorAuthService } from "../../services/interfaces/instructorAuth.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";
import fs from "fs";
import cloudinary from "../../config/cloudinary.config";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { IMessageService } from "../../services/interfaces/message.interface";
import { IQuiz, Question } from "../../models/interfaces/quiz.interface";
import { ILiveSessionService } from "../../services/interfaces/livesession.interface";

export class InstructorAuthController implements IInstructorController {
  constructor(
    private _instructorAuthService: IInstructorAuthService,
    private _messageService: IMessageService,
    private _livesessionService: ILiveSessionService
  ) {}

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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { instructor, token, instructorRefreshToken } =
        await this._instructorAuthService.loginInstructor(email, password);

      res.cookie("instructorRefreshToken", instructorRefreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: "learnat.serveftp.com",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res.status(httpStatus.OK).json({ instructor, token });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const instructorData = req.body;
      const { instructor, token, instructorRefreshToken } =
        await this._instructorAuthService.verifyOtp(instructorData);

      res.cookie("instructorRefreshToken", instructorRefreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: "learnat.serveftp.com",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res.status(httpStatus.CREATED).json({
        instructor,
        token,
        message: "Instructor Registered Successfully, Waiting for approval",
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._instructorAuthService.handleForgotPassword(email);

      res.status(httpStatus.OK).json({ message: "OTP Sent Successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyForgotOtp(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      await this._instructorAuthService.verifyForgotOtp(data);
      res.status(httpStatus.OK).json({ message: "OTP verified." });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      await this._instructorAuthService.handleResetPassword(data);
      res
        .status(httpStatus.OK)
        .json({ message: "Password resetted successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async resentOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._instructorAuthService.handleResendOtp(email);
      res.status(httpStatus.OK).json({ message: "OTP resent Successsfully!" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const email = req.instructor?.email;
      if (!email) return;
      const instructor =
        await this._instructorAuthService.getProfileService(email);
      res.status(httpStatus.OK).json(instructor);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
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
      const search = (req.query.search as string) || "";
      const { courses, total, totalPages } =
        await this._instructorAuthService.getCoursesByInstructor(
          instructorId,
          page,
          limit,
          search
        );
      res.status(httpStatus.OK).json({
        courses,
        total,
        currentPage: page,
        totalPages,
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this._instructorAuthService.getCategory();
      res.status(httpStatus.OK).json(category);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getCoursesById(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await this._instructorAuthService.getCourseById(courseId);
      res.status(httpStatus.OK).json(course);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getInstructorReviews(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const rating = req.query.rating
        ? parseInt(req.query.rating as string)
        : 0;
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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getEnrollments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const status = (req.query.status as string) || "";
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
        limit,
        search,
        status
      );
      res.status(httpStatus.OK).json(enrollments);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const instructorId = req.instructor?.id;

      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }

      const { wallet, total, totalPages, transactions } =
        await this._instructorAuthService.getWallet(instructorId, page, limit);
      res.status(httpStatus.OK).json({
        balance: wallet?.balance,
        transactions: transactions,
        total,
        totalPages,
        currentPage: page,
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("instructorRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "learnat.serveftp.com",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  async getPurchasedStudents(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.instructor?.id;
      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "NO Instructors found" });
        return;
      }

      const users =
        await this._instructorAuthService.getPurchasedUsers(instructorId);
      res.status(httpStatus.OK).json(users);
    } catch (err) {
      console.log(err);
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
      const stats =
        await this._instructorAuthService.getCouresStats(instructorId);
      res.status(httpStatus.OK).json(stats);
    } catch (err) {
      console.log(err);
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.instructor?.id;

      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }

      const data = await this._instructorAuthService.getDashboard(instructorId);
      res.status(httpStatus.OK).json(data);
    } catch (err) {
      console.log(err);
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications =
        await this._instructorAuthService.getNotifications(userId);
      res.status(httpStatus.OK).json(notifications);
    } catch (err) {
      console.log(err);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      await this._instructorAuthService.markAsRead(notificationId);
      res.status(httpStatus.OK).json({ message: "Message Read" });
    } catch (err) {
      console.log(err);
    }
  }

  async getIncomeStats(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.instructor?.id;
      if (!instructorId) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "Instructor not found" });
        return;
      }
      const incomeStats =
        await this._instructorAuthService.getIncomeStats(instructorId);
      res.status(httpStatus.OK).json(incomeStats);
    } catch (err) {
      console.log(err);
    }
  }

  async getUnreadCounts(req: Request, res: Response): Promise<void> {
    try {
      const { userId, userModel } = req.query as {
        userId: string;
        userModel: "User" | "Instructor";
      };
      const counts = await this._messageService.getUnreadCounts(
        userId,
        userModel
      );
      res.status(httpStatus.OK).json(counts);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async markRead(req: Request, res: Response): Promise<void> {
    try {
      const chatId = req.params.chatId;
      const { userId, userModel } = req.body;
      await this._messageService.markRead(chatId, userId, userModel);
      res.sendStatus(httpStatus.OK);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      const { courseId } = req.params;

      if (!instructor) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: "Not authorized" });
        return;
      }

      const transformedQuestions = req.body.questions.map((q: Question) => ({
        questionText: q.questionText,
        options: q.options,
        explanation: q.explanation || "",
      }));

      const quizData: Partial<IQuiz> = {
        ...req.body,
        courseId,
        instructorId: instructor,
        questions: transformedQuestions,
      };

      const quiz = await this._instructorAuthService.createQuiz(
        instructor,
        quizData,
        courseId
      );

      res
        .status(httpStatus.CREATED)
        .json({ message: "Quiz created successfully", quiz });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      if (!instructor) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Instructor not found" });
        return;
      }

      const quiz = await this._instructorAuthService.getQuizzes(instructor);

      res.status(httpStatus.OK).json(quiz);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      const { quizId } = req.params;

      if (!instructor) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Instructor not found" });
        return;
      }
      await this._instructorAuthService.deleteQuiz(quizId);
      res.status(httpStatus.OK).json({ message: "Quiz deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  }

  async restoreQuiz(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      const { quizId } = req.params;

      if (!instructor) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Instructor not found" });
        return;
      }

      await this._instructorAuthService.restoreQuiz(quizId);
      res.status(httpStatus.OK).json({ message: "Quiz restored successfully" });
    } catch (err) {
      console.log(err);
    }
  }

  async getQuiz(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      const { quizId } = req.params;
      if (!instructor) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Instructor not found" });
        return;
      }
      const quiz = await this._instructorAuthService.getQuiz(quizId);
      res.status(httpStatus.OK).json(quiz);
    } catch (err) {
      console.log(err);
    }
  }

  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const instructor = req.instructor?.id;
      const { courseId, startTime } = req.body;
      const session = await this._livesessionService.createSession(
        courseId,
        instructor!,
        startTime
      );
      res.status(httpStatus.CREATED).json(session);
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  }

  async getSessionToken(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, userId, role } = req.query;
      if (role !== "instructor" && role !== "user") {
        res.status(httpStatus.BAD_REQUEST).json({ error: "Invalid role" });
        return;
      }
      const token = await this._livesessionService.generateToken(
        sessionId as string,
        userId as string,
        role as "user" | "instructor"
      );
      res.status(httpStatus.OK).json({ token });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      const instructor = req.instructor?.id;
      const updateData = req.body;

      console.log(updateData);

      if (!instructor) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "Instructor not found" });
        return;
      }
      await this._instructorAuthService.updateQuiz(quizId, updateData);
      res.status(httpStatus.OK).json({ message: "Quiz Updated Successfull" });
    } catch (err) {
      console.log(err);
    }
  }

  async endSession(req: Request, res: Response): Promise<void> {
    try {
      const { isLive, sessionId } = req.body;
      await this._livesessionService.endSession(isLive, sessionId);
      res.status(httpStatus.OK).json({ message: "Session Ended" });
    } catch (err) {
      console.log(err);
    }
  }

  async addCoupon(req: Request, res: Response): Promise<void> {
    try {
      const {code,discount,expiresAt,maxUses}=req.body
      const instructor=req.instructor?.id
      const {courseId}=req.params
      await this._instructorAuthService.addCoupon(code,discount,expiresAt,maxUses,courseId,instructor!)
      res.status(httpStatus.CREATED).json({message:"Coupon Created Successfully"})
    } catch (err) {
      console.log(err)
    }
  }

  async getCouponsForInstructors(req: Request, res: Response): Promise<void> {
    try {
      const instructor=req.instructor?.id
      if(!instructor){
        res.status(httpStatus.UNAUTHORIZED).json({message:"Instructor not found"})
        return
      }

      const coupons=await this._instructorAuthService.getCouponsForInstructors(instructor)
      res.status(httpStatus.OK).json(coupons)
    } catch (err) {
      console.log(err)
    }
  }

  async updateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const instructorId=req.instructor?.id
      const {id}=req.params
      const {code,discount,expiresAt,maxUses}=req.body
      const updated=await this._instructorAuthService.updateCoupon(id,instructorId!,code,discount,expiresAt,maxUses)
      res.status(httpStatus.OK).json(updated)
    } catch (err) {
      console.log(err)
    }
  }
}
