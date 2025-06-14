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
exports.AdminRepository = void 0;
const userModel_1 = __importDefault(require("../../models/implementations/userModel"));
const instructorModel_1 = __importDefault(require("../../models/implementations/instructorModel"));
const adminModel_1 = __importDefault(require("../../models/implementations/adminModel"));
const base_repository_1 = require("../base.repository");
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(adminModel_1.default);
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find({}).lean();
            return users;
        });
    }
    getAllTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            const instructors = yield instructorModel_1.default.find({}).lean();
            return instructors;
        });
    }
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    updateUserBlockStatus(email, blocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.findOneAndUpdate({ email }, { isBlocked: blocked, updatedAt: new Date() }, { new: true });
        });
    }
    updateTutorBlockStatus(email, blocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.default.findOneAndUpdate({ email }, { isBlocked: blocked }, { new: true });
        });
    }
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.default.countDocuments({});
        });
    }
    getTotalTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.default.countDocuments({});
        });
    }
}
exports.AdminRepository = AdminRepository;
