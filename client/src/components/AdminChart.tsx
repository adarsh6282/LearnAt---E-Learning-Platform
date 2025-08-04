import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import adminApi from "../services/adminApiService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: "course" | "income";
}

const AdminChart = ({ type }: ChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let labels: string[] = [];
        let data: number[] = [];

        if (type === "course") {
          const res = await adminApi.get<
            { title: string; enrolledCount: number }[]
          >("/admin/course-status");
          labels = res.data.map((item: any) => item.title);
          data = res.data.map((item: any) => item.enrolledCount);
        } else if (type === "income") {
          const res = await adminApi.get<{ month: string; revenue: number }[]>(
            "/admin/income-status"
          );
          labels = res.data.map((item: any) => item.month);
          data = res.data.map((item: any) => Number(item.revenue));
        }

        setChartData({
          labels,
          datasets: [
            {
              label: type === "course" ? "Enrolled Students" : "Revenue (₹)",
              data,
              backgroundColor: type === "course" ? "#0ea5e9" : "#10b981",
              borderColor: type === "income" ? "#10b981" : undefined,
              fill: type === "income",
              tension: 0.4,
              borderRadius: type === "course" ? 8 : 0,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [type]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          type === "course"
            ? "Course Enrollment Statistics"
            : "Monthly Revenue",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  if (loading)
    return <p className="text-center text-gray-400">Loading chart...</p>;

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      {chartData &&
        (type === "course" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        ))}
    </div>
  );
};

export default AdminChart;
