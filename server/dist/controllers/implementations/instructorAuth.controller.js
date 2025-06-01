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
exports.InstructorAuthController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class InstructorAuthController {
    constructor(instructorAuthService) {
        this.instructorAuthService = instructorAuthService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const instructor = yield this.instructorAuthService.registerInstructor(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP sent Successfully" });
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
                const instructor = yield this.instructorAuthService.loginInstructor(email, password);
                res.status(statusCodes_1.httpStatus.OK).json({ instructor });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const instructorData = req.body;
                const user = yield this.instructorAuthService.verifyOtp(instructorData);
                res.status(statusCodes_1.httpStatus.CREATED).json({ user, message: "Instructor Registered Successfully, Waiting for approval" });
            }
            catch (err) {
                console.log(err.message);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.instructorAuthService.handleForgotPassword(email);
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
                const userData = yield this.instructorAuthService.verifyForgotOtp(data);
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
                yield this.instructorAuthService.handleResetPassword(data);
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
                yield this.instructorAuthService.handleResendOtp(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP resent Successsfully!" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
}
exports.InstructorAuthController = InstructorAuthController;
