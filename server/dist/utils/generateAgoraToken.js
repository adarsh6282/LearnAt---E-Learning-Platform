"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAgoraToken = generateAgoraToken;
const agora_access_token_1 = require("agora-access-token");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generateAgoraToken(roomId, userId, role, expirySeconds = 3600) {
    const agoraRole = role === "instructor" ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpire = currentTimestamp + expirySeconds;
    const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE, roomId, userId, agoraRole, privilegeExpire);
    return {
        token,
        appId: process.env.AGORA_APP_ID,
        roomId,
    };
}
