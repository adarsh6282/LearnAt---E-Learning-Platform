import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Tutor } from "../../types/instructor.types";
import { adminTutorView } from "../../services/admin.services";

const TutorDetail = () => {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedTutorResume, setSelectedTutorResume] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const res = await adminTutorView(tutorId!);
        setTutor(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTutorDetails();
  }, [tutorId]);

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading tutor details...
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100 py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
          Tutor Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="text-sm text-gray-500">Name</h4>
            <p className="text-lg font-medium">{tutor.name}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Email</h4>
            <p className="text-lg font-medium">{tutor.email}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Username</h4>
            <p className="text-lg font-medium">@{tutor.username}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Phone</h4>
            <p className="text-lg font-medium">{tutor.phone}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Title</h4>
            <p className="text-lg font-medium">{tutor.title}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Experience</h4>
            <p className="text-lg font-medium">
              {tutor.yearsOfExperience} years
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Education</h4>
            <p className="text-lg font-medium">{tutor.education}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Status</h4>
            <p
              className={`text-lg font-medium ${
                tutor.accountStatus === "active"
                  ? "text-green-600"
                  : tutor.accountStatus === "blocked"
                    ? "text-red-500"
                    : "text-yellow-500"
              }`}
            >
              {tutor.accountStatus.charAt(0).toUpperCase() +
                tutor.accountStatus.slice(1)}
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-500">Blocked</h4>
            <p
              className={`text-lg font-medium ${
                tutor.isBlocked ? "text-red-600" : "text-green-600"
              }`}
            >
              {tutor.isBlocked ? "Yes" : "No"}
            </p>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <h4 className="text-sm text-gray-500">Resume</h4>
            <button
              onClick={() => {
                setSelectedTutorResume(tutor.resume);
              }}
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Resume
            </button>
            {selectedTutorResume && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 h-[80vh] relative overflow-hidden">
                  <button
                    onClick={() => setSelectedTutorResume(null)}
                    className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1 text-sm z-10"
                  >
                    ✕
                  </button>

                  <div className="w-full h-full overflow-auto p-4">
                    <img
                      src={selectedTutorResume}
                      alt="Tutor Resume"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;
