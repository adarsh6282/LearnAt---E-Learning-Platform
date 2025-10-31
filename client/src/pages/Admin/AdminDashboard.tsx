import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { errorToast } from "../../components/Toast";
import type { DashboardData } from "../../types/admin.types";
import { getDashboardS } from "../../services/admin.services";
import AdminChart from "../../components/AdminChart";
import type { AxiosError } from "axios";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardS();
        setDashboardData(res.data);
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard()
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-180">
        <BeatLoader color="#7e22ce" size={30} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium">Total Users</h2>
          <p className="text-3xl font-bold">{dashboardData?.totalUsers}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-medium">Total Instructors</h2>
          <p className="text-3xl font-bold">{dashboardData?.totalTutors}</p>
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
          <AdminChart type="course" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue</h2>
          <AdminChart type="income" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
