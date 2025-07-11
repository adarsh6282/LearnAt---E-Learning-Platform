"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/implementations/userModel"));
const instructorModel_1 = __importDefault(require("../models/implementations/instructorModel"));
const adminModel_1 = __importDefault(require("../models/implementations/adminModel"));
const statusCodes_1 = require("../constants/statusCodes");
dotenv_1.default.config();
const authRole = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication failed. Token missing or malformed.",
                });
                return;
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                res.status(statusCodes_1.httpStatus.FORBIDDEN).json({
                    success: false,
                    message: "Access denied. Insufficient permissions.",
                });
                return;
            }
            switch (decoded.role) {
                case "user":
                    const user = yield userModel_1.default.findById(decoded._id);
                    if (!user) {
                        res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ success: false, message: "User not found" });
                        return;
                    }
                    if (user.isBlocked) {
                        res.status(statusCodes_1.httpStatus.FORBIDDEN).json({
                            success: false,
                            message: "Access denied. You have been blocked by the admin.",
                        });
                        return;
                    }
                    req.user = { id: user._id, email: user.email };
                    break;
                case "instructor":
                    const instructor = yield instructorModel_1.default.findById(decoded._id);
                    if (!instructor) {
                        res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ success: false, message: "Instructor not found" });
                        return;
                    }
                    if (instructor.isBlocked) {
                        res.status(statusCodes_1.httpStatus.FORBIDDEN).json({
                            success: false,
                            message: "Access denied. You have been blocked by the admin.",
                        });
                        return;
                    }
                    req.instructor = { id: instructor._id, email: instructor.email };
                    break;
                case "admin":
                    const admin = yield adminModel_1.default.findOne({ email: decoded.email });
                    if (!admin) {
                        res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
                        return;
                    }
                    break;
                default:
                    res.status(statusCodes_1.httpStatus.FORBIDDEN).json({
                        success: false,
                        message: "Invalid role",
                    });
                    return;
            }
            next();
        }
        catch (error) {
            console.error("Auth error:", error);
            res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Authentication failed",
            });
        }
    });
};
exports.default = authRole;
