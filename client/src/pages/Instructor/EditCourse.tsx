import React, { useState, useEffect } from "react";
import { Trash2, Upload, Save, Edit2 } from "lucide-react";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";
import {
  editCourseS,
  getCategory,
  getCourseById,
} from "../../services/instructor.services";
import type { AxiosError } from "axios";

interface ILesson {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  duration: string;
  url?: string;
  type: "video" | "pdf";
  file?: File | null;
}

interface IChapter {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  lessons: ILesson[];
}

interface IModule {
  id?: number;
  _id?: string;
  title: string;
  description: string;
  chapters: IChapter[];
}

interface CourseData {
  title: string;
  description: string;
  isActive: boolean;
  category: string;
  price: number;
  modules: IModule[];
  thumbnail: string;
}

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
    modules: [],
    thumbnail: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await getCategory();
        const activeNames = categoriesData.data
          .filter((cat: { name: string; isDeleted: boolean }) => !cat.isDeleted)
          .map((cat: { name: string }) => cat.name);
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
              modules: course.modules || [],
              thumbnail: course.thumbnail || "",
            });

            if (course.thumbnail) setCurrentThumbnailUrl(course.thumbnail);
          }
        }
      } catch (err) {
        console.error(err);
        errorToast("Failed to load course data");
        navigate(INSTRUCTOR_ROUTES.COURSES);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [courseId, navigate]);

  const validateForm = () => {
    if (!courseData.title.trim()) {
      errorToast("Course title is required");
      return false;
    }

    if (courseData.title.length > 25) {
      errorToast("Course title exceeded 25 charcters");
      return false;
    }

    if (!courseData.description.trim()) {
      errorToast("Course description is required");
      return false;
    }

    if (courseData.description.trim().length > 150) {
      errorToast("Course description exceeded 150 characters");
      return false;
    }

    if (!courseData.category.trim()) {
      errorToast("Please select a category");
      return false;
    }

    if (courseData.price < 0 || isNaN(courseData.price)) {
      errorToast("Price must be a valid number");
      return false;
    }

    if (!courseData.modules.length) {
      errorToast("At least one module is required");
      return false;
    }

    for (let mIndex = 0; mIndex < courseData.modules.length; mIndex++) {
      const module = courseData.modules[mIndex];
      if (!module.title.trim()) {
        errorToast(`Module ${mIndex + 1} title is required`);
        return false;
      }

      if (module.title.length > 20) {
        errorToast(`Module ${mIndex + 1} title exceed 20 characters`);
        return false;
      }

      if (!module.description.trim()) {
        errorToast(`Module ${mIndex + 1} description is required`);
        return false
      }

      if (module.description.length > 40) {
        errorToast(`Module ${mIndex + 1} description exceed 40 characters`);
        return false
      }

      if (!module.chapters.length) {
        errorToast(`Module ${mIndex + 1} must have at least one chapter`);
        return false;
      }

      for (let cIndex = 0; cIndex < module.chapters.length; cIndex++) {
        const chapter = module.chapters[cIndex];
        if (!chapter.title.trim()) {
          errorToast(`Chapter ${cIndex + 1} in ${module.title} needs a title`);
          return false;
        }

        if (chapter.title.length > 15) {
          errorToast(
            `Chapter ${cIndex + 1} title in ${module.title} has exceed 15 characters`
          );
          return false;
        }

        if (!chapter.description.trim()) {
          errorToast(
            `Chapter ${cIndex + 1} in ${module.title} needs a description`
          );
          return false;
        }

        if (chapter.description.length > 50) {
          errorToast(
            `Chapter ${cIndex + 1} description in ${module.title} exceed 50 charcters`
          );
          return false;
        }

        if (!chapter.lessons.length) {
          errorToast(`Chapter ${chapter.title} must have at least one lesson`);
          return false;
        }

        for (let lIndex = 0; lIndex < chapter.lessons.length; lIndex++) {
          const lesson = chapter.lessons[lIndex];

          if (!lesson.title.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} in chapter ${chapter.title} needs a title`
            );
            return false;
          }

          if (lesson.title.length > 15) {
            errorToast(
              `Lesson ${lIndex + 1} title in chapter ${chapter.title} exceed 15 characters`
            );
            return false;
          }

          if (!lesson.description.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} in chapter ${chapter.title} needs a description`
            );
            return false;
          }

          if (lesson.description.length > 45) {
            errorToast(
              `Lesson ${lIndex + 1} description in chapter ${chapter.title} exceed 45 characters`
            );
            return false;
          }

          if (!lesson.type) {
            errorToast(`Please select a type for lesson "${lesson.title}"`);
            return false;
          }

          if (!lesson.duration.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} duration is required in chapter ${cIndex + 1}`
            );
            return false;
          }

          if (!lesson.url && !lesson.file) {
            errorToast(`Lesson "${lesson.title}" must have a file or URL`);
            return false;
          }
        }
      }
    }

    if (!thumbnail && !courseData.thumbnail) {
      errorToast("Course thumbnail is required");
      return false;
    }

    return true;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) setThumbnail(file);
    else errorToast("Thumbnail must be under 5MB");
  };

  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { id: Date.now(), title: "", description: "", chapters: [] },
      ],
    }));
  };

  const removeModule = (moduleId: number | string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter(
        (m) => m.id !== moduleId && m._id !== moduleId
      ),
    }));
  };

  const updateModule = (
    moduleId: number | string,
    field: keyof IModule,
    value: string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addChapter = (moduleId: number | string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId
          ? {
              ...m,
              chapters: [
                ...m.chapters,
                { id: Date.now(), title: "", description: "", lessons: [] },
              ],
            }
          : m
      ),
    }));
  };

  const removeChapter = (
    moduleId: number | string,
    chapterId: number | string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId
          ? {
              ...m,
              chapters: m.chapters.filter(
                (c) => c.id !== chapterId && c._id !== chapterId
              ),
            }
          : m
      ),
    }));
  };

  const updateChapter = (
    moduleId: string,
    chapterId: string,
    field: keyof IChapter,
    value: string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((mod) =>
        mod._id === moduleId
          ? {
              ...mod,
              chapters: mod.chapters.map((ch) =>
                ch._id === chapterId ? { ...ch, [field]: value } : ch
              ),
            }
          : mod
      ),
    }));
  };

  const addLesson = (moduleId: number | string, chapterId: number | string) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId || c._id === chapterId
                  ? {
                      ...c,
                      lessons: [
                        ...c.lessons,
                        {
                          id: Date.now(),
                          title: "",
                          description: "",
                          duration: "",
                          type: "video",
                          file: null,
                        },
                      ],
                    }
                  : c
              ),
            }
          : m
      ),
    }));
  };

  const removeLesson = (
    moduleId: number | string,
    chapterId: number | string,
    lessonId: number | string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId || c._id === chapterId
                  ? {
                      ...c,
                      lessons: c.lessons.filter(
                        (l) => l.id !== lessonId && l._id !== lessonId
                      ),
                    }
                  : c
              ),
            }
          : m
      ),
    }));
  };

  const updateLesson = (
    moduleId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    field: keyof ILesson,
    value: string | File
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId || m._id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId || c._id === chapterId
                  ? {
                      ...c,
                      lessons: c.lessons.map((l) =>
                        l.id === lessonId || l._id === lessonId
                          ? { ...l, [field]: value }
                          : l
                      ),
                    }
                  : c
              ),
            }
          : m
      ),
    }));
  };

  const handleFileUpload = (
    moduleId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024)
      return errorToast("File must be under 100MB");
    updateLesson(moduleId, chapterId, lessonId, "file", file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("isActive", String(courseData.isActive));
      formData.append("category", courseData.category);
      formData.append("price", String(courseData.price));

      if (thumbnail) formData.append("thumbnail", thumbnail);

      const modulesPayload = courseData.modules.map((mod) => ({
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        chapters: mod.chapters.map((ch, cIndex) => ({
          _id: ch._id,
          title: ch.title,
          description: ch.description,
          lectures: ch.lessons.map((l, lIndex) => ({
            _id: l._id,
            title: l.title,
            description: l.description,
            duration: l.duration,
            type: l.type,
            url: l.url,
            chapterIndex: cIndex,
            lectureIndex: lIndex,
          })),
        })),
      }));

      formData.append("modules", JSON.stringify(modulesPayload));

      courseData.modules.forEach((mod, mIndex) =>
        mod.chapters.forEach((ch, cIndex) =>
          ch.lessons.forEach((l, lIndex) => {
            if (l.file) {
              formData.append("lectureFiles", l.file);
              formData.append(
                "lectureMeta",
                JSON.stringify({
                  moduleIndex: mIndex,
                  chapterIndex: cIndex,
                  lectureIndex: lIndex,
                  lectureId: l._id || l.id,
                })
              );
            }
          })
        )
      );

      const response = await editCourseS(courseId!, formData);
      if (response.status === 200) {
        successToast("Course updated successfully");
        navigate(INSTRUCTOR_ROUTES.COURSES);
      }
    } catch (err) {
      console.error(err);
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message || "Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-4 rounded-2xl shadow-lg">
              <Edit2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Edit Course
              </h1>
              <p className="text-slate-600 text-base mt-2 font-medium">
                Update your course details and content
              </p>
            </div>
          </div>
        </div>

        {/* Course Details Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-slate-800">
              Course Details
            </h2>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter an engaging course title"
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Description
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what students will learn in this course"
                rows={4}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white transition-all duration-200 text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Course Thumbnail
              </label>
              <label className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <Upload className="w-5 h-5 mr-3" />
                <span>Upload Thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
              {currentThumbnailUrl && !thumbnail && (
                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2 font-medium">
                    Current Thumbnail:
                  </p>
                  <img
                    src={currentThumbnailUrl}
                    alt="Current Thumbnail"
                    className="w-40 h-40 object-cover rounded-2xl border-2 border-slate-200 shadow-md"
                  />
                </div>
              )}
              {thumbnail && (
                <div className="mt-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    New thumbnail selected: {thumbnail.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-slate-800">
              Course Content
            </h2>
          </div>

          <div className="space-y-8">
            {courseData.modules.map((mod, modIndex) => (
              <div
                key={mod.id || mod._id}
                className="border-2 border-slate-200 rounded-3xl p-8 bg-gradient-to-br from-slate-50 to-blue-50 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {modIndex + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-2xl text-slate-800">
                      Module {modIndex + 1}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeModule(mod.id || mod._id!)}
                    className="flex items-center px-5 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all duration-200 border-2 border-red-200"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Remove
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Module Title
                    </label>
                    <input
                      placeholder="Enter module title"
                      value={mod.title}
                      onChange={(e) =>
                        updateModule(
                          mod.id || mod._id!,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Module Description
                    </label>
                    <textarea
                      placeholder="Describe what this module covers"
                      value={mod.description}
                      onChange={(e) =>
                        updateModule(
                          mod.id || mod._id!,
                          "description",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Chapters */}
                <div className="space-y-6">
                  {(mod.chapters || []).map((ch, chIndex) => (
                    <div
                      key={ch.id || ch._id}
                      className="border-l-4 border-indigo-400 pl-6 bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-sm">
                              {chIndex + 1}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg text-indigo-600">
                            Chapter {chIndex + 1}
                          </h4>
                        </div>
                        <button
                          onClick={() =>
                            removeChapter(mod.id || mod._id!, ch.id || ch._id!)
                          }
                          className="flex items-center px-4 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Chapter Title
                          </label>
                          <input
                            placeholder="Enter chapter title"
                            value={ch.title}
                            onChange={(e) =>
                              updateChapter(
                                mod._id!,
                                ch._id!,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Chapter Description
                          </label>
                          <textarea
                            placeholder="Describe what this chapter covers"
                            value={ch.description}
                            onChange={(e) =>
                              updateChapter(
                                mod._id!,
                                ch._id!,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-slate-800 resize-none"
                          />
                        </div>
                      </div>

                      {/* Lessons */}
                      <div className="space-y-4">
                        {(ch.lessons || []).map((l, lIndex) => (
                          <div
                            key={l.id || l._id}
                            className="border-2 border-slate-200 rounded-2xl p-5 bg-slate-50 hover:bg-white transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
                                  <span className="text-slate-600 font-bold text-xs">
                                    {lIndex + 1}
                                  </span>
                                </div>
                                <span className="font-bold text-slate-700">
                                  Lesson {lIndex + 1}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  removeLesson(
                                    mod.id || mod._id!,
                                    ch.id || ch._id!,
                                    l.id || l._id!
                                  )
                                }
                                className="flex items-center text-red-600 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Lesson Title
                                </label>
                                <input
                                  placeholder="Enter lesson title"
                                  value={l.title}
                                  onChange={(e) =>
                                    updateLesson(
                                      mod.id || mod._id!,
                                      ch.id || ch._id!,
                                      l.id || l._id!,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 font-semibold text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Lesson Description
                                </label>
                                <textarea
                                  placeholder="Describe what this lesson covers"
                                  value={l.description}
                                  onChange={(e) =>
                                    updateLesson(
                                      mod.id || mod._id!,
                                      ch.id || ch._id!,
                                      l.id || l._id!,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800 resize-none"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Duration
                                  </label>
                                  <input
                                    placeholder="e.g., 10m"
                                    value={l.duration}
                                    onChange={(e) =>
                                      updateLesson(
                                        mod.id || mod._id!,
                                        ch.id || ch._id!,
                                        l.id || l._id!,
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Content Type
                                  </label>
                                  <select
                                    value={l.type}
                                    onChange={(e) =>
                                      updateLesson(
                                        mod.id || mod._id!,
                                        ch.id || ch._id!,
                                        l.id || l._id!,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800 cursor-pointer"
                                  >
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                  Lesson File
                                </label>
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      mod.id || mod._id!,
                                      ch.id || ch._id!,
                                      l.id || l._id!,
                                      e
                                    )
                                  }
                                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 cursor-pointer transition-all duration-200"
                                />
                                {l.url && !l.file && (
                                  <p className="text-xs mt-2 text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                                    📄 Existing file:{" "}
                                    {l.url.split("/").pop() || "View File"}
                                  </p>
                                )}

                                {l.file && (
                                  <p className="text-xs mt-2 text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                    📎 New file selected: {l.file.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() =>
                            addLesson(mod.id || mod._id!, ch.id || ch._id!)
                          }
                          className="w-full mt-3 px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all duration-200 border-2 border-blue-200 hover:border-blue-300"
                        >
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addChapter(mod.id || mod._id!)}
                    className="w-full mt-4 px-5 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all duration-200 border-2 border-indigo-200 hover:border-indigo-300"
                  >
                    + Add Chapter
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addModule}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-lg"
          >
            + Add Module
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating Course...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Update Course
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
