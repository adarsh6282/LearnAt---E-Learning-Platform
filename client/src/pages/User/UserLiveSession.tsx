import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams } from "react-router-dom";
import { getLiveToken } from "../../services/user.services";

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

const StudentLivePage: React.FC = () => {
  const { sessionId } = useParams();
  const role = "user";

  const [isJoined, setIsJoined] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const remoteContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joinLive = async () => {
      try {
        const res=await getLiveToken(sessionId!,role)
        const { token } = res.data;
        const appId = token.appId;
        const roomId = token.roomId;
        const agoraToken = token.token;
        const userId = token.userId;

        await client.setClientRole("audience");
        if (
          client.connectionState === "CONNECTED" ||
          client.connectionState === "CONNECTING"
        ) {
          console.warn("Already connected to Agora, skipping join.");
          return;
        }
        await client.join(appId, roomId, agoraToken, userId);

        client.on("user-published", async (user, mediaType) => {
          console.log("User published:", user.uid, mediaType);
          await client.subscribe(user, mediaType);
          if (mediaType === "video" && remoteContainer.current) {
            user.videoTrack?.play(remoteContainer.current);
            setIsJoined(true);
            setIsWaiting(false);
            console.log("Video is playing!");
          }
        });

        client.on("user-unpublished", () => {
          setIsJoined(false);
          setIsWaiting(true);
        });
      } catch (err) {
        console.error("Error joining live:", err);
      }
    };

    joinLive();

    return () => {
      client.leave();
    };
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Live Class</h2>

      {isWaiting && !isJoined ? (
        <div className="text-gray-400">
          ⏳ Waiting for instructor to go live...
        </div>
      ) : (
        <div
          ref={remoteContainer}
          className="w-96 h-64 bg-gray-800 rounded-lg"
        />
      )}
    </div>
  );
};

export default StudentLivePage;
