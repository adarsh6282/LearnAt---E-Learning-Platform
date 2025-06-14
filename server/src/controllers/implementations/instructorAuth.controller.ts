import { IInstructorController } from "../interfaces/instructorAuth.interface";
import { IInstructorAuthService } from "../../services/interfaces/instructorAuth.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";

export class InstructorAuthController implements IInstructorController {
  constructor(private _instructorAuthService: IInstructorAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const instructor = await this._instructorAuthService.registerInstructor(
        email
      );
      res.status(httpStatus.OK).json({ message: "OTP sent Successfully" });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { instructor, token } =
        await this._instructorAuthService.loginInstructor(email, password);
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
      const { instructor, token } = await this._instructorAuthService.verifyOtp(
        instructorData
      );
      res
        .status(httpStatus.CREATED)
        .json({
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
      const user = await this._instructorAuthService.handleForgotPassword(email);

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

      const updatedUser = await this._instructorAuthService.updateProfileService(
        email!,
        {
          name,
          phone,
          title,
          yearsOfExperience,
          education,
          profilePicture,
        }
      );

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
    res.status(httpStatus.NOT_FOUND).json({ message: "Instructor not found" });
    return
  }

  try {
    const courses = await this._instructorAuthService.getCoursesByInstructor(instructorId);
    res.status(httpStatus.OK).json(courses);
  } catch (err: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
}
}
