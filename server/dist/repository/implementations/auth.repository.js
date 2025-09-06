"use strict";
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
    async createUser(userData) {
        const user = await this.model.create(userData);
        return user;
    }
    async findByEmail(email) {
        const user = await this.model.findOne({ email });
        return user;
    }
    async findById(id) {
        const user = await this.model.findById(id);
        return user;
    }
    async findForProfile(email) {
        const user = await this.model.findOne({ email });
        return user;
    }
    async updateUserByEmail(email, updateFields) {
        const updatedUser = await this.model.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });
        return updatedUser;
    }
    async findUsersByIds(ids) {
        return userModel_1.default.find({ _id: { $in: ids } });
    }
    async updatePassword(userId, hashedPassword) {
        return userModel_1.default.findByIdAndUpdate(userId, { password: hashedPassword });
    }
}
exports.AuthRepository = AuthRepository;
