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
exports.Authcontroller = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const generateToken_1 = require("../../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authcontroller {
    constructor(_authService) {
        this._authService = _authService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._authService.registerUser(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Otp sent successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, token } = yield this._authService.loginUser(email, password);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ user, token, message: "User Login Successfull" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const { user, token } = yield this._authService.verifyOtp(userData);
                res
                    .status(statusCodes_1.httpStatus.CREATED)
                    .json({ user, token, message: "User Registered Successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res
                    .status(statusCodes_1.httpStatus.UNAUTHORIZED)
                    .json({ message: "Authentication failed" });
                return;
            }
            const { id, email } = req.user;
            const token = (0, generateToken_1.generateToken)(id, email);
            const redirectUrl = process.env.GOOGLE_VERIFY_URL;
            res.redirect(`${redirectUrl}?token=${token}`);
        });
    }
    verifyGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            if (!token)
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Token missing" });
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Verified", user: decoded });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._authService.handleForgotPassword(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP Sent Successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userData = yield this._authService.verifyForgotOtp(data);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP verified." });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                yield this._authService.handleResetPassword(data);
                res
                    .status(statusCodes_1.httpStatus.OK)
                    .json({ message: "Password resetted successfully" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    resentOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                yield this._authService.handleResendOtp(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP resent Successsfully!" });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email)
                    return;
                const user = yield this._authService.getProfileByEmail(email);
                res.status(statusCodes_1.httpStatus.OK).json(user);
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err.message);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, phone } = req.body;
                const profilePicture = req.file;
                console.log(req.file);
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "EMail not found" });
                }
                const updatedUser = yield this._authService.updateProfileService(email, {
                    name,
                    phone,
                    profilePicture,
                });
                res.status(statusCodes_1.httpStatus.OK).json(updatedUser);
            }
            catch (err) {
                console.error("Error updating profile:", err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to update profile" });
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this._authService.getCoursesService();
                res.status(statusCodes_1.httpStatus.OK).json(courses);
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    findCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return;
            }
            try {
                const { course, isEnrolled } = yield this._authService.findCourseByIdService(courseId, userId);
                res.status(statusCodes_1.httpStatus.OK).json({ course, isEnrolled });
            }
            catch (err) {
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    buyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const order = yield this._authService.createOrder(courseId, userId);
                res.status(statusCodes_1.httpStatus.OK).json(order);
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
            }
        });
    }
    verifyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._authService.verifyPayment(req.body);
                res.status(statusCodes_1.httpStatus.OK).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ error: err.message });
            }
        });
    }
}
exports.Authcontroller = Authcontroller;
