import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Mail, User, Phone } from "lucide-react";
import { errorToast } from "../../components/Toast";
import { editProfileS } from "../../services/user.services";

const UserProfile = () => {
  const context = useContext(UserContext);

  if (!context) {
    return <div>Loading User...</div>;
  }

  const { user, setUser } = context;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone !== "" &&
      /^\d{10}$/.test(formData.phone)
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("phone", formData.phone);

      if (selectedFile) {
        formPayload.append("profilePicture", selectedFile);
      }
      console.log(selectedFile);
      const token = localStorage.getItem("usersToken");
      const res = await editProfileS(formPayload, token!);

      setUser(res.data);

      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name,
      phone: user.phone,
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
      }));
    }
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
          />

          {isEditing && (
            <>
              {/* Overlay + Upload Button */}
              <label
                htmlFor="profile-upload"
                className="absolute inset-0 bg-gray-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
              >
                <span className="text-2xl font-bold">+</span>
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="hidden"
              />
            </>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
        <p className="text-white">@{user?.username}</p>
      </div>

      {/* Edit Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Fields */}
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <p className="px-3 py-2 bg-gray-50 rounded-md">{user?.email}</p>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            <User className="w-4 h-4 inline mr-2" />
            Username
          </label>
          <p className="px-3 py-2 bg-gray-50 rounded-md">{user?.username}</p>
        </div>

        {/* Name and Phone in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{user?.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{user?.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading || !isFormValid()}
            className={`flex-1 px-4 py-2 rounded-md text-white transition-colors ${
              isLoading || !isFormValid()
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
