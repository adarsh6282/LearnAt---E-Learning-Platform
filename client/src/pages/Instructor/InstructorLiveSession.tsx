import React, { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { endLiveSession, startLiveSession } from "../../services/instructor.services";

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

const InstructorLivePage: React.FC = () => {
  const { sessionId } = useParams();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const userId = authUser?._id;
  const role = "instructor";

  const [isLive, setIsLive] = useState(false);
  const localContainer = useRef<HTMLDivElement>(null);
  const localTracksRef = useRef<(ICameraVideoTrack | IMicrophoneAudioTrack)[]>(
    []
  );

  const startLive = async () => {
    try {
      const { data } = await startLiveSession(sessionId!,userId!,role)
      const { token } = data;

      const appId = token.appId;
      const roomId = token.roomId;
      const agoraToken = token.token;

      await client.setClientRole("host");
      await client.join(appId, roomId, agoraToken, userId);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const camTrack = await AgoraRTC.createCameraVideoTrack();
      camTrack.play(localContainer.current!);

      await client.publish([micTrack, camTrack]);

      localTracksRef.current = [micTrack, camTrack];
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
    try {
      await endLiveSession(false, sessionId!);
      navigate("/instructors/courses");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    return () => {
      localTracksRef.current.forEach((t) => t.stop());
      localTracksRef.current.forEach((t) => t.close());
      client.leave();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Instructor Live Session</h2>

      <div
        ref={localContainer}
        className="w-full max-w-3xl aspect-video bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      ></div>

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
