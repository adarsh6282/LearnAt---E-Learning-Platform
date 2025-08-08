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
exports.AuthRepository = void 0;
const userModel_1 = __importDefault(require("../../models/implementations/userModel"));
const base_repository_1 = require("../base.repository");
class AuthRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(userModel_1.default);
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.create(userData);
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ email });
            return user;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findById(id);
            return user;
        });
    }
    findForProfile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ email }).select("-password");
            return user;
        });
    }
    updateUserByEmail(email, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.model.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });
            return updatedUser;
        });
    }
    findUsersByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.default.find({ _id: { $in: ids } });
        });
    }
    updatePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.default.findByIdAndUpdate(userId, { password: hashedPassword });
        });
    }
}
exports.AuthRepository = AuthRepository;
