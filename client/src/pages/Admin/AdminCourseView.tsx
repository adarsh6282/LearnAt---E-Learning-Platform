import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { errorToast } from "../../components/Toast";
import type { CourseViewType } from "../../types/user.types";
import { AdminCourseViewS } from "../../services/admin.services";

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
        const res = await AdminCourseViewS(courseId)
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !course)
    return (
      <div className="p-6 text-center text-gray-500">
        <BookOpen className="mx-auto mb-2 h-10 w-10" />
        {error || "Course not found"}
      </div>
    );

  return (
    <div className="h-170 pt-20 bg-gray-50 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white h-140 overflow-y-auto p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {course.title}
          </h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex flex-wrap gap-6 text-sm text-slate-700 mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.lectures?.length || 0} Lectures
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />₹{course.price}
            </div>
          </div>

          {course.lectures && course.lectures.length > 0 ? (
            <div className="space-y-6">
              {course.lectures.map((lecture, index) => (
                <div key={lecture._id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Lecture {index + 1}: {lecture.title}
                  </h4>
                  <video
                    controls
                    controlsList="nodownload"
                    className="w-full h-64 rounded-md bg-black"
                    src={lecture.videoUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No lectures available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseView;
