import { Request, Response } from "express";
import { IAuthController } from "../interfaces/auth.interfaces";
import { IAuthService } from "../../services/interfaces/auth.services";
import { httpStatus } from "../../constants/statusCodes";
import { generateToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { IMessageService } from "../../services/interfaces/message.interface";

export class Authcontroller implements IAuthController {
  constructor(
    private _authService: IAuthService,
    private _messageService: IMessageService
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this._authService.registerUser(email);
      res.status(httpStatus.OK).json({ message: "Otp sent successfully" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token, userRefreshToken } =
        await this._authService.loginUser(email, password);

      res.cookie("userRefreshToken", userRefreshToken, {
        httpOnly: true,
        path: "/api/users",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(httpStatus.OK)
        .json({ user, token, message: "User Login Successfull" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { user, token, userRefreshToken } =
        await this._authService.verifyOtp(userData);

      res.cookie("userRefreshToken", userRefreshToken, {
        path: "/api/users",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(httpStatus.CREATED)
        .json({ user, token, message: "User Registered Successfully" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Authentication failed" });
      return;
    }

    const { id, email } = req.user;

    const token = generateToken(id, email, "user");
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
    } catch (err) {
      res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this._authService.handleForgotPassword(email);

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
      const userData = await this._authService.verifyForgotOtp(data);
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
      await this._authService.handleResetPassword(data);
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
      await this._authService.handleResendOtp(email);
      res.status(httpStatus.OK).json({ message: "OTP resent Successsfully!" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const email = req.user?.email;
      if (!email) return;
      const user = await this._authService.getProfileByEmail(email);
      res.status(httpStatus.OK).json(user);
    } catch (err: any) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
    }
  }

  async updateProfile(req: Request, res: Response) {
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
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this._authService.getCategory();
      res.status(httpStatus.OK).json(category);
    } catch (err) {
      console.log(err);
    }
  }

  async findCourseById(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return;
    }

    try {
      const { course, isEnrolled } =
        await this._authService.findCourseByIdService(courseId, userId);

      res.status(httpStatus.OK).json({ course, isEnrolled });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async buyCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.body;
      const userId = req.user?.id;
      const order = await this._authService.createOrder(courseId!, userId!);
      res.status(httpStatus.OK).json(order);
    } catch (err: any) {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }

  async verifyOrder(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._authService.verifyPayment(req.body);
      res.status(httpStatus.OK).json(result);
    } catch (err: any) {
      console.log(err);
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    }
  }

  async markLectureWatched(req: Request, res: Response): Promise<void> {
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
    } catch (err: any) {
      console.log(err)
      res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  async getCourseProgress(req: Request, res: Response): Promise<void> {
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

      res.status(httpStatus.OK).json({
        success: true,
        watchedLectures,
      });
    } catch (err: any) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
  }

  async checkStatus(req: Request, res: Response): Promise<void> {
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
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("userRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/users",
    });
    res.status(httpStatus.OK).json({ message: "Logged out successfully" });
  }

  async getPurchasedInstructors(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
        return;
      }
      const instructors = await this._authService.fetchPurchasedInstructors(
        userId
      );
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
      const notification = await this._authService.markAsRead(notificationId);
      res.status(httpStatus.OK).json({ message: "Message Read" });
    } catch (err) {
      console.log(err);
    }
  }

  async submitComplaint(req: Request, res: Response): Promise<void> {
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

      const complaint = await this._authService.submitComplaint({
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

  async getPurchases(req: Request, res: Response): Promise<void> {
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

  async changePassword(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      console.log(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  async courseInstructorView(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.params.instructorId;
      const instructor = await this._authService.getSpecificInstructor(
        instructorId
      );
      res.status(httpStatus.OK).json(instructor);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async purchasedCourses(req: Request, res: Response): Promise<void> {
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

  async getCertificates(req: Request, res: Response): Promise<void> {
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
      const certificates = await this._authService.getCertificates(
        user,
        page,
        limit
      );
      res.status(httpStatus.OK).json(certificates);
    } catch (err) {
      console.log(err);
    }
  }

  async markRead(req: Request, res: Response):Promise<void> {
    try {
      const chatId = req.params.chatId;
      const { userId, userModel } = req.body;
      await this._messageService.markRead(chatId, userId, userModel);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: "Failed to mark messages as read" });
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
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch unread counts" });
    }
  }
}
