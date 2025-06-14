import { Request, Response } from "express";
import { IAuthController } from "../interfaces/auth.interfaces";
import { IAuthService } from "../../services/interfaces/auth.services";
import { httpStatus } from "../../constants/statusCodes";
import { generateToken } from "../../utils/generateToken";
import jwt from "jsonwebtoken";

export class Authcontroller implements IAuthController {
  constructor(private _authService: IAuthService) {}

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
      const { user, token } = await this._authService.loginUser(email, password);
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
      const { user, token } = await this._authService.verifyOtp(userData);
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

    const token = generateToken(id, email);
    const redirectUrl=process.env.GOOGLE_VERIFY_URL

    res.redirect(`${redirectUrl}?token=${token}`);
  }

  async verifyGoogle(req: Request, res: Response): Promise<void> {
    const { token } = req.body;

    if (!token) res.status(httpStatus.BAD_REQUEST).json({ message: "Token missing" });

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

      console.log(req.file);

      const email = req.user?.email;

      if (!email) {
        res.status(httpStatus.BAD_REQUEST).json({ message: "EMail not found" });
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
      const courses = await this._authService.getCoursesService();
      res.status(httpStatus.OK).json(courses);
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async findCourseById(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const userId=req.user?.id

    if(!userId){
      return
    }

    try {
      const {course,isEnrolled} = await this._authService.findCourseByIdService(courseId,userId);

      res.status(httpStatus.OK).json({course,isEnrolled});
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
    } catch (err:any) {
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  }

  async verifyOrder(req: Request, res: Response): Promise<void> {
    try {
    const result = await this._authService.verifyPayment(req.body);
    res.status(httpStatus.OK).json(result);
  } catch (err:any) {
    console.log(err)
    res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
  }
  }
}
