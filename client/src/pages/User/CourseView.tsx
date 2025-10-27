import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProgressS,
  getSpecificCourseS,
  markLectureWatchedS,
} from "../../services/user.services";
import type { CourseViewType, Lecture } from "../../types/user.types";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Award,
  Clock,
  FileText,
  Layers,
} from "lucide-react";
import ReportForm from "../../components/ReportForm";
import Navbar from "../../components/Navbar";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { createApi } from "../../services/newApiService";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lecture | null>(null);
  const [liveSession, setLiveSession] = useState<{
    sessionId: string;
    isLive: boolean;
  } | null>(null);

  const navigate = useNavigate();
  const [watchedLectures, setWatchedLectures] = useState<string[]>([]);
  const [isCertificateIssued, setIsCertificateIssued] = useState<boolean>(false);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const res = await getSpecificCourseS(courseId);
      const courseData = res.data.course;
      setCourse(courseData);

      const firstLesson = courseData.modules?.[0]?.chapters?.[0]?.lessons?.[0];
      if (firstLesson) setSelectedLesson(firstLesson);

      const progressRes = await getProgressS(courseId);
      setWatchedLectures(
        Array.isArray(progressRes.data.watchedLectures)
          ? progressRes.data.watchedLectures
          : []
      );
      setIsCertificateIssued(progressRes.data.isCertificateIssued || false);
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLive = async () => {
      if (!courseId) return;
      const api = createApi("user");
      try {
        const { data } = await api.get(`/users/course/live/${courseId}`);
        if (data && data.isLive) {
          setLiveSession({ sessionId: data._id, isLive: data.isLive });
        } else {
          setLiveSession(null);
        }
      } catch (err) {
        console.log("No live session", err);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, [courseId]);

  if (!courseId) return null;

  const handleTimeUpdate = async (
    e: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = e.currentTarget;
    const percent = (video.currentTime / video.duration) * 100;

    if (
      percent > 90 &&
      selectedLesson &&
      !watchedLectures.includes(selectedLesson._id)
    ) {
      try {
        await markLectureWatchedS(courseId, selectedLesson._id);
        setWatchedLectures((prev) => [...prev, selectedLesson._id]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
        <BookOpen className="w-16 h-16 mb-4 animate-bounce text-cyan-400" />
        <p className="mt-2 text-xl font-semibold text-gray-300">
          Loading your course...
        </p>
      </div>
    );
  }

  const allLessons = course.modules?.flatMap((m) => 
    m.chapters.flatMap((c) => c.lessons)
  ) || [];
  const progressPercent = Math.floor(
    (watchedLectures.length / (allLessons.length || 1)) * 100
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-slate-100 relative overflow-hidden">
      <Navbar />

      <div className="flex h-[calc(100vh-5rem)]">
        <aside className="w-96 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 sticky top-0 z-20 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                {course.title}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                  Overall Progress
                </span>
                <span className="text-lg font-bold text-cyan-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-400" />
                  {watchedLectures.length} of {allLessons.length} completed
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {course.modules?.map((module, moduleIndex) => (
              <div
                key={module._id}
                className="bg-slate-800/60 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setOpenModule(
                      openModule === moduleIndex ? null : moduleIndex
                    )
                  }
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/40 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-100 block">
                        Module {moduleIndex + 1}: {module.title}
                      </span>
                      {module.description && (
                        <span className="text-xs text-gray-400 line-clamp-1">
                          {module.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {openModule === moduleIndex ? (
                    <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>

                {openModule === moduleIndex && (
                  <div className="px-3 pb-3 space-y-2 bg-slate-900/40">
                    {module.chapters.map((chapter, chapterIndex) => (
                      <div
                        key={chapter._id}
                        className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenChapter(
                              openChapter === chapter._id ? null : chapter._id
                            )
                          }
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {chapterIndex + 1}
                            </div>
                            <span className="font-semibold text-sm text-gray-200 line-clamp-1">
                              {chapter.title}
                            </span>
                          </div>
                          {openChapter === chapter._id ? (
                            <ChevronDown className="w-4 h-4 text-cyan-400 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </button>

                        {openChapter === chapter._id && (
                          <div className="px-2 pb-2 space-y-1 bg-slate-900/30">
                            {chapter.lessons.map((lesson, lessonIndex) => {
                              const isCompleted = watchedLectures.includes(lesson._id);
                              const isActive = selectedLesson?._id === lesson._id;

                              return (
                                <div
                                  key={lesson._id}
                                  onClick={() => setSelectedLesson(lesson)}
                                  className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                                    isActive
                                      ? "bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                                      : "hover:bg-slate-700/50 hover:translate-x-1"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <span
                                      className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded ${
                                        isActive
                                          ? "bg-white/20 text-white"
                                          : "bg-slate-700/50 text-gray-400"
                                      }`}
                                    >
                                      {lessonIndex + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm font-medium line-clamp-1 ${
                                          isActive ? "text-white" : "text-gray-300"
                                        }`}
                                      >
                                        {lesson.title}
                                      </p>
                                      {lesson.duration && (
                                        <p
                                          className={`text-xs mt-0.5 flex items-center ${
                                            isActive ? "text-cyan-100" : "text-gray-500"
                                          }`}
                                        >
                                          <Clock className="w-3 h-3 mr-1" />
                                          {lesson.duration}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                    {lesson.type === "pdf" && (
                                      <FileText
                                        className={`w-4 h-4 ${
                                          isActive ? "text-white" : "text-indigo-400"
                                        }`}
                                      />
                                    )}
                                    {isCompleted && (
                                      <CheckCircle
                                        className={`w-5 h-5 ${
                                          isActive ? "text-white" : "text-green-400"
                                        }`}
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 mt-4">
            <ReportForm
              type="report"
              subject={`Issue with Course: ${course.title}`}
              targetId={course._id}
            />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-6">
              <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                {selectedLesson?.title || "Select a lesson to begin"}
              </h3>
              {selectedLesson?.duration && (
                <div className="flex items-center space-x-4 text-gray-400">
                  <span className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1.5" />
                    Duration: {selectedLesson.duration}
                  </span>
                  {selectedLesson.type && (
                    <span className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-1.5" />
                      Type: {selectedLesson.type.toUpperCase()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                {selectedLesson ? (
                  selectedLesson.type === "video" && selectedLesson.url ? (
                    <video
                      src={selectedLesson.url}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full"
                      onTimeUpdate={handleTimeUpdate}
                    />
                  ) : selectedLesson.type === "pdf" && selectedLesson.url ? (
                    <div style={{ height: "100%", minHeight: "500px" }}>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                          fileUrl={selectedLesson.url}
                          onPageChange={(e) => {
                            const totalPages = e.doc.numPages;
                            const currentPage = e.currentPage;
                            const percent = (currentPage / totalPages) * 100;
                            if (
                              percent > 90 &&
                              selectedLesson._id &&
                              !watchedLectures.includes(selectedLesson._id)
                            ) {
                              markLectureWatchedS(courseId!, selectedLesson._id)
                                .then(() =>
                                  setWatchedLectures((prev) => [
                                    ...prev,
                                    selectedLesson._id,
                                  ])
                                )
                                .catch((err) => console.log(err));
                            }
                          }}
                        />
                      </Worker>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-lg">
                          Content not available
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400 text-lg">
                        Select a lesson to begin learning
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-indigo-600 rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-200">
                  Lesson Overview
                </h4>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                {selectedLesson?.description ||
                  "No description provided for this lesson."}
              </p>

              {progressPercent === 100 && (
                <div className="mt-8">
                  <div className="bg-gradient-to-br from-green-900/40 to-cyan-900/40 backdrop-blur-xl p-6 rounded-2xl border border-green-400/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-shrink-0 p-3 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-green-400 mb-2">
                          Congratulations! You completed this course!
                        </h5>
                        <p className="text-gray-200 text-base leading-relaxed mb-4">
                          You've finished all lessons. Take the quiz below to
                          earn your certificate.
                        </p>

                        {!isCertificateIssued ? (
                          <button
                            onClick={() =>
                              navigate(`/users/quiz/${course._id}`)
                            }
                            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 hover:scale-105 transition-transform duration-300 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-cyan-500/30"
                          >
                            Take Quiz
                          </button>
                        ) : (
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-yellow-500/30 text-center">
                            🎉 You've earned your certificate!
                            <button
                              onClick={() => navigate("/users/profile")}
                              className="ml-2 underline font-bold"
                            >
                              Claim it on your Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {liveSession?.isLive && (
                <div className="mt-6 p-4 bg-green-700 rounded-lg text-white">
                  <p>Instructor is live now!</p>
                  <button
                    className="mt-2 bg-white text-green-700 px-4 py-2 rounded"
                    onClick={() =>
                      navigate(`/users/live/${liveSession.sessionId}`)
                    }
                  >
                    Join Live
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;