import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Mail, User, Phone } from "lucide-react";
import { errorToast } from "../../components/Toast";
import { editProfileS } from "../../services/user.services";
import ReportForm from "../../components/ReportForm";
import PurchaseHistory from "./CoursePurchaseHistory";

const tabs = ["Profile Info", "Course History", "Our Courses", "Change Password"];

const UserProfile = () => {
  const context = useContext(UserContext);
  const { user, setUser } = context || {};
  const [activeTab, setActiveTab] = useState("Profile Info");
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

  if (!user) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        {activeTab === "Profile Info" && (
          <div>
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 group">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="absolute inset-0 bg-gray-900/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer"
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
              <h2 className="mt-4 text-white text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">@{user.username}</p>
              <ReportForm type="complaint" />
            </div>

            {/* Edit Toggle */}
            <div className="text-center mb-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              {/* Email */}
              <div>
                <label className="text-sm font-medium flex items-center mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <p className="bg-gray-800 px-3 py-2 rounded-md">{user.email}</p>
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium flex items-center mb-1">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </label>
                <p className="bg-gray-800 px-3 py-2 rounded-md">{user.username}</p>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
                  />
                ) : (
                  <p className="bg-gray-800 px-3 py-2 rounded-md">{user.name}</p>
                )}
              </div>

              {/* Phone */}
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
                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
                  />
                ) : (
                  <p className="bg-gray-800 px-3 py-2 rounded-md">{user.phone}</p>
                )}
              </div>
            </div>

            {/* Save/Cancel */}
            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={isLoading || !isFormValid()}
                  className={`flex-1 py-2 rounded-md text-white ${
                    isLoading || !isFormValid()
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "Course History" && <PurchaseHistory />}
        {/* {activeTab === "Our Courses" && <OurCourses />}
        {activeTab === "Change Password" && <ChangePassword />} */}
      </div>
    </div>
  );
};

export default UserProfile;
