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
exports.AdminController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminService.getAllUsers();
                res.status(statusCodes_1.httpStatus.OK).json(users);
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    getAllTutors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield this.adminService.getAllTutors();
                res.status(statusCodes_1.httpStatus.OK).json(tutors);
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    approveTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const approve = yield this.adminService.verifyTutor(email);
                res.status(statusCodes_1.httpStatus.OK).json("Tutor Approved Successfully");
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
    rejectTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            try {
                const deleted = yield this.adminService.rejectTutor(email);
                if (!deleted) {
                    res.status(statusCodes_1.httpStatus.NOT_FOUND).json({ message: "Tutor Not Found" });
                }
                res.status(statusCodes_1.httpStatus.OK).json({ message: "Tutor rejected and deleted successfully" });
            }
            catch (err) {
                res.status(statusCodes_1.httpStatus.INTERNAL_SERVER_ERROR).json(err);
            }
        });
    }
}
exports.AdminController = AdminController;
