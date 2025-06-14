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
const adminModel_1 = __importDefault(require("../models/implementations/adminModel"));
dotenv_1.default.config();
const authAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const atoken = req.headers.authorization;
        if (!atoken) {
            res.status(401).json({ success: false, message: "Authentication Failed Login Again" });
            return;
        }
        const token = atoken.startsWith('Bearer ') ? atoken.split(' ')[1] : null;
        if (!token) {
            res.status(401).json({ success: false, message: "Token missing or malformed" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token_decode = jsonwebtoken_1.default.verify(token, jwtSecret);
        const admin = yield adminModel_1.default.findOne({ email: token_decode.email });
        if (!admin) {
            res.status(403).json({ success: false, message: "Authentication Failed Login Again" });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});
exports.default = authAdmin;
