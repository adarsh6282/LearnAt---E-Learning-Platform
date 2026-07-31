import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getProgressS,
  getSpecificCourseS,
  markLectureWatchedS,
} from "../../services/user.services";
import type { CourseViewType, Lecture } from "../../types/user.types";
import teacherGif from "../../assets/Teacher.gif";
import celebrationAnimation from "../../assets/congratulations.json"; 
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
import Lottie from "lottie-react";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation(); 
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lecture | null>(null);
  const [liveSession, setLiveSession] = useState<{
    sessionId: string;
    isLive: boolean;
  } | null>(null);

  const navigate = useNavigate();
  const [watchedLectures, setWatchedLectures] = useState<string[]>([]);
  const [isCertificateIssued, setIsCertificateIssued] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
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
    if (location.state?.justCelebrated) {
      setShowCelebration(true);

      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 4000);

      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

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

  const handleTimeUpdate = async (e: React.SyntheticEvent<HTMLVideoElement>) => {
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
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <img
          src={teacherGif}
          alt="Loading..."
          className="w-64 h-64 object-contain"
        />
        <p className="mt-4 text-xl font-semibold text-neutral-400">
          Loading your course...
        </p>
      </div>
    );
  }

  const allLessons =
    course.modules?.flatMap((m) => m.chapters.flatMap((c) => c.lessons)) || [];
  const progressPercent = Math.floor(
    (watchedLectures.length / (allLessons.length || 1)) * 100
  );

  return (
    <div className="min-h-full bg-black text-white relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "0.3cm 0.3cm",
        }}
      />

      <Navbar />

      <div className="flex h-[calc(100vh-5rem)] relative z-10">
        <aside className="w-96 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-black/30 sticky top-0 z-20 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/10 ring-1 ring-green-500/20 rounded-lg text-green-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {course.title}
              </h2>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-white/5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-300">
                  Overall Progress
                </span>
                <span className="text-lg font-bold text-green-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
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
                className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setOpenModule(openModule === moduleIndex ? null : moduleIndex)
                  }
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0 w-9 h-9 bg-white/5 text-green-400 rounded-lg flex items-center justify-center ring-1 ring-white/10">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-100 block">
                        Module {moduleIndex + 1}: {module.title}
                      </span>
                      {module.description && (
                        <span className="text-xs text-neutral-400 line-clamp-1">
                          {module.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {openModule === moduleIndex ? (
                    <ChevronDown className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0 ml-2" />
                  )}
                </button>

                {openModule === moduleIndex && (
                  <div className="px-3 pb-3 space-y-2 bg-black/20">
                    {module.chapters.map((chapter, chapterIndex) => (
                      <div
                        key={chapter._id}
                        className="bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenChapter(
                              openChapter === chapter._id ? null : chapter._id
                            )
                          }
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex-shrink-0 w-7 h-7 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center text-xs font-bold ring-1 ring-green-500/20">
                              {chapterIndex + 1}
                            </div>
                            <span className="font-semibold text-sm text-gray-200 line-clamp-1">
                              {chapter.title}
                            </span>
                          </div>
                          {openChapter === chapter._id ? (
                            <ChevronDown className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-2" />
                          )}
                        </button>

                        {openChapter === chapter._id && (
                          <div className="px-2 pb-2 space-y-1 bg-black/30">
                            {chapter.lessons.map((lesson, lessonIndex) => {
                              const isCompleted = watchedLectures.includes(lesson._id);
                              const isActive = selectedLesson?._id === lesson._id;

                              return (
                                <div
                                  key={lesson._id}
                                  onClick={() => setSelectedLesson(lesson)}
                                  className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                                    isActive
                                      ? "bg-green-500 text-black shadow-lg shadow-green-500/20 scale-[1.02]"
                                      : "hover:bg-white/5 hover:translate-x-1 text-neutral-300"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <span
                                      className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded ${
                                        isActive
                                          ? "bg-black/20 text-black"
                                          : "bg-white/5 text-neutral-400"
                                      }`}
                                    >
                                      {lessonIndex + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm font-medium line-clamp-1 ${
                                          isActive ? "text-black" : "text-gray-300"
                                        }`}
                                      >
                                        {lesson.title}
                                      </p>
                                      {lesson.duration && (
                                        <p
                                          className={`text-xs mt-0.5 flex items-center ${
                                            isActive ? "text-black/70" : "text-neutral-500"
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
                                          isActive ? "text-black" : "text-green-400"
                                        }`}
                                      />
                                    )}
                                    {isCompleted && (
                                      <CheckCircle
                                        className={`w-5 h-5 ${
                                          isActive ? "text-black" : "text-green-400"
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-4xl font-extrabold mb-3 text-white">
                    {selectedLesson?.title || "Select a lesson to begin"}
                  </h3>
                  {selectedLesson?.duration && (
                    <div className="flex items-center space-x-4 text-neutral-400">
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

                {liveSession?.isLive && (
                  <div className="relative flex-shrink-0 self-start">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur-sm opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-600 to-pink-600 backdrop-blur-sm border border-red-400/50 rounded-lg shadow-xl px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="relative">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                          <div className="w-2 h-2 bg-white rounded-full relative"></div>
                        </div>
                        <span className="text-white font-bold text-xs uppercase tracking-wide">Instructor is Live Now</span>
                      </div>
                      <button
                        onClick={() => navigate(`/users/live/${liveSession.sessionId}`)}
                        className="w-full bg-white hover:bg-gray-50 text-red-600 font-semibold text-xs py-1.5 px-3 rounded transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1"
                      >
                        <span>Join</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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
                        <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                        <p className="text-neutral-400 text-lg">
                          Content not available
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                      <p className="text-neutral-400 text-lg">
                        Select a lesson to begin learning
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h4 className="text-xl font-bold text-white">
                  Lesson Overview
                </h4>
              </div>
              <p className="text-neutral-300 leading-relaxed text-base">
                {selectedLesson?.description ||
                  "No description provided for this lesson."}
              </p>

              {progressPercent === 100 && (
                <div className="mt-8">
                  <div className="bg-green-500/[0.07] backdrop-blur-xl p-6 rounded-2xl border border-green-500/20">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-shrink-0 p-3 bg-green-500/10 ring-1 ring-green-500/20 rounded-xl">
                        <Award className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-green-400 mb-2">
                          Congratulations! You completed this course!
                        </h5>
                        <p className="text-neutral-300 text-base leading-relaxed mb-4">
                          You've finished all lessons. Take the quiz below to
                          earn your certificate.
                        </p>

                        {!isCertificateIssued ? (
                          <button
                            onClick={() => navigate(`/users/quiz/${course._id}`)}
                            className="group/btn relative inline-flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 bg-green-500 text-black hover:ring-green-500/30 hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
                          >
                            Take Quiz
                          </button>
                        ) : (
                          <div className="text-neutral-300 text-base">
                            🎉 You've earned your certificate! 
                            <button
                              onClick={() => navigate("/users/profile")}
                              className="ml-2 text-green-400 underline font-bold hover:text-green-300"
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
            </div>
          </div>
        </main>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-[1000] w-screen h-screen pointer-events-none bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <Lottie 
            animationData={celebrationAnimation} 
            loop={true} 
            autoplay={true}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default CoursePage;