import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, Layers, FolderOpen, PlayCircle, FileText } from "lucide-react";
import { errorToast } from "../../components/Toast";
import type { CourseViewType } from "../../types/user.types";
import { AdminCourseViewS } from "../../services/admin.services";
import { Viewer, Worker } from "@react-pdf-viewer/core";

const AdminCourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const res = await AdminCourseViewS(courseId);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        errorToast("Failed to load course");
        setError("Course not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] overflow-hidden pt-20 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="h-[calc(100vh-80px)] overflow-hidden pt-20 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white rounded-full p-6 shadow-lg inline-block mb-4">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Not Found</h2>
          <p className="text-slate-600 mb-6">{error || "The course you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalLectures =
    course.modules?.reduce(
      (modSum, mod) =>
        modSum +
        mod.chapters.reduce((chSum, ch) => chSum + ch.lessons.length, 0),
      0
    ) ?? 0;

  const totalDuration =
    course.modules?.reduce(
      (modSum, mod) =>
        modSum +
        mod.chapters.reduce(
          (chSum, ch) =>
            chSum +
            ch.lessons.reduce(
              (lecSum, lec) => lecSum + (parseInt(lec.duration) || 0),
              0
            ),
          0
        ),
      0
    ) ?? 0;

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="max-w-6xl mx-auto pb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 top-20 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-100 leading-relaxed max-w-3xl line-clamp-2">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2.5 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{totalLectures}</p>
                <p className="text-xs text-slate-600">Lectures</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2.5 rounded-lg">
                <Layers className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{course.modules?.length || 0}</p>
                <p className="text-xs text-slate-600">Modules</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2.5 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{totalDuration}</p>
                <p className="text-xs text-slate-600">Minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2.5 rounded-lg">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">₹{course.price}</p>
                <p className="text-xs text-slate-600">Price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content - Scrollable */}
        {course.modules && course.modules.length > 0 ? (
          <div className="space-y-6">
            {course.modules.map((mod, modIndex) => (
              <div
                key={mod._id || modIndex}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
              >
                {/* Module Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-2">
                        Module {modIndex + 1}
                      </span>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {mod.title}
                      </h2>
                      <p className="text-slate-300 text-sm">{mod.description}</p>
                    </div>
                  </div>
                </div>

                {mod.chapters && mod.chapters.length > 0 ? (
                  <div className="p-5 space-y-5">
                    {mod.chapters.map((chapter, chIndex) => (
                      <div
                        key={chapter._id || chIndex}
                        className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                      >
                        <div className="bg-slate-50 p-4 border-b border-slate-200">
                          <h3 className="text-base font-semibold text-slate-800 mb-1">
                            Chapter {chIndex + 1}: {chapter.title}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {chapter.description}
                          </p>
                        </div>

                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          <div className="p-4 space-y-4">
                            {chapter.lessons.map((lecture, lecIndex) => (
                              <div
                                key={lecture._id || lecIndex}
                                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                              >

                                <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1.5">
                                        {lecture.type === "video" ? (
                                          <PlayCircle className="h-4 w-4 text-blue-600" />
                                        ) : (
                                          <FileText className="h-4 w-4 text-purple-600" />
                                        )}
                                        <h4 className="font-semibold text-slate-800 text-sm">
                                          Lecture {lecIndex + 1}: {lecture.title}
                                        </h4>
                                      </div>
                                      <p className="text-sm text-slate-600 leading-relaxed">
                                        {lecture.description}
                                      </p>
                                    </div>
                                    {lecture.duration && (
                                      <span className="ml-4 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                                        {lecture.duration} min
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="p-4">
                                  {lecture.url && lecture.type === "video" ? (
                                    <div className="rounded-lg overflow-hidden shadow-lg bg-black">
                                      <video
                                        controls
                                        controlsList="nodownload"
                                        className="w-full"
                                        style={{ maxHeight: "450px" }}
                                        src={lecture.url}
                                      />
                                    </div>
                                  ) : lecture.url && lecture.type === "pdf" ? (
                                    <div className="border-2 border-slate-300 rounded-lg overflow-hidden shadow-inner">
                                      <div
                                        className="custom-scrollbar"
                                        style={{
                                          height: "450px",
                                          overflowY: "auto",
                                          backgroundColor: "#f8fafc",
                                        }}
                                      >
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                          <Viewer fileUrl={lecture.url} />
                                        </Worker>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                                      <FileText className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                      <p className="text-slate-500 font-medium text-sm">
                                        No content available
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">No lectures in this chapter.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No chapters in this module.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <BookOpen className="h-14 w-14 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No Modules Available</h3>
            <p className="text-slate-600 text-sm">This course doesn't have any modules yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseView;