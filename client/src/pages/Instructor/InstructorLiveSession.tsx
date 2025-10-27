import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams } from "react-router-dom";
import { createApi } from "../../services/newApiService";
import { useAuth } from "../../hooks/useAuth";

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

const InstructorLivePage: React.FC = () => {
  const { sessionId } = useParams();
  const { authUser } = useAuth();
  const userId = authUser?._id;
  const role = "instructor";

  const [isLive, setIsLive] = useState(false);
  const localContainer = useRef<HTMLDivElement>(null);
  const localTracksRef = useRef<any[]>([]);

  const startLive = async () => {
    try {
      const api = createApi("instructor");
      const { data } = await api.get(
        `/instructors/live/token?sessionId=${sessionId}&userId=${userId}&role=${role}`
      );
      const { token } = data;
      console.log(token,userId)
      const appId = token.appId;
      const roomId = token.roomId;
      const agoraToken = token.token;

      await client.setClientRole("host");
      await client.join(appId, roomId, agoraToken, userId);

      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = tracks;

      tracks[1].play(localContainer.current!);
      await client.publish(tracks);
      setIsLive(true);

      console.log("Instructor is live!");
    } catch (err) {
      console.error("Error starting live:", err);
    }
  };

  const endLive = async () => {
    localTracksRef.current.forEach((t) => t.stop());
    localTracksRef.current.forEach((t) => t.close());
    await client.leave();
    setIsLive(false);
  };

  useEffect(() => {
    return () => {
      localTracksRef.current.forEach((t) => t.stop());
      localTracksRef.current.forEach((t) => t.close());
      client.leave();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Instructor Live Session</h2>

      <div ref={localContainer} className="w-96 h-64 bg-gray-800 rounded-lg" />

      <div className="mt-6 flex gap-4">
        {!isLive ? (
          <button
            className="bg-green-600 px-4 py-2 rounded"
            onClick={startLive}
          >
            Go Live
          </button>
        ) : (
          <button className="bg-red-600 px-4 py-2 rounded" onClick={endLive}>
            End Live
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorLivePage;
