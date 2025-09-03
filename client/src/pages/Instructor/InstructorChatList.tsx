import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiArrowLeft } from "react-icons/fi";
import { socket } from "../../services/socket.service";
import { filteredUsers, getChatList, initiateChat } from "../../services/instructor.services";
interface ChatPartner {
  chatId: string;
  partnerId: string;
  partnerName: string;
  lastMessage:string
}

interface User {
  _id: string;
  name: string;
}

const InstructorChatList = () => {
  const [chats, setChats] = useState<ChatPartner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { chatId: activeChat } = useParams();

  useEffect(() => {
    if (!authUser || !authUser._id) return;

    const fetchChats = async () => {
      try {
        const formattedChats=await getChatList(authUser._id!)
        setChats(formattedChats)
      } catch (err) {
        console.error("Error fetching instructor chats:", err);
      }
    };

    fetchChats();
  }, [authUser]);

    useEffect(() => {
      const handleUpdate = (update: {
        chatId: string;
        lastMessage: string;
        lastMessageContent: string;
      }) => {
        setChats((prev) => {
          const updated = prev.map((chat) =>
            chat.chatId === update.chatId
              ? {
                  ...chat,
                  lastMessage: update.lastMessage,
                  lastMessageContent: update.lastMessageContent,
                }
              : chat
          );
  
          return updated.sort(
            (a, b) =>
              new Date(b.lastMessage).getTime() -
              new Date(a.lastMessage).getTime()
          );
        });
      };
  
      socket.on("updateChatList", handleUpdate);
  
      return () => {
        socket.off("updateChatList", handleUpdate);
      };
    }, []);

  const fetchUsers = async () => {
    try {
      const res = await filteredUsers()
      const filtered = res.data.filter(
        (user) => !chats.some((chat) => chat.partnerId === user._id)
      );
      setUsers(filtered);
      setShowUsers(true);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleStartChat = async (user: User) => {
    try {
      const chat=await initiateChat(authUser?._id!,user._id)

      navigate(`/instructors/chat/${chat._id}`, {
        state: {
          partnerName: user.name,
        },
      });
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  return (
    <div className="w-full md:w-1/3 h-full overflow-y-auto p-4 bg-[#0f0f0f] text-gray-200 border-r border-[#1f1f1f] shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2 tracking-wide">
        Chats
      </h2>

      <button
        onClick={() => navigate("/instructors/dashboard")}
        className="mb-4 flex items-center text-cyan-400 hover:text-cyan-300 hover:cursor-pointer transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {!showUsers && (
        <button
          onClick={fetchUsers}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded shadow hover:shadow-cyan-500/30 transition-all mb-4 font-medium"
        >
          + Start Chat
        </button>
      )}

      {showUsers && users.length > 0 && (
        <div className="mb-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-[#1a1a1d] hover:bg-[#262629] p-3 rounded-xl mb-2 shadow-sm transition"
            >
              <span className="text-gray-300">{user.name}</span>
              <button
                onClick={() => handleStartChat(user)}
                className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1 rounded shadow"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            onClick={() => {
              navigate(`/instructors/chat/${chat.chatId}`, {
                state: {
                  partnerName: chat.partnerName,
                  targetUserId: chat.partnerId,
                },
              });
            }}
            className={`p-3 rounded-xl cursor-pointer font-medium transition-all shadow-sm ${
              activeChat === chat.chatId
                ? "bg-gradient-to-r from-cyan-700 to-cyan-500 text-white shadow-cyan-500/30"
                : "bg-[#1a1a1d] hover:bg-[#262629] text-gray-300"
            }`}
          >
            {chat.partnerName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorChatList;
