"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionRepository = void 0;
const liveSessionModel_1 = __importDefault(require("../../models/implementations/liveSessionModel"));
class LiveSessionRepository {
    async create(data) {
        try {
            return await liveSessionModel_1.default.create(data);
        }
        catch (err) {
            console.error("LiveSession create error:", err);
            throw err;
        }
    }
    async findById(id) {
        return await liveSessionModel_1.default.findById(id);
    }
    async findActiveByCourseId(courseId) {
        return await liveSessionModel_1.default.findOne({
            courseId,
            endTime: { $exists: false },
        });
    }
}
exports.LiveSessionRepository = LiveSessionRepository;
