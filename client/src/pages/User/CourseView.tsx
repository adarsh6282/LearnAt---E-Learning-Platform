import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificCourseS } from "../../services/user.services";
import type { CourseViewType, Lecture } from "../../types/user.types";
import { BookOpen } from "lucide-react";
import axiosInstance from "../../services/apiService";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lecture | null>(null);
  const [watchedLectures, setWatchedLectures] = useState<string[]>([]);
  const totalLectures = course?.lectures?.length || 1;
  const progressPercent = Math.floor(
    (watchedLectures.length / totalLectures) * 100
  );

  const token = localStorage.getItem("usersToken");
  if (!courseId) return;

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getSpecificCourseS(courseId, token!);
      const courseData = res.data.course;
      setCourse(courseData);

      if (courseData.lectures && courseData.lectures.length > 0) {
        setSelectedLesson(courseData.lectures[0]);
      }

      const progressRes=await axiosInstance.get<{watchedLectures:string[]}>(`/users/course-view/progress/${courseId}`,{headers:{Authorization:`Bearer ${token}`}})
      setWatchedLectures(progressRes.data.watchedLectures)
    };

    fetchCourse();
  }, []);

  if (!course)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <BookOpen className="w-8 h-8 mr-2" />
        Loading Course...
      </div>
    );

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
        await axiosInstance.post(
          `/users/course-view/progress/${courseId}`,
          { lectureId: selectedLesson._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchedLectures((prev) => [...prev, selectedLesson._id]);
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-6 overflow-y-auto border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
        <ul className="space-y-3">
          {course.lectures?.map((lecture, index) => (
            <li
              key={lecture._id}
              onClick={() => setSelectedLesson(lecture)}
              className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                selectedLesson?._id === lecture._id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="font-medium">
                {index + 1}. {lecture.title}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Video Player & Details */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            {selectedLesson?.title}
          </h3>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Course Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 h-3 rounded-md overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 border border-gray-700">
            {selectedLesson?.videoUrl ? (
              <video
                src={selectedLesson.videoUrl}
                controls
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
              />
            ) : (
              <p className="text-center text-white mt-20">
                Video not available
              </p>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Lecture Description</h4>
            <p className="text-gray-300 leading-relaxed">
              {selectedLesson?.description || "No description provided."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
