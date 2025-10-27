import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import dotenv from "dotenv"

dotenv.config()

export async function generateAgoraToken(
  roomId: string,
  userId: string,
  role: "instructor" | "user",
  expirySeconds: number = 3600
) {
  const agoraRole = role === "instructor" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpire = currentTimestamp + expirySeconds;

  const token = RtcTokenBuilder.buildTokenWithAccount(
    process.env.AGORA_APP_ID!,
    process.env.AGORA_APP_CERTIFICATE!,
    roomId,
    userId,
    agoraRole,
    privilegeExpire
  );

  return {
    token,
    appId: process.env.AGORA_APP_ID,
    roomId,
  };
}

