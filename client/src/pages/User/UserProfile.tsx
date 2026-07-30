import { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { Mail, User, Phone, Camera, Save } from "lucide-react";
import { errorToast } from "../../components/Toast";
import { editProfileS } from "../../services/user.services";
import ReportForm from "../../components/ReportForm";
import PurchaseHistory from "./CoursePurchaseHistory";
import PurchasedCourses from "./PurchasedCourses";
import ChangePassword from "./ChangePassword";
import Navbar from "../../components/Navbar";
import UserCertificates from "./Certificates";
import { useLocation } from "react-router-dom";
import type { AxiosError } from "axios";

const UserProfile = () => {
  const context = useContext(UserContext);
  const { user, setUser } = context || {};
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "Profile"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const tabs = [
    "Profile",
    "Course History",
    "My Courses",
    "Certificates",
    ...(user?.googleId ? [] : ["Change Password"]),
  ];

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, phone: user.phone });
    }
  }, [user]);

  const validateForm = () => {
    if (formData.name.length > 20) {
      errorToast("Name cannot exceed 20 characters");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      errorToast("Phone number must be exactly 10 digits");
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return formData.name.trim() !== "";
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("phone", formData.phone);
      if (selectedFile) formPayload.append("profilePicture", selectedFile);

      const res = await editProfileS(formPayload);
      setUser?.(res.data);
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({ name: user.name, phone: user.phone });
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (!user)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-green-400 text-lg">Loading profile...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "0.3cm 0.3cm",
        }}
      />

      <Navbar />

      <div className="relative max-w-5xl mx-auto pt-32 pb-20 px-5">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ring-1
                ${
                  activeTab === tab
                    ? "bg-green-500 text-black ring-transparent shadow-lg shadow-green-500/20"
                    : "bg-white/5 text-neutral-300 ring-white/10 hover:bg-white/10 hover:text-white hover:ring-green-500/30"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-xl ring-1 ring-white/10">
          {activeTab === "Profile" && (
            <div>
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-32 h-32 group">
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-black ring-2 ring-green-500/50 shadow-lg shadow-green-500/10"
                  />
                  {isEditing && (
                    <>
                      <label
                        htmlFor="profile-upload"
                        className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 ring-2 ring-green-500/50"
                      >
                        <Camera className="w-6 h-6 text-green-400" />
                      </label>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <h2 className="mt-5 text-white text-3xl font-extrabold tracking-tight">
                  {user.name}
                </h2>
                <p className="text-neutral-400 text-md">@{user.username}</p>
                
                <div className="mt-4">
                  <ReportForm type="complaint" />
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                  className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ring-1 bg-white/5 text-white ring-white/10 hover:bg-white/10 hover:ring-green-500/40 hover:text-green-400 cursor-pointer"
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2 text-neutral-300">
                    <Mail className="w-4 h-4 text-green-400" />
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/5 text-neutral-400 cursor-not-allowed">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2 text-neutral-300">
                    <User className="w-4 h-4 text-green-400" />
                    Username
                  </label>
                  <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/5 text-neutral-400 cursor-not-allowed">
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2 text-neutral-300">
                    <User className="w-4 h-4 text-green-400" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-white">
                      {user.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2 text-neutral-300">
                    <Phone className="w-4 h-4 text-green-400" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-white/10 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-white">
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 mt-10 max-w-xl mx-auto">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 rounded-full bg-white/5 text-white font-semibold ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !isFormValid()}
                    className={`group/btn relative flex-1 inline-flex items-center justify-center py-3 px-6 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 cursor-pointer
                      ${
                        isLoading || !isFormValid()
                          ? "bg-neutral-700 text-neutral-400 cursor-not-allowed ring-white/0"
                          : "bg-white/5 text-neutral-300 ring-white/10 hover:ring-green-500/30 hover:-translate-y-0.5"
                      }`}
                  >
                    {!isLoading && isFormValid() && (
                      <span className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-600 ease-out"></span>
                    )}
                    <span className={`relative z-10 flex items-center gap-2 transition-colors duration-500 ${!isLoading && isFormValid() ? "group-hover/btn:text-black" : ""}`}>
                      {isLoading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "Course History" && <PurchaseHistory />}
          {activeTab === "My Courses" && <PurchasedCourses />}
          {activeTab === "Change Password" && <ChangePassword />}
          {activeTab === "Certificates" && <UserCertificates />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;