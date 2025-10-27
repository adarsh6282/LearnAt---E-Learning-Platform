"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class LiveSessionController {
    constructor(_livesessionService) {
        this._livesessionService = _livesessionService;
    }
    async getSessionToken(req, res) {
        try {
            const { sessionId, userId, role } = req.query;
            const token = await this._livesessionService.generateToken(sessionId, userId, role);
            res.status(statusCodes_1.httpStatus.OK).json({ token });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.LiveSessionController = LiveSessionController;
