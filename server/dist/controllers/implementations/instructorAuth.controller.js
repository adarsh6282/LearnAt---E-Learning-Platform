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
    constructor(_instructorAuthService) {
        this._instructorAuthService = _instructorAuthService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const instructor = yield this._instructorAuthService.registerInstructor(email);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "OTP sent Successfully" });
            }
            catch (err) {
                console.log(err);
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
                const { instructor, token } = yield this._instructorAuthService.loginInstructor(email, password);
                res.status(statusCodes_1.httpStatus.OK).json({ instructor, token });
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
                const instructorData = req.body;
                const { instructor, token } = yield this._instructorAuthService.verifyOtp(instructorData);
                res
                    .status(statusCodes_1.httpStatus.CREATED)
                    .json({
                    instructor,
                    token,
                    message: "Instructor Registered Successfully, Waiting for approval",
                });
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this._instructorAuthService.handleForgotPassword(email);
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
                const userData = yield this._instructorAuthService.verifyForgotOtp(data);
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
                yield this._instructorAuthService.handleResetPassword(data);
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
                yield this._instructorAuthService.handleResendOtp(email);
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
                const email = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.email;
                if (!email)
                    return;
                const instructor = yield this._instructorAuthService.getProfileService(email);
                res.status(statusCodes_1.httpStatus.OK).json(instructor);
            }
            catch (err) {
                console.log(err);
                res
                    .status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: err.message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, phone, title, yearsOfExperience, education } = req.body;
                const profilePicture = req.file;
                const email = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "Email not found" });
                }
                const updatedUser = yield this._instructorAuthService.updateProfileService(email, {
                    name,
                    phone,
                    title,
                    yearsOfExperience,
                    education,
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
            var _a;
            const instructorId = (_a = req.instructor) === null || _a === void 0 ? void 0 : _a.id;
            if (!instructorId) {
                res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Instructor not found" });
                return;
            }
            try {
                const courses = yield this._instructorAuthService.getCoursesByInstructor(instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(courses);
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
}
exports.InstructorAuthController = InstructorAuthController;
