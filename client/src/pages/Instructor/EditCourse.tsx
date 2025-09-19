import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, Save, Edit2 } from "lucide-react";
import type { CourseData, Lecture } from "../../types/course.types";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";
import {
  editCourseS,
  getCategory,
  getCourseById,
} from "../../services/instructor.services";
import type { AxiosError } from "axios";

const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string>("");

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
  const [lectureToEdit, setLectureToEdit] = useState<Lecture | null>(null);
  const [isEditingLecture, setIsEditingLecture] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await getCategory();
        console.log(categoriesData.data);
        const activeNames = categoriesData.data
          .filter((cat: { name: string; isDeleted: boolean }) => !cat.isDeleted)
          .map((cat: { name: string; isDeleted: boolean }) => cat.name);
        setCategories(activeNames);

        if (courseId) {
          const courseResponse = await getCourseById(courseId);

          if (courseResponse.status === 200) {
            const course = courseResponse.data;
            setCourseData({
              title: course.title || "",
              description: course.description || "",
              isActive: course.isActive ?? true,
              category: course.category || "",
              price: course.price || 0,
              lectures: course.lectures || [],
            });

            if (course.thumbnail) {
              setCurrentThumbnailUrl(course.thumbnail);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        errorToast("Failed to load course data");
        navigate(INSTRUCTOR_ROUTES.COURSES);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId, navigate]);

  if (!courseId) {
    return <div>No course id</div>;
  }

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
    if (isEditingLecture && lectureToEdit) {
      setLectureToEdit((prev) => ({
        ...prev!,
        [field]: value,
      }));
    } else {
      setNewLecture((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        errorToast("File size should be less than 100MB");
        return;
      }

      if (isEditingLecture && lectureToEdit) {
        setLectureToEdit((prev) => ({
          ...prev!,
          videoFile: file,
        }));
      } else {
        setNewLecture((prev) => ({
          ...prev,
          videoFile: file,
        }));
      }
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      console.log(file);
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

  const startEditingLecture = (lecture: Lecture) => {
    setLectureToEdit({ ...lecture });
    setIsEditingLecture(true);
  };

  const saveEditedLecture = () => {
    if (!lectureToEdit?.title || !lectureToEdit?.description) {
      errorToast("Please fill in all lecture details");
      return;
    }

    if (
      !lectureToEdit.videoFile &&
      !lectureToEdit.videoUrl &&
      lectureToEdit._id
    ) {
      const existingLecture = courseData.lectures.find(
        (lec) => lec._id === lectureToEdit._id
      );
      if (existingLecture) {
        lectureToEdit.videoUrl = existingLecture.videoUrl;
      }
    }

    setCourseData((prev) => ({
      ...prev,
      lectures: prev.lectures.map((lecture) =>
        (lecture._id || lecture.id) === (lectureToEdit._id || lectureToEdit.id)
          ? lectureToEdit
          : lecture
      ),
    }));

    setLectureToEdit(null);
    setIsEditingLecture(false);
  };
  const cancelEditingLecture = () => {
    setLectureToEdit(null);
    setIsEditingLecture(false);
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

      const existingLectures = courseData.lectures.filter(
        (lecture) => !lecture.videoFile
      );
      const newLectures = courseData.lectures.filter(
        (lecture) => lecture.videoFile
      );

      if (existingLectures.length > 0) {
        formData.append("existingLectures", JSON.stringify(existingLectures));
      }

      if (newLectures.length > 0) {
        const newLecturesData = newLectures.map(
          ({ title, description, videoUrl, duration, order, _id, id }) => ({
            title,
            description,
            videoUrl,
            duration,
            order,
            _id,
            id,
          })
        );
        formData.append("newLectures", JSON.stringify(newLecturesData));

        newLectures.forEach((lecture) => {
          if (lecture.videoFile) {
            formData.append("videos", lecture.videoFile);
          }
        });
      }

      const response = await editCourseS(courseId, formData);

      if (response.status === 200) {
        successToast("Course updated successfully!");
        navigate(INSTRUCTOR_ROUTES.COURSES);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLecture = isEditingLecture ? lectureToEdit : newLecture;

  return (
    <div className="h-full bg-gray-50 py-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">
            Modify your course details and content
          </p>
        </div>

        <div className="space-y-6">
          {/* Course Details Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseData.title}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                onChange={(e) => handleInputChange("title", e.target.value)}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choose New Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                  {thumbnail ? (
                    <span className="text-sm text-gray-600">
                      {thumbnail.name}
                    </span>
                  ) : currentThumbnailUrl ? (
                    <span className="text-sm text-gray-600">
                      Current thumbnail uploaded
                    </span>
                  ) : null}
                </div>
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.thumbnail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditingLecture ? "Edit Lecture" : "Add New Lecture"}
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
                      value={currentLecture?.title || ""}
                      onChange={(e) =>
                        handleLectureInputChange("title", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
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
                      value={currentLecture?.duration || ""}
                      onChange={(e) =>
                        handleLectureInputChange("duration", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.repeat) e.preventDefault();
                      }}
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
                    value={currentLecture?.description || ""}
                    onChange={(e) =>
                      handleLectureInputChange("description", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    placeholder="Describe what students will learn in this lecture"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File {!isEditingLecture && "*"}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>
                        {isEditingLecture
                          ? "Change Video File"
                          : "Choose Video File"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {currentLecture?.videoFile && (
                      <span className="text-sm text-gray-600">
                        {currentLecture.videoFile.name}
                      </span>
                    )}
                    {isEditingLecture && !currentLecture?.videoFile && (
                      <span className="text-sm text-gray-600">
                        Current video will be kept
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isEditingLecture ? (
                    <>
                      <button
                        onClick={saveEditedLecture}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={cancelEditingLecture}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={addLecture}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Lecture</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* added lectures list */}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Course Lectures ({courseData.lectures.length})
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
                      {lecture.videoFile ? (
                        <p className="text-xs text-blue-600">
                          New Video: {lecture.videoFile.name}
                        </p>
                      ) : (
                        <p className="text-xs text-green-600">
                          Existing video file
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingLecture(lecture)}
                        disabled={isEditingLecture}
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeLecture(lecture.id!)}
                        disabled={isEditingLecture}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {errors.lectures && (
                <p className="mt-1 text-sm text-red-600">{errors.lectures}</p>
              )}
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
              disabled={isSubmitting || isEditingLecture}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Updating..." : "Update Course"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
