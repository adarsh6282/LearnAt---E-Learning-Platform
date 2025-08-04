import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket.service";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface CallContextType {
  incomingCall: boolean;
  callerId: string | null;
  chatId: string | null;
  acceptCall: () => void;
  rejectCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  
  useEffect(() => {
    socket.on("incoming-call", ({ callerId, chatId, receiverId }) => {
      if (authUser?._id !== receiverId) return;

      setIncomingCall(true);
      setCallerId(callerId);
      setChatId(chatId);
    });

    return () => {
      socket.off("incoming-call");
    };
  }, [authUser?._id]);

  const acceptCall = () => {
    socket.emit("call-accepted", { callerId, chatId });
    setIncomingCall(false);
    if (authUser?.role === "user") {
      navigate(`/users/video/${chatId}`);
    } else {
      navigate(`/instructors/video/${chatId}`);
    }
  };

  const rejectCall = () => {
    socket.emit("call-rejected", { callerId, chatId });
    setIncomingCall(false);
  };

  return (
    <CallContext.Provider
      value={{ incomingCall, callerId, chatId, acceptCall, rejectCall }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context)
    throw new Error("useCallContext must be used within CallProvider");
  return context;
};
