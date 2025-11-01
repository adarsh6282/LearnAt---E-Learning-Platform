import React, { useState, useEffect } from "react";
import { Trash2, Save, Upload, BookOpen } from "lucide-react";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import { createCourseS, getCategory } from "../../services/instructor.services";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";
import type { AxiosError } from "axios";

interface Lesson {
  id?: number;
  title: string;
  description: string;
  duration: string;
  type: "video" | "pdf";
  file?: File | null;
}

interface Chapter {
  id?: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Module {
  id?: number;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface CourseData {
  title: string;
  description: string;
  isActive: boolean;
  category: string;
  price: number;
  modules: Module[];
}

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
    modules: [],
  });

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
    if (!courseData.title.trim()) {
      errorToast("Course title is required");
      return false;
    } else if (courseData.title.trim().length > 100) {
      errorToast("Course title cannot exceed 100 characters");
      return false;
    }

    if (!courseData.description.trim()) {
      errorToast("Course description is required");
      return false;
    } else if (courseData.description.trim().length > 500) {
      errorToast("Course description cannot exceed 500 characters");
      return false;
    }

    if (!courseData.category) {
      errorToast("Please select a category");
      return false;
    }

    if (courseData.price <= 0) {
      errorToast("Price must be greater than 0");
      return false;
    }

    if (courseData.modules.length === 0) {
      errorToast("At least one module is required");
      return false;
    }

    for (let mIndex = 0; mIndex < courseData.modules.length; mIndex++) {
      const module = courseData.modules[mIndex];

      if (!module.title.trim()) {
        errorToast(`Module ${mIndex + 1} title is required`);
        return false;
      } else if (module.title.trim().length > 20) {
        errorToast(`Module ${mIndex + 1} title cannot exceed 20 characters`);
        return false;
      }

      if (!module.description.trim()) {
        errorToast(`Module ${mIndex + 1} description is required`);
        return false;
      } else if (module.description.trim().length > 40) {
        errorToast(
          `Module ${mIndex + 1} description cannot exceed 40 characters`
        );
        return false;
      }

      if (module.chapters.length === 0) {
        errorToast(`Add at least one chapter in module ${mIndex + 1}`);
        return false;
      }

      for (let cIndex = 0; cIndex < module.chapters.length; cIndex++) {
        const chapter = module.chapters[cIndex];

        if (!chapter.title.trim()) {
          errorToast(
            `Chapter ${cIndex + 1} title is required in module ${mIndex + 1}`
          );
          return false;
        } else if (chapter.title.trim().length > 15) {
          errorToast(`Chapter ${cIndex + 1} title cannot exceed 15 characters`);
          return false;
        }

        if (!chapter.description.trim()) {
          errorToast(
            `Chapter ${cIndex + 1} description is required in module ${mIndex + 1}`
          );
          return false;
        } else if (chapter.description.trim().length > 50) {
          errorToast(
            `Chapter ${cIndex + 1} description cannot exceed 50 characters`
          );
          return false;
        }

        if (chapter.lessons.length === 0) {
          errorToast(`Add at least one lesson in chapter ${cIndex + 1}`);
          return false;
        }

        for (let lIndex = 0; lIndex < chapter.lessons.length; lIndex++) {
          const lesson = chapter.lessons[lIndex];

          if (!lesson.title.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} title is required in chapter ${cIndex + 1}`
            );
            return false;
          } else if (lesson.title.trim().length > 15) {
            errorToast(
              `Lesson ${lIndex + 1} title cannot exceed 15 characters`
            );
            return false;
          }

          if (!lesson.description.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} description is required in chapter ${cIndex + 1}`
            );
            return false;
          } else if (lesson.description.trim().length > 45) {
            errorToast(
              `Lesson ${lIndex + 1} description cannot exceed 45 characters`
            );
            return false;
          }

          if (!lesson.duration.trim()) {
            errorToast(
              `Lesson ${lIndex + 1} duration is required in chapter ${cIndex + 1}`
            );
            return false;
          }

          if (!lesson.file) {
            errorToast(
              `Please upload a file for lesson ${lIndex + 1} in chapter ${cIndex + 1}`
            );
            return false;
          }
        }
      }
    }

    if (!thumbnail) {
      errorToast("Course thumbnail is required");
      return false;
    }

    return true;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
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

  const removeModule = (moduleId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
  };

  const updateModule = (
    moduleId: number,
    field: keyof Module,
    value: string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, [field]: value } : m
      ),
    }));
  };

  const addChapter = (moduleId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
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

  const removeChapter = (moduleId: number, chapterId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, chapters: m.chapters.filter((c) => c.id !== chapterId) }
          : m
      ),
    }));
  };

  const updateChapter = (
    moduleId: number,
    chapterId: number,
    field: keyof Chapter,
    value: string
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId ? { ...c, [field]: value } : c
              ),
            }
          : m
      ),
    }));
  };

  const addLesson = (moduleId: number, chapterId: number) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId
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
    moduleId: number,
    chapterId: number,
    lessonId: number
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId
                  ? {
                      ...c,
                      lessons: c.lessons.filter((l) => l.id !== lessonId),
                    }
                  : c
              ),
            }
          : m
      ),
    }));
  };

  const updateLesson = (
    moduleId: number,
    chapterId: number,
    lessonId: number,
    field: keyof Lesson,
    value: string | File
  ) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId
                  ? {
                      ...c,
                      lessons: c.lessons.map((l) =>
                        l.id === lessonId ? { ...l, [field]: value } : l
                      ),
                    }
                  : c
              ),
            }
          : m
      ),
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) setThumbnail(file);
    else errorToast("Thumbnail must be under 5MB");
  };

  const handleFileUpload = (
    moduleId: number,
    chapterId: number,
    lessonId: number,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "pdf"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "video" && file.size > 100 * 1024 * 1024)
      return errorToast("Video must be under 100MB");
    if (type === "pdf" && file.size > 20 * 1024 * 1024)
      return errorToast("PDF must be under 20MB");
    updateLesson(moduleId, chapterId, lessonId, "file", file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("price", courseData.price.toString());
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const modulesData = courseData.modules.map((module) => ({
        title: module.title,
        description: module.description,
        chapters: module.chapters.map((chapter) => ({
          title: chapter.title,
          description: chapter.description,
          lessons: chapter.lessons.map((l) => ({
            title: l.title,
            description: l.description,
            duration: l.duration,
            type: l.type,
          })),
        })),
      }));
      formData.append("modules", JSON.stringify(modulesData));

      courseData.modules.forEach((module, mIndex) =>
        module.chapters.forEach((chapter, cIndex) =>
          chapter.lessons.forEach((lesson, lIndex) => {
            if (lesson.file) {
              formData.append("lessonFiles", lesson.file);
              formData.append(
                "lessonMeta",
                JSON.stringify({
                  moduleIndex: mIndex,
                  chapterIndex: cIndex,
                  lessonIndex: lIndex,
                  type: lesson.type,
                })
              );
            }
          })
        )
      );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-4 rounded-2xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Create New Course
              </h1>
              <p className="text-slate-600 text-base mt-2 font-medium">
                Build an engaging learning experience for your students
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-slate-800">
              Course Details
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={courseData.title}
                placeholder="Enter an engaging course title"
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Course Description
              </label>
              <textarea
                value={courseData.description}
                placeholder="Describe what students will learn in this course"
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

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
              {thumbnail && (
                <div className="mt-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {thumbnail.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-100">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-slate-800">
              Course Content
            </h2>
          </div>

          {courseData.modules.map((module, mIndex) => (
            <div
              key={module.id}
              className="border-2 border-slate-200 rounded-3xl p-8 mb-8 bg-gradient-to-br from-slate-50 to-blue-50 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {mIndex + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-2xl text-slate-800">
                    Module {mIndex + 1}
                  </h3>
                </div>
                <button
                  onClick={() => removeModule(module.id!)}
                  className="flex items-center px-5 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all duration-200 border-2 border-red-200"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Remove
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  value={module.title}
                  placeholder="Module Title"
                  onChange={(e) =>
                    updateModule(module.id!, "title", e.target.value)
                  }
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-semibold text-slate-800 bg-white"
                />
                <input
                  value={module.description}
                  placeholder="Module Description"
                  onChange={(e) =>
                    updateModule(module.id!, "description", e.target.value)
                  }
                  className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-800 bg-white"
                />
              </div>

              {module.chapters.map((chapter, cIndex) => (
                <div
                  key={chapter.id}
                  className="border-l-4 border-indigo-400 pl-6 mb-8 bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">
                          {cIndex + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-indigo-600">
                        Chapter {cIndex + 1}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeChapter(module.id!, chapter.id!)}
                      className="flex items-center px-4 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3 mb-5">
                    <input
                      value={chapter.title}
                      placeholder="Chapter Title"
                      onChange={(e) =>
                        updateChapter(
                          module.id!,
                          chapter.id!,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 font-semibold text-slate-800"
                    />
                    <input
                      value={chapter.description}
                      placeholder="Chapter Description"
                      onChange={(e) =>
                        updateChapter(
                          module.id!,
                          chapter.id!,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-slate-800"
                    />
                  </div>

                  {chapter.lessons.map((lesson, lIndex) => (
                    <div
                      key={lesson.id}
                      className="border-2 border-slate-200 rounded-2xl p-5 mb-4 bg-slate-50 hover:bg-white transition-all duration-200 hover:shadow-md"
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
                            removeLesson(module.id!, chapter.id!, lesson.id!)
                          }
                          className="flex items-center text-red-600 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          value={lesson.title}
                          placeholder="Lesson Title"
                          onChange={(e) =>
                            updateLesson(
                              module.id!,
                              chapter.id!,
                              lesson.id!,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 font-semibold text-slate-800"
                        />
                        <textarea
                          value={lesson.description}
                          placeholder="Lesson Description"
                          onChange={(e) =>
                            updateLesson(
                              module.id!,
                              chapter.id!,
                              lesson.id!,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800 resize-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={lesson.duration}
                            placeholder="Duration (e.g., 10m)"
                            onChange={(e) =>
                              updateLesson(
                                module.id!,
                                chapter.id!,
                                lesson.id!,
                                "duration",
                                e.target.value
                              )
                            }
                            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800"
                          />
                          <select
                            value={lesson.type}
                            onChange={(e) =>
                              updateLesson(
                                module.id!,
                                chapter.id!,
                                lesson.id!,
                                "type",
                                e.target.value
                              )
                            }
                            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-slate-800 cursor-pointer"
                          >
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                          </select>
                        </div>
                        <div className="relative">
                          <input
                            type="file"
                            accept={
                              lesson.type === "video"
                                ? "video/*"
                                : "application/pdf"
                            }
                            onChange={(e) =>
                              handleFileUpload(
                                module.id!,
                                chapter.id!,
                                lesson.id!,
                                e,
                                lesson.type
                              )
                            }
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 cursor-pointer transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addLesson(module.id!, chapter.id!)}
                    className="w-full mt-3 px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all duration-200 border-2 border-blue-200 hover:border-blue-300"
                  >
                    + Add Lesson
                  </button>
                </div>
              ))}

              <button
                onClick={() => addChapter(module.id!)}
                className="w-full mt-4 px-5 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all duration-200 border-2 border-indigo-200 hover:border-indigo-300"
              >
                + Add Chapter
              </button>
            </div>
          ))}

          <button
            onClick={addModule}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-lg"
          >
            + Add Module
          </button>
        </div>

        <div className="flex justify-end">
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
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
                Creating Course...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Create Course
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCreateCourse;
