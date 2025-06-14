import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import Admin from "../models/implementations/adminModel"

dotenv.config()

interface JwtPayload {
    email?: string;
    role?: string;
}

const authAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const atoken = req.headers.authorization as string;
        if (!atoken) {
            res.status(401).json({ success: false, message: "Authentication Failed Login Again" })
            return;
        }

        const token = atoken.startsWith('Bearer ') ? atoken.split(' ')[1] : null;

        if (!token) {
            res.status(401).json({ success: false, message: "Token missing or malformed" });
            return;
        }

        const jwtSecret=process.env.JWT_SECRET
        if(!jwtSecret){
            throw new Error("JWT_SECRET is not defined in environment variables")
        }

        const token_decode = jwt.verify(token, jwtSecret) as JwtPayload;

        const admin = await Admin.findOne({ email: token_decode.email });

        if (!admin) {
            res.status(403).json({ success: false, message: "Authentication Failed Login Again" });
            return;
        }

        next();
    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authAdmin;