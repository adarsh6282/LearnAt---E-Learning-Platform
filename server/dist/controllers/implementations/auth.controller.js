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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authcontroller = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const generateToken_1 = require("../../utils/generateToken");
class Authcontroller {
    constructor(authService) {
        this.authService = authService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.authService.registerUser(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Otp sent successfully" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.authService.loginUser(email, password);
                res.status(statusCodes_1.httpStatus.OK).json({ user });
            }
            catch (err) {
                if (err.message === "User doesn't exist" || err.message === "Invalid password") {
                    res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: err.message });
                }
                else {
                    res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
                }
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                console.log(userData);
                const user = yield this.authService.verifyOtp(userData);
                res.status(statusCodes_1.httpStatus.CREATED).json({ user, message: "User Registered Successfully" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "Authentication failed" });
                return;
            }
            const token = (0, generateToken_1.generateToken)(req.user.id);
            res.redirect(`http://localhost:5173/?token=${token}`);
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.authService.handleForgotPassword(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP Sent Successfully" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userData = yield this.authService.verifyForgotOtp(data);
                res.status(statusCodes_1.httpStatus.OK).json({ message: 'OTP verified.' });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json(err);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                yield this.authService.handleResetPassword(data);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Password resetted successfully" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    resentOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                yield this.authService.handleResendOtp(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP resent Successsfully!" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
}
exports.Authcontroller = Authcontroller;
