import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useNavigate, useParams } from "react-router-dom";
import { getLiveToken } from "../../services/user.services";

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

const StudentLivePage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate=useNavigate()
  const role = "user";
  const [isWaiting, setIsWaiting] = useState(true);
  const remoteContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let joined = false;

    const joinLive = async () => {
      try {
        const res = await getLiveToken(sessionId!, role);
        const { token, appId, roomId, courseId, userId } = res.data;
        if (
          client.connectionState === "CONNECTED" ||
          client.connectionState === "CONNECTING"
        ) {
          return;
        }

        await client.setClientRole("audience");
        await client.join(appId, roomId, token, userId);
        joined = true;
        client.on(
          "user-published",
          async (user: IAgoraRTCRemoteUser, mediaType) => {
            await client.subscribe(user, mediaType);

            if (mediaType === "audio") {
              user.audioTrack?.play();
            }

            if (mediaType === "video") {
              const container = remoteContainer.current;
              if (container) {
                container.innerHTML = "";
                user.videoTrack?.play(container);
              }
            }
          }
        );

        const handleInstructorLeft = async () => {
          setIsWaiting(true);
          await client.leave();
          navigate(`/users/course-view/${courseId}`);
        };
        client.on("user-unpublished", handleInstructorLeft);
      } catch (err) {
        console.error("❌ Error joining live:", err);
      }
    };

    joinLive();

    return () => {
      if (joined) client.leave();
      client.removeAllListeners();
    };
  }, [sessionId,navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">🎥 Live Class</h2>

      <div
        ref={remoteContainer}
        className="relative w-[640px] h-[360px] bg-black rounded-lg overflow-hidden shadow-lg"
      >
        {isWaiting && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-black/70">
            ⏳ Waiting for instructor to go live...
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLivePage;
