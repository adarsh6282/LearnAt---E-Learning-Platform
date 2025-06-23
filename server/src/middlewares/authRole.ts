import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/implementations/userModel";
import Instructor from "../models/implementations/instructorModel";
import Admin from "../models/implementations/adminModel";
import { httpStatus } from "../constants/statusCodes";

dotenv.config();

interface DecodedToken {
  _id: string;
  email: string;
  role: "user" | "instructor" | "admin";
}

const authRole = (allowedRoles: Array<"user" | "instructor" | "admin">) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Authentication failed. Token missing or malformed.",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      if (!allowedRoles.includes(decoded.role)) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
        return;
      }

      switch (decoded.role) {
        case "user":
          const user = await User.findById(decoded._id);
          if (!user) {
            res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "User not found" });
            return;
          }
          if (user.isBlocked) {
            res.status(httpStatus.FORBIDDEN).json({
              success: false,
              message: "Access denied. You have been blocked by the admin.",
            });
            return;
          }
          req.user = { id: user._id, email: user.email };
          break;

        case "instructor":
          const instructor = await Instructor.findById(decoded._id);
          if (!instructor) {
            res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Instructor not found" });
            return;
          }
          if (instructor.isBlocked) {
            res.status(httpStatus.FORBIDDEN).json({
              success: false,
              message: "Access denied. You have been blocked by the admin.",
            });
            return;
          }
          req.instructor = { id: instructor._id, email: instructor.email };
          break;

        case "admin":
          const admin = await Admin.findOne({ email: decoded.email });
          if (!admin) {
            res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
            return;
          }
          break;

        default:
          res.status(httpStatus.FORBIDDEN).json({
            success: false,
            message: "Invalid role",
          });
          return;
      }

      next();
    } catch (error: any) {
      console.error("Auth error:", error);
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};

export default authRole;