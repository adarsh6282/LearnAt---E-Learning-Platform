import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProgressS, getSpecificCourseS, markLectureWatchedS } from "../../services/user.services";
import type { CourseViewType, Lecture } from "../../types/user.types";
import { BookOpen, CheckCircle } from "lucide-react";
import ReportForm from "../../components/ReportForm";
import Navbar from "../../components/Navbar";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lecture | null>(null);
  const [watchedLectures, setWatchedLectures] = useState<string[]>([]);

  if (!courseId) return null;

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getSpecificCourseS(courseId);
      const courseData = res.data.course;
      setCourse(courseData);

      if (courseData.lectures && courseData.lectures.length > 0) {
        setSelectedLesson(courseData.lectures[0]);
      }

      const progressRes = await getProgressS(courseId)
      setWatchedLectures(progressRes.data.watchedLectures);
    };

    fetchCourse();
  }, [courseId]);

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
        await markLectureWatchedS(courseId,selectedLesson._id)
        setWatchedLectures((prev) => [...prev, selectedLesson._id]);
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <BookOpen className="w-8 h-8 mr-2 animate-pulse" />
        Loading Course...
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 relative overflow-hidden">
      <Navbar />
      <div className="flex h-[calc(100vh-5rem)]">
        <aside className="w-1/4 bg-white/5 backdrop-blur-lg border-r border-white/10 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
          <ul className="space-y-3">
            {course.lectures?.map((lecture, index) => {
              const isCompleted = watchedLectures.includes(lecture._id);
              return (
                <li
                  key={lecture._id}
                  onClick={() => setSelectedLesson(lecture)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-300 ${
                    selectedLesson?._id === lecture._id
                      ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white shadow-lg scale-[1.02]"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium">
                    {index + 1}. {lecture.title}
                  </span>
                  {isCompleted && (
                    <CheckCircle
                      className={`w-5 h-5 ${
                        selectedLesson?._id === lecture._id
                          ? "text-white"
                          : "text-fuchsia-400"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <ReportForm
              type="report"
              subject={`Issue with Course: ${course.title}`}
              targetId={course._id}
            />
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              {selectedLesson?.title}
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Course Progress</span>
                <span>
                  {Math.floor(
                    (watchedLectures.length / (course.lectures?.length || 1)) *
                      100
                  )}
                  % Complete
                </span>
              </div>
              <div className="w-full bg-gray-700 h-3 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-300"
                  style={{
                    width: `${Math.floor(
                      (watchedLectures.length /
                        (course.lectures?.length || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 border border-white/10 shadow-xl">
              {selectedLesson?.videoUrl ? (
                <video
                  src={selectedLesson.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                />
              ) : (
                <p className="text-center text-white mt-20">
                  Video not available
                </p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-white/10">
              <h4 className="text-lg font-semibold mb-2">
                Lecture Description
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {selectedLesson?.description || "No description provided."}
              </p>
              {Math.floor(
                (watchedLectures.length / (course.lectures?.length || 1)) * 100
              ) === 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg">
                  <h5 className="text-green-400 font-semibold mb-1">
                    🎉 Congratulations!
                  </h5>
                  <p className="text-gray-200 text-sm">
                    You’ve completed this course 100%. Your certificate is now
                    available in your{" "}
                    <Link
                      className="text-cyan-400 underline cursor-pointer hover:text-cyan-300"
                      to={"/users/profile"}
                      state={{ activeTab: "Certificates" }}
                    >
                      Profile → Certificates
                    </Link>{" "}
                    section.
                  </p>
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
