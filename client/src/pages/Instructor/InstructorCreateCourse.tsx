import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Save } from "lucide-react";
import type { CourseData, Lecture } from "../../types/course.types";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import { createCourseS } from "../../services/instructor.services";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";
import { getCategory } from "../../services/instructor.services";
import type { AxiosError } from "axios";

const InstructorCreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    isActive: true,
    category: "",
    price: 0,
    lectures: [],
  });

  const [newLecture, setNewLecture] = useState<Lecture>({
    title: "",
    description: "",
    videoFile: null,
    duration: "",
    order: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await getCategory();
        const activeNames = response.data
          .filter((cat: { name: string; isDeleted: boolean }) => !cat.isDeleted)
          .map((cat: { name: string; isDeleted: boolean }) => cat.name);
        setCategories(activeNames);
      } catch (err) {
        console.error("Failed to load categories:", err);
        errorToast("Failed to load categories");
      }
    };

    getCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!courseData.title.trim()) {
      newErrors.title = "Course title is required";
    }
    if (!courseData.description.trim()) {
      newErrors.description = "Course description is required";
    }
    if (!courseData.category) {
      newErrors.category = "Please select a category";
    }
    if (courseData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (courseData.price > 10000) {
      newErrors.price = "Price must not be greater than 10000";
    }
    if (courseData.lectures.length === 0) {
      newErrors.lectures = "At least one lecture is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLectureInputChange = (field: string, value: string) => {
    setNewLecture((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        errorToast("File size should be less than 100MB");
        return;
      }
      setNewLecture((prev) => ({
        ...prev,
        videoFile: file,
      }));
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setThumbnail(file);
    } else {
      errorToast("Thumbnail must be under 5MB");
    }
  };

  const addLecture = () => {
    if (!newLecture.title || !newLecture.description || !newLecture.videoFile) {
      errorToast("Please fill in all lecture details and upload a video");
      return;
    }

    const lecture = {
      ...newLecture,
      id: Date.now(),
      order: courseData.lectures.length + 1,
    };

    setCourseData((prev) => ({
      ...prev,
      lectures: [...prev.lectures, lecture],
    }));

    setNewLecture({
      title: "",
      description: "",
      videoFile: null,
      duration: "",
      order: courseData.lectures.length + 2,
    });
  };

  const removeLecture = (lectureId: number) => {
    setCourseData((prev) => ({
      ...prev,
      lectures: prev.lectures.filter((lecture) => lecture.id !== lectureId),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("price", courseData.price.toString());

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const lecturesData = courseData.lectures.map(
        ({ _id, id, title, description, videoUrl, duration, order }) => ({
          _id,
          id,
          title,
          description,
          videoUrl,
          duration,
          order,
        })
      );
      formData.append("lectures", JSON.stringify(lecturesData));

      courseData.lectures.forEach((lecture) => {
        if (lecture.videoFile) {
          formData.append("videos", lecture.videoFile);
        }
      });

      const response = await createCourseS(formData);

      if (response.status === 201) {
        successToast("Course created successfully!");
        navigate(INSTRUCTOR_ROUTES.COURSES);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 py-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to create your course
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                placeholder="Enter course title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                value={courseData.description}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Provide a detailed description of your course"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  value={courseData.price}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail *
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                  {thumbnail && (
                    <span className="text-sm text-gray-600">
                      {thumbnail.name}
                    </span>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add Lectures
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    value={newLecture.title}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) =>
                      handleLectureInputChange("title", e.target.value)
                    }
                    placeholder="Enter lecture title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLecture.duration}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) =>
                      handleLectureInputChange("duration", e.target.value)
                    }
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Description *
                </label>
                <textarea
                  value={newLecture.description}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  onChange={(e) =>
                    handleLectureInputChange("description", e.target.value)
                  }
                  placeholder="Describe what students will learn in this lecture"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File *
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose Video File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {newLecture.videoFile && (
                    <span className="text-sm text-gray-600">
                      {newLecture.videoFile.name}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={addLecture}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lecture</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Added Lectures ({courseData.lectures.length})
            </h3>
            {courseData.lectures.map((lecture, index) => (
              <div
                key={lecture.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                        Lecture {index + 1}
                      </span>
                      {lecture.duration && (
                        <span className="text-sm text-gray-500">
                          {lecture.duration} minutes
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {lecture.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {lecture.description}
                    </p>
                    {lecture.videoFile && (
                      <p className="text-xs text-blue-600">
                        Video: {lecture.videoFile.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeLecture(lecture.id!)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate(INSTRUCTOR_ROUTES.COURSES)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Creating..." : "Create Course"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCreateCourse;
