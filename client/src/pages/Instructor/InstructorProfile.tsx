import React, { useState, useContext } from "react";
import { InstructorContext } from "../../context/InstructorContext";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Edit3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { editProfileS } from "../../services/instructor.services";

const InstructorProfile: React.FC = () => {
  const context = useContext(InstructorContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!context) {
    return <div>Loading Instructor...</div>;
  }

  const { instructor, setInstructor } = context;

  if (!instructor) {
    return <div>Loading Instructor...</div>;
  }

  const [formData, setFormData] = useState({
    name: instructor.name || "",
    phone: instructor.phone || "",
    title: instructor.title || "",
    yearsOfExperience: instructor.yearsOfExperience || 0,
    education: instructor.education || "",
  });

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone !== "" &&
      /^\d{10}$/.test(formData.phone) &&
      formData.title.trim() !== "" &&
      formData.education.trim() !== "" &&
      formData.yearsOfExperience > 0
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "blocked":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4" />;
      case "blocked":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("phone", formData.phone);
      formPayload.append("title", formData.title);
      formPayload.append(
        "yearsOfExperience",
        String(formData.yearsOfExperience)
      );
      formPayload.append("education", formData.education);
      if (selectedFile) {
        formPayload.append("profilePicture", selectedFile);
      }

      const res = await editProfileS(formPayload);

      setInstructor(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const accountStatus = instructor.accountStatus || "pending";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <img
              src={instructor.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-200 object-cover"
            />
            {isEditing && (
              <>
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 bg-gray-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                >
                  <span className="text-2xl font-bold">+</span>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold px-5 text-gray-900">
              {instructor.name}
            </h1>
            <p className="text-lg text-gray-600 mb-2 px-5">
              {instructor.title}
            </p>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(
                  accountStatus
                )}`}
              >
                {getStatusIcon(accountStatus)}
                <span className="capitalize">{accountStatus}</span>
              </span>
              {instructor.isVerified && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600 flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isLoading || (isEditing && !isFormValid())}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>
            {isEditing
              ? isLoading
                ? "Saving..."
                : "Save Changes"
              : "Edit Profile"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {instructor.email}
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <p className="text-gray-900">@{instructor.username}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {formData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Professional Details
            </h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.title}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{formData.title}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) =>
                      handleInputChange(
                        "yearsOfExperience",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {formData.yearsOfExperience} years
                  </p>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.education}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.education}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: instructor.name || "",
                phone: instructor.phone || "",
                title: instructor.title || "",
                yearsOfExperience: instructor.yearsOfExperience || 0,
                education: instructor.education || "",
              });
              setSelectedFile(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default InstructorProfile;
