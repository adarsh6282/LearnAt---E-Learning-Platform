import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { httpStatus } from "../constants/statusCodes";
import User from "../models/implementations/userModel"

dotenv.config();

interface DecodedToken {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication Failed. Login Again",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const token_decode = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

     const user = await User.findById(token_decode._id);

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.isBlocked) {
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Access denied. You have been blocked by the admin.",
      });
      return;
    }

    if (token_decode && token_decode.email && token_decode._id) {
      req.user = {
        id: token_decode._id,
        email: token_decode.email,
      };
      next();
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Invalid token" });
    }
  } catch (error: any) {
    console.log(error);
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ success: false, message: error.message });
  }
};

export default authUser;
