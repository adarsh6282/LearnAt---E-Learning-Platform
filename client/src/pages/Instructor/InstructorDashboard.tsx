import { useContext, useEffect, useState } from "react";
import { InstructorContext } from "../../context/InstructorContext";
import { reapplyS } from "../../services/instructor.services";
import { errorToast, successToast } from "../../components/Toast";
import InstructorChart from "../../components/InstructorChart";
import instructorApi from "../../services/instructorApiService";
import { useLocation } from "react-router-dom";

interface Dashboard {
  totalUsers: number;
  totalCourses: number;
}

const InstructorDashboard = () => {
  const context = useContext(InstructorContext);
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const location=useLocation()
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await instructorApi.get<Dashboard>("/instructors/dashboard");
      setDashboardData(res.data);
    };
    fetchDashboard();
  }, [location.pathname]);
  
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        await getInstructorProfile();
      } catch (err) {
        console.error("Error fetching instructor", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, []);
  if (!context) {
    return "no context here";
  }
  
  const { instructor, getInstructorProfile } = context;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleReapply = async () => {
    if (!resume) return errorToast("Please upload your resume");
    if(!instructor?.email) return errorToast("email is missing")
    const formData = new FormData();
    formData.append("email", instructor?.email);
    formData.append("resume", resume);
    try {
      await reapplyS(formData);
      successToast("Reapplication submitted!");
    } catch (err) {
      errorToast("Failed to submit reapplication");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (
    instructor?.isRejected &&
    !instructor?.isVerified &&
    instructor?.accountStatus === "rejected"
  ) {
    return (
      <div className="p-8 bg-yellow-50 min-h-screen">
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Application Rejected
        </h2>
        <p className="text-gray-700 mb-4">
          Please upload a new resume to reapply.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={handleReapply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Reapplication
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium">Total Users</h2>
          <p className="text-3xl font-bold">{dashboardData?.totalUsers}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium">Total Courses</h2>
          <p className="text-3xl font-bold">{dashboardData?.totalCourses}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Course Enrollments
          </h2>
          <InstructorChart type="course" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue</h2>
          <InstructorChart type="income" />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
