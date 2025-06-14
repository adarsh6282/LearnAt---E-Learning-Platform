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
const statusCodes_1 = require("../constants/statusCodes");
const userModel_1 = __importDefault(require("../models/implementations/userModel"));
dotenv_1.default.config();
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Authentication Failed. Login Again",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const token_decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield userModel_1.default.findById(token_decode._id);
        if (!user) {
            res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        if (user.isBlocked) {
            res.status(statusCodes_1.httpStatus.FORBIDDEN).json({
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
        }
        else {
            res
                .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                .json({ success: false, message: "Invalid token" });
        }
    }
    catch (error) {
        console.log(error);
        res
            .status(statusCodes_1.httpStatus.UNAUTHORIZED)
            .json({ success: false, message: error.message });
    }
});
exports.default = authUser;
