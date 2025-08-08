import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Mail, User, Phone } from "lucide-react";
import { errorToast } from "../../components/Toast";
import { editProfileS } from "../../services/user.services";
import ReportForm from "../../components/ReportForm";
import PurchaseHistory from "./CoursePurchaseHistory";
import PurchasedCourses from "./PurchasedCourses";
import ChangePassword from "./ChangePassword";
import Navbar from "../../components/Navbar";
import UserCertificates from "./Certificates";

const tabs = ["Profile", "Course History", "Our Courses", "Certificates", "Change Password"];

const UserProfile = () => {
  const context = useContext(UserContext);
  const { user, setUser } = context || {};
  const [activeTab, setActiveTab] = useState("Profile");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, phone: user.phone });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && /^\d{10}$/.test(formData.phone);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("phone", formData.phone);
      if (selectedFile) formPayload.append("profilePicture", selectedFile);
      console.log(selectedFile)

      const res = await editProfileS(formPayload);
      setUser?.(res.data);
      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({ name: user.name, phone: user.phone });
    setIsEditing(false);
  };

  if (!user) return <div className="text-slate-100 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-blob1 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob2 pointer-events-none" />
      <Navbar/>
      <div className="max-w-4xl mx-auto pt-16 px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white shadow"
                    : "bg-white/10 text-slate-200 hover:bg-cyan-400/10"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          {activeTab === "Profile" && (
            <div>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 group">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400/30"
                  />
                  {isEditing && (
                    <>
                      <label
                        htmlFor="profile-upload"
                        className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition"
                      >
                        +
                      </label>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <h2 className="mt-4 text-slate-100 text-2xl font-bold">{user.name}</h2>
                <p className="text-slate-400">@{user.username}</p>
                <ReportForm type="complaint" />
              </div>

              <div className="text-center mb-6">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition-all"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-100">
                <div>
                  <label className="text-sm font-medium flex items-center mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="bg-white/10 px-3 py-2 rounded-md">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </label>
                  <p className="bg-white/10 px-3 py-2 rounded-md">{user.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md bg-white/10 text-slate-100 border border-cyan-400/10"
                    />
                  ) : (
                    <p className="bg-white/10 px-3 py-2 rounded-md">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center mb-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md bg-white/10 text-slate-100 border border-cyan-400/10"
                    />
                  ) : (
                    <p className="bg-white/10 px-3 py-2 rounded-md">{user.phone}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !isFormValid()}
                    className={`flex-1 py-2 rounded-full text-white font-semibold transition-all ${
                      isLoading || !isFormValid()
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 shadow"
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 rounded-full bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Course History" && <PurchaseHistory />}
          {activeTab === "Our Courses" && <PurchasedCourses />}
          {activeTab === "Change Password" && <ChangePassword />}
          {activeTab === "Certificates" && <UserCertificates />}
        </div>

        <style>
          {`
          @keyframes blob1 {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(-30px) scale(1.1);}
          }
          .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
          @keyframes blob2 {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(30px) scale(1.1);}
          }
          .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
          `}
        </style>
      </div>
    </div>
  );
};

export default UserProfile;
