import React, { useContext } from "react";
import callContext from "../context/CallContext";

const CallModal: React.FC = () => {
  const context=useContext(callContext)

  if(!context){
    return "no context here"
  }
  
  const { incomingCall, acceptCall, rejectCall } = context;

  if (!incomingCall) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-bold">📞 Incoming Call</h2>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={acceptCall} className="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
          <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
