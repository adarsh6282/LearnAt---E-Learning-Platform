import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { httpStatus } from "../constants/statusCodes";
import Instructor from "../models/implementations/instructorModel";

dotenv.config();

interface DecodedInstructorToken {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

const authInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication Failed. Please log in as an instructor.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedInstructorToken;

    const instructor = await Instructor.findById(decoded._id);

    if (!instructor) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (instructor.isBlocked) {
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Access denied. You have been blocked by the admin.",
      });
      return;
    }

    if (decoded && decoded.email && decoded._id) {
      req.instructor = {
        id: decoded._id,
        email: decoded.email,
      };
      next();
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid instructor token",
      });
    }
  } catch (error: any) {
    console.error("Instructor Auth Error:", error);
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Instructor authentication failed",
    });
  }
};

export default authInstructor;
