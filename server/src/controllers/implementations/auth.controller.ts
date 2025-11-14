import { Request, Response } from "express";
import { IAuthController } from "../interfaces/auth.interfaces";
import { IAuthService } from "../../services/interfaces/auth.services";
import { httpStatus } from "../../constants/statusCodes";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { IMessageService } from "../../services/interfaces/message.interface";
import { UserRequest } from "../../types/express";
import { ICertificateService } from "../../services/interfaces/certificate.interface";
import { ILiveSessionService } from "../../services/interfaces/livesession.interface";

export class Authcontroller implements IAuthController {
  constructor(
    private _authService: IAuthService,
    private _messageService: IMessageService,
    private _certificateService: ICertificateService,
    private _livesessionService: ILiveSessionService
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this._authService.registerUser(email);
      res.status(httpStatus.OK).json({ message: "Otp sent successfully" });
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
      const { user, token, userRefreshToken } =
        await this._authService.loginUser(email, password);

      res.cookie("userRefreshToken", userRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        domain: "learnat.serveftp.com",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res
        .status(httpStatus.OK)
        .json({ user, token, message: "User Login Successfull" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { user, token, userRefreshToken } =
        await this._authService.verifyOtp(userData);

      res.cookie("userRefreshToken", userRefreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: "learnat.serveftp.com",
        maxAge: Number(process.env.COOKIE_MAXAGE),
      });

      res
        .status(httpStatus.CREATED)
        .json({ user, token, message: "User Registered Successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async googleAuth(req: UserRequest, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Authentication failed" });
      return;
    }

    const { id, email } = req.user;

    const token = generateToken(id!, email!, "user");
    const refreshToken = generateRefreshToken(id!, email!, "user");

    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      domain: "learnat.serveftp.com",
      maxAge: Number(process.env.COOKIE_MAXAGE),
    });

    const redirectUrl = process.env.GOOGLE_VERIFY_URL;

    res.redirect(`${redirectUrl}?token=${token}`);
  }

  async verifyGoogle(req: Request, res: Response): Promise<void> {
    const { token } = req.body;

    if (!token)
      res.status(httpStatus.BAD_REQUEST).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      res.status(httpStatus.OK).json({ message: "Verified", user: decoded });
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
      await this._authService.handleForgotPassword(email);

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
      await this._authService.verifyForgotOtp(data);
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
      await this._authService.handleResetPassword(data);
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
      await this._authService.handleResendOtp(email);
      res.status(httpStatus.OK).json({ message: "OTP resent Successsfully!" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getProfile(req: UserRequest, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) return;
      const user = await this._authService.getProfileByEmail(email);
      res.status(httpStatus.OK).json(user);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async updateProfile(req: UserRequest, res: Response) {
    try {
      const { name, phone } = req.body;
      const profilePicture = req.file;

      const email = req.user?.email;

      if (!email) {
        res.status(httpStatus.BAD_REQUEST).json({ message: "Email not found" });
      }

      const updatedUser = await this._authService.updateProfileService(email!, {
        name,
        phone,
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
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";
      const minPrice = parseInt(req.query.minPrice as string) || 0;
      const maxPrice = parseInt(req.query.maxPrice as string) || 10000;
      const { courses, total, totalPages } =
        await this._authService.getCoursesService(
          page,
          limit,
          search,
          category,
          minPrice,
          maxPrice
        );
      res.status(httpStatus.OK).json({ courses: courses, total, totalPages });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this._authService.getCategory();
      res.status(httpStatus.OK).json(category);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async findCourseById(req: UserRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return;
    }

    try {
      const { course, isEnrolled } =
        await this._authService.findCourseByIdService(courseId, userId);

      res.status(httpStatus.OK).json({ course, isEnrolled });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async buyCourse(req: UserRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?.id;
      const order = await this._authService.createOrder(courseId!, userId!);
      res.status(httpStatus.OK).json(order);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await this._authService.cancelOrder(orderId);
      res.status(httpStatus.OK).json({ success: true, data: order });
    } catch (err) {
      console.log(err);
    }
  }

  async retryPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await this._authService.retryPayment(orderId);
      res.status(httpStatus.OK).json(order);
    } catch (err) {
      console.log(err);
    }
  }

  async getPreviousOrder(req: UserRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

      const order = await this._authService.getPreviousOrder(userId!, courseId);
      if (!order) {
        res.status(httpStatus.OK).json({ hasOrder: false });
        return;
      }

      res.status(httpStatus.OK).json({
        hasOrder: true,
        order,
      });
    } catch (err) {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to fetch order" });
    }
  }

  async verifyOrder(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._authService.verifyPayment(req.body);
      res.status(httpStatus.OK).json(result);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async markLectureWatched(req: UserRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const { lectureId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const progress = await this._authService.updateLectureProgress(
        userId,
        courseId,
        lectureId
      );

      res
        .status(httpStatus.OK)
        .json({ watchedLectures: progress?.watchedLectures });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getCourseProgress(req: UserRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const watchedLectures = await this._authService.getUserCourseProgress(
        userId,
        courseId
      );

      res.status(httpStatus.OK).json(watchedLectures);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  }

  async checkStatus(req: UserRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(httpStatus.NOT_FOUND).json({ message: "NO user found" });
      return;
    }

    const isCompleted = await this._authService.checkStatus(userId, courseId);
    res.status(httpStatus.OK).json(isCompleted);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const token = req.cookies.userRefreshToken;

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
      if (decoded.role !== "user") {
        res.status(httpStatus.FORBIDDEN).json({ message: "Invalid role" });
        return;
      }

      const usersToken = generateToken(
        decoded._id,
        decoded.email,
        decoded.role
      );
      res.status(httpStatus.OK).json({ token: usersToken });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("userRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "learnat.serveftp.com",
      path: "/",
    });
    res.status(httpStatus.OK).json({ message: "Logged out successfully" });
  }

  async getPurchasedInstructors(req: UserRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
        return;
      }
      const instructors =
        await this._authService.fetchPurchasedInstructors(userId);
      res.status(httpStatus.OK).json(instructors);
    } catch (error) {
      console.log(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching instructors", error });
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this._authService.getNotifications(userId);
      res.status(httpStatus.OK).json(notifications);
    } catch (err) {
      console.log(err);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      await this._authService.markAsRead(notificationId);
      res.status(httpStatus.OK).json({ message: "Message Read" });
    } catch (err) {
      console.log(err);
    }
  }

  async submitComplaint(req: UserRequest, res: Response): Promise<void> {
    try {
      const { type, subject, message, targetId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      if (!type || !subject || !message) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "All fields are required" });
        return;
      }

      await this._authService.submitComplaint({
        userId,
        type,
        subject,
        message,
        targetId,
      });

      res
        .status(httpStatus.OK)
        .json({ message: "Complaint submitted successfully" });
    } catch (err) {
      console.log(err);
    }
  }

  async getPurchases(req: UserRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const { purchases, total, totalPages } =
        await this._authService.getPurchases(userId, page, limit);
      res
        .status(httpStatus.OK)
        .json({ purchases: purchases, total, totalPages, currentPage: page });
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(req: UserRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }
      const { oldPassword, newPassword, confirmPassword } = req.body;

      await this._authService.changePassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword
      );
      res
        .status(httpStatus.OK)
        .json({ message: "Password changed successfully" });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async courseInstructorView(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.params.instructorId;
      const instructor =
        await this._authService.getSpecificInstructor(instructorId);
      res.status(httpStatus.OK).json(instructor);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async purchasedCourses(req: UserRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user?.id;
      if (!userId) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: "user not found" });
        return;
      }
      const { purchasedCourses, total, totalPages } =
        await this._authService.purchasedCourses(userId, page, limit);
      res
        .status(httpStatus.OK)
        .json({ purchasedCourses, total, totalPages, currentPage: page });
    } catch (err) {
      console.log(err);
    }
  }

  async getCertificates(req: UserRequest, res: Response): Promise<void> {
    try {
      const user = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      if (!user) {
        res
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: "user not authorized" });
        return;
      }
      const {certificates,totalPages} = await this._authService.getCertificates(
        user,
        page,
        limit
      );
      res.status(httpStatus.OK).json({certificates,totalPages});
    } catch (err) {
      console.log(err);
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
      res.json(counts);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async getQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const quiz = await this._authService.getQuiz(courseId);

      res.status(httpStatus.OK).json({ quiz });
    } catch (err) {
      console.log(err);
    }
  }

  async submitQuiz(req: UserRequest, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      const { answers, courseId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("no user found");
      }

      const result = await this._authService.submitQuiz(
        quizId,
        userId,
        courseId,
        answers
      );

      res.status(httpStatus.OK).json({
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        isCertificateIssued: result.isCertificateIssued,
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }

  async createCertificate(req: Request, res: Response): Promise<void> {
    try {
      const { userId, courseId } = req.body;
      const file = req.file;

      if (!userId || !courseId || !file) {
        res.status(400).json({ message: "Missing required data" });
        return;
      }

      const certificate = await this._certificateService.createCertificate({
        user: userId,
        course: courseId,
        file: file,
      });

      res.status(httpStatus.CREATED).json({ certificate });
    } catch (err) {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  async getSessionToken(req: UserRequest, res: Response): Promise<void> {
    try {
      const { sessionId, role } = req.query;
      const userId = req.user?.id;
      if (role !== "instructor" && role !== "user") {
        res.status(400).json({ error: "Invalid role" });
        return;
      }
      const { token, appId, roomId, courseId } =
        await this._livesessionService.generateToken(
          sessionId as string,
          userId as string,
          role as "user" | "instructor"
        );
      res
        .status(httpStatus.OK)
        .json({ token, appId, roomId, userId, courseId });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  }

  async getLiveSessionByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const liveSession =
        await this._livesessionService.getLiveSessionByCourseId(courseId);

      if (!liveSession) {
        res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "No active live session found." });
        return;
      }

      res.status(httpStatus.OK).json(liveSession);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: (error as Error).message,
      });
    }
  }
}
