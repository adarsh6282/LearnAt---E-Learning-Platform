import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket.service";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface CallContextValue {
  incomingCall: {
    chatId: string;
    callerId: string;
    calleName:string
  } | null;
  acceptCall: () => void;
  rejectCall: () => void;
}

const TIMEOUT_MS = 30000;

const CallContext = createContext<CallContextValue | undefined>(undefined);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuth();
  const timeoutRef = React.useRef<number | null>(null);
  const navigate=useNavigate()
  const [incomingCall, setIncomingCall] = useState<{
    chatId: string;
    callerId: string;
    calleName:string
    receiverId: string;
  } | null>(null);

  useEffect(() => {
    const handleIncomingCall = ({ chatId, callerId,calleName,receiverId }:{chatId:string,callerId:string,calleName:string,receiverId:string}) => {
      if (receiverId !== authUser?._id) return;

      setIncomingCall({ chatId, callerId, calleName, receiverId });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIncomingCall(null);
        socket.emit("call-rejected", { chatId, receiverId: authUser?._id });
      }, TIMEOUT_MS);
    };

    socket.on("incoming-call", handleIncomingCall);

    socket.on("call-cancelled", () => {
      setIncomingCall(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    });

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-cancelled");
    };
  }, [authUser?._id]);

    useEffect(() => {
    if (authUser?._id) {
      socket.emit("joinNotificationRoom", authUser._id);

      return () => {
        socket.off("joinNotificationRoom");
      };
    }
  }, [authUser?._id]);

  const acceptCall = () => {
    if (incomingCall) {
      socket.emit("call-accepted", {
        chatId: incomingCall.chatId,
        receiverId: authUser?._id,
      });
    }
    setIncomingCall(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if(authUser?.role=="user"){
        navigate(`/users/video/${incomingCall?.chatId}`)
      }else if(authUser?.role=="instructor"){
        navigate(`/instructors/video/${incomingCall?.chatId}`)
      }
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("call-rejected", {
        chatId: incomingCall.chatId,
        receiverId: authUser?._id,
      });
    }
    setIncomingCall(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  };

  return (
    <CallContext.Provider value={{ incomingCall, acceptCall, rejectCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};
